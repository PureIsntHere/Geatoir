const express = require('express');
const path = require('path');
const axios = require('axios');
const {Client,GatewayIntentBits,ActionRowBuilder,ButtonBuilder,ButtonStyle} = require('discord.js');
const linkvertise = require('linkvertise');

//Config Settings
const DISCORD_TOKEN  = 'Bot Token Here';
//Server ID
const GUILD_ID = 'Server ID Here';
//Role ID Given on claim
const ROLE_ID = 'Role ID Here';
//Enable Full Script API from Linkvertise and grab the 7 digit code from the html tag script
const LINKVERTISE_CODE   = 1111111;
//Base Url for webserver. Server IP, Domain, Ngrok url, etc. Script uses port 3000 for the webserver by default
const BASE_URL = 'http://localhost:3000';
//Anti Bypass Token from Linkvertise. Enable it in settings then copy the token
const ANTI_BYPASS_TOKEN  = '';
//Channel ID For logging verification attempts
const LOG_CHANNEL_ID     = '';
//Channel ID For where the claim message will be sent
const MESSAGE_CHANNEL_ID = '';

const app = express();
const client = new Client({ intents: [ GatewayIntentBits.Guilds ] });

const ALLOWED_REFERERS = [
  'https://linkvertise.com/',
  'https://publisher.linkvertise.com/'
];

//Send Style sheet and js file
app.get('/assets/style.css', (req, res) =>
  res.sendFile(path.join(__dirname, 'assets', 'style.css'))
);
app.get('/assets/site.js', (req, res) =>
  res.sendFile(path.join(__dirname, 'assets', 'site.js'))
);

//Linkvertise Redirect and Auth
app.get('/complete/:userId', async (req, res) => {
  const { userId } = req.params;
  const { hash } = req.query;
  const referer = req.headers.referer || '';
  const logCh = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);

  if (!ANTI_BYPASS_TOKEN || !hash || !referer) {
    logCh?.send(`<@${userId}> tried to bypass (missing data).`);
    return res.status(403).sendFile(path.join(__dirname, 'pages', 'access-denied.html'));
  }

  if (!ALLOWED_REFERERS.some(r => referer.startsWith(r))) {
    logCh?.send(`<@${userId}> tried to bypass (bad referer: ${referer}) (bypass.vip)`);
    return res.status(403).sendFile(path.join(__dirname, 'pages', 'access-denied.html'));
  }

  try {
    const url = `https://publisher.linkvertise.com/api/v1/anti_bypassing?token=${ANTI_BYPASS_TOKEN}&hash=${hash}`;
    const { data } = await axios.post(url);

    if (data.status === true) {
      logCh?.send(`<@${userId}> passed verification.`);
      return res.sendFile(path.join(__dirname, 'pages', 'complete.html'));
    } else {
      logCh?.send(`<@${userId}> failed verification.`);
      return res.status(403).sendFile(path.join(__dirname, 'pages', 'access-denied.html'));
    }
  } catch (err) {
    logCh?.send(`Error for <@${userId}>: ${err.message}`);
    return res.status(500).sendFile(path.join(__dirname, 'pages', 'access-denied.html'));
  }
});

//Claim Role Endpoint
app.get('/claim/:userId', async (req, res) => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const member = await guild.members.fetch(req.params.userId);
    await member.roles.add(ROLE_ID);
    return res.sendFile(path.join(__dirname, 'pages', 'claim.html'));
  } catch {
    return res.status(500).sendFile(path.join(__dirname, 'pages', 'claim.html'));
  }
});

//Express webserver for handling claim and completion
app.listen(3000, () => {
  console.log('HTTP server listening on port 3000');
});

//Discord Bot Client
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch(MESSAGE_CHANNEL_ID).catch(() => null);
  if (!channel || !channel.isTextBased()) return;

  const content = 'Click the button below to gain access to boss logs:';
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('claim_button')
      .setLabel('Claim Role')
      .setStyle(ButtonStyle.Primary)
  );

  const messages = await channel.messages.fetch({ limit: 50 });
  const existing = messages.find(msg =>
    msg.author.id === client.user.id &&
    msg.components.some(row => row.components.some(c => c.customId === 'claim_button'))
  );

  if (existing) {
    await existing.edit({ content, components: [row] });
  } else {
    await channel.send({ content, components: [row] });
  }

//Bot Invite Link
  const inviteURL = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=268438528`;
  console.log(`Invite the bot using:\n${inviteURL}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton() || interaction.customId !== 'claim_button') return;

  const userId  = interaction.user.id;
  const landing = `${BASE_URL}/complete/${userId}`;
  const adLink  = linkvertise(landing, LINKVERTISE_CODE);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Complete Verification')
      .setStyle(ButtonStyle.Link)
      .setURL(adLink)
  );

  await interaction.reply({
    content: 'Here is your verification link:',
    components: [row],
    ephemeral: true
  });
});

client.login(DISCORD_TOKEN);