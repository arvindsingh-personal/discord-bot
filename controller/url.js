const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortUrl(url) {
  if (!url) res.status(400).json({ error: "URL is required" });
  const shortId = shortid();

  await URL.create({
    shortId: shortId,
    redirectUrl: url,
  });

  return shortId;
}

module.exports = {
  handleGenerateNewShortUrl,
};
