require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { handleGenerateNewShortUrl } = require("./controller/url");
const connectToMongoDB = require("./connection");

const express = require("express");
const URL = require("./models/url");

const app = express();
const PORT = 8000;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

client.on("messageCreate", async (message) => {
  console.log("message", message.author.bot);
  if (message.author.bot) return;
  if (message.content.startsWith("create")) {
    const url = message.content.split("create")?.[1];
    const shortId = await handleGenerateNewShortUrl(url);
    message.reply({
      content: `http://localhost:8000/${shortId}`,
    });
    return;
  }
  message.reply({
    content: "Hi from Bot!",
  });
});

client.on("interactionCreate", (interaction) => {
  console.log(interaction);
  interaction.reply({
    content: "Pong!",
  });
});

client.login(process.env.DISCORD_TOKEN);

app.get("/:shortId", async (req, res) => {
  const shortId = req?.params?.shortId;
  const url = await URL.findOne({ shortId });

  if (!url) return res.error("URL not found¡");

  return res.redirect(url.redirectUrl.trim());
});

app.listen(PORT, () => console.log(`Server Started at POST: ${PORT}`));
