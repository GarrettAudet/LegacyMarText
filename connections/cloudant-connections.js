const Cloudant = require("@cloudant/cloudant");
const cloudant = Cloudant({
  account: process.env.CLOUDANT_USERNAME, password: process.env.CLOUDANT_PASSWORD
});
module.exports = {
  usersDb: cloudant.use("users"),
  messagesDb: cloudant.use("messages"),
  postsDb: cloudant.use("posts"),
  searchesDb: cloudant.use("searches")
};