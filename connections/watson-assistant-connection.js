const AssistantV2 = require('ibm-watson/assistant/v2');

const assistant = new AssistantV2({
  iam_apikey: process.env.WATSON_API_KEY,
  url: process.env.WATSON_URL,
  version: '2018-09-19'
});

module.exports = assistant;