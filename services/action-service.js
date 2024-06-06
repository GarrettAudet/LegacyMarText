const { postsDb, searchesDb, usersDb } = require('../connections/cloudant-connections');
const searchService = require("./search-service");
const {getLatLng} = require("../services/maps-service");


const createPost = async ({context, user}) => {
  try {
    await postsDb.insert({ ...context, dateCreated: new Date(), uid: user._id, location: user.location });
    return ["OK. I created the post."];
  } catch (err) {
    return ["Something went wrong. I failed to create the post."];
  }
};

const saveSearch = async (uid, posts) => {
  let _rev;
  try {
    _rev = (await searchesDb.get(uid))._rev;
  } catch (error) {
    // Pass
  }
  return searchesDb.insert({_id: uid, posts, _rev});
};

const searchPosts = async({context, user}) => {
  try {
    const {query, category} = context;
    const {location} = user;
    if (!query || !category || !location) {
      throw new Error("Search action requires query, category, and location");
    }
    const posts = await searchService.search({query, category, location});
    if (posts.length < 1) {
      return [`No ${category} posts found for "${query}" within ${searchService.maxDistance}km`];
    }
    saveSearch(user._id, posts)
      .catch(error => console.error("Error, unable to save search", error));
    return ["Here are your results, send a number to see more info.", searchService.formatSearchResults(posts)];
  } catch(error) {
    console.error("Failed to search posts", user, context, error);
    return ["Unable to search posts at the moment, please try again later"]
  }
};

const getPostDetail = async({context, user}) => {
  try {
    const postNumber = parseInt(context.post_number);
    if (!postNumber) {
      throw new Error("Must supply a post number");
    }
    const {posts} = await searchesDb.get(user._id);
    if (posts.length < postNumber) {
      return [`Please supply a number between 1 and ${posts.length}`];
    }
    const post = posts[postNumber - 1];
    return [`${postNumber}. ${post.title}.\n${post.description}`];
  } catch(error) {
    console.error("Failed to get post details", user, context, error);
    return ["Unable to get that post, please try again later"]
  }
};

const setUserLocation = async (uid, location) => {
  const user = await usersDb.get(uid);
  await usersDb.insert({...user, location});
};

const setLocation = async({context, user}) => {
  try {
    const {location} = context;
    const geo = await getLatLng(location);
    await setUserLocation(user._id, geo);
    return ["Perfect, your location has been updated"];
  } catch(error) {
    console.error("Failed to set location", context, user, error);
    return ["Failed to update your location, please try again later"];
  }
};

const doAction = async (actionName, context, user) => {
  console.log(`Running action ${actionName} with ${JSON.stringify(context)}`);
  switch (actionName.toLowerCase()) {
    case "create_post":
      return await createPost({context, user});
    case "search_posts":
      return await searchPosts({context, user});
    case "get_post_detail":
      return await getPostDetail({context, user});
    case "set_location":
      return await setLocation({context, user});
    default:
      return [`No action found: ${actionName}`];
  }
};


module.exports = {doAction};