const {postsDb} = require("../connections/cloudant-connections");
const {getDistance} = require("./location-service");
const FuzzySearch = require('fuzzy-search');

const maxDistance = 100; // KM

const search = async ({category, query, location}, numResults = 10) => {
  const {docs} = await postsDb.find({selector: {category}});
  const searcher = new FuzzySearch(docs, ["title", "description"]);
  const posts = searcher.search(query);
  const postsWithDistance = posts.map(post => ({...post, distance: getDistance(location, post.location)}));
  console.log(postsWithDistance);

  const sortedPosts = postsWithDistance.filter(({distance}) => distance < maxDistance).sort((a, b) => b.distance - a.distance);
  return sortedPosts.slice(0, numResults);
};

const formatSearchResults = posts =>
  posts.map((post, index) =>
    `${index + 1}. ${post.title}`).join("\n");

module.exports = {search, maxDistance, formatSearchResults};
