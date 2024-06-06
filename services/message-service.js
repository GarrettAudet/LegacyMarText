const assistant = require("../connections/watson-assistant-connection");
const assistant_id = process.env.WATSON_ASSISTANT_ID;
const { usersDb} = require('../connections/cloudant-connections');
const {doAction} = require("./action-service");


const FIVE_MIN = 5 * 60 * 1000;

const hasSessionExpired = (sessionTimestamp) => {
  return sessionTimestamp + FIVE_MIN < Date.now();
};

const createSession = async user => {
  const { session_id: sessionId } = await assistant.createSession({ assistant_id });
  // noinspection JSIgnoredPromiseFromCall No need to wait for updating user's session ID
  await usersDb.insert({ ...user, sessionId, sessionTimestamp: Date.now()})
    .catch(error => console.error("Unable to save created session", user, sessionId, error));
  return sessionId;
};

const createUser = async uid => {
  try {
    const user = { _id: uid, location: { lat: 45.41117, lng: -75.69812 } };
    const { rev: _rev } = await usersDb.insert(user);
    return { ...user, _rev };
  } catch (error) {
    console.log("Unable to create user", error);
    throw error;
  }
};

const getUser = async(uid) => {
  try {
    return await usersDb.get(uid);
  } catch (error) {
    console.debug(`No user found, creating new user with ${uid}`);
    return await createUser(uid);
  }
};


const getReply = async ({Body, From: uid, ...rest}) => {
  console.log("Got message", Body, rest);
  const user = await getUser(uid);
  console.debug('User: ', user);

  let sessionId;
  if (user.sessionId && !hasSessionExpired(user.sessionTimestamp)) {
    console.debug("Found existing session");
    // noinspection JSIgnoredPromiseFromCall
    usersDb.insert({...user, sessionTimestamp: Date.now()})
      .catch(error => console.error("Unable to update user's session timestamp", user, error));
    sessionId = user.sessionId;
  } else {
    console.debug("Creating new session for user");
    sessionId = await createSession(user);
    user.sessionId = sessionId;
  }

  const { output, context } = await assistant.message({
    assistant_id,
    session_id: sessionId,
    input: {
      text: Body,
      options: {
        return_context: true
      }
    },
  });
  console.debug("Got response", JSON.stringify(output, null, 2));
  console.debug("Context", JSON.stringify(context, null, 2));
  if (output.user_defined && output.user_defined.action) {
    const messages = await doAction(output.user_defined.action, context.skills["main skill"].user_defined, user);
    return {messages};
  }
  const messages = output.generic
    .filter(r => r.response_type === "text")
    .map(r => r.text);
  return {messages, debug: output};
};

module.exports = {getReply};