const { IncomingWebhook } = require('@slack/webhook');
const Parser = require('rss-parser');
const cheerio = require('cheerio')
const fetch = require('node-fetch');

const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
const parser = new Parser();

const isToday = someDate => {
  const today = new Date();
  return someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear();
};

const sendMessage = async ({ text, title, imageUrl, altText }) => {
  const blocks = [];
  if (imageUrl) {
    blocks.push({
      type: 'image',
      title: {
        type: 'plain_text',
        text: title,
      },
      image_url: imageUrl,
      alt_text: altText,
    });
  }
  const params = {
    text,
    blocks,
  };
  console.log(`sending slack message with params=${JSON.stringify(params, null, 2)}`);
  await webhook.send(params);
};

const handleRssItem = async item => {
  try {
    const { title, isoDate, content } = item;
    if (isToday(new Date(isoDate))) {
      const $ = cheerio.load(content);
      console.log('found a new webcomic today');
      await sendMessage({
        title,
        text: $('img').attr('title'),
        imageUrl: $('img').attr('src'),
        altText: $('img').attr('alt'),
      });
      return true;
    }
  } catch (err) {
    console.error(err);
  }
  return false;
};

const handler = async () => {
  const feed = await parser.parseURL('https://faasandfurious.com/feed.xml');
  console.log('feed', JSON.stringify(feed), null, 2);
  const newComics = await Promise.all(feed.items.map(handleRssItem));
  if (process.env.ONLY_NEW !== 'true' && !newComics.some(r => r)) {
    console.log('nothing new, pick a random webcomic then');
    const lastId = Math.max(...feed.items.map(({ guid }) => guid.split('/').pop()));
    const randomId = Math.floor(Math.random() * lastId) + 1;
    const res = await fetch(`https://faasandfurious.com/${randomId}`);
    const $ = cheerio.load(await res.text());
    await sendMessage({
      title: $('.comic-panel.center img').attr('alt'),
      text: $('.comic-panel.center img').attr('title'),
      imageUrl: $('.comic-panel.center img').attr('src'),
      altText: $('.comic-panel.center img').attr('alt'),
    });
  }
  console.log('done');
};

module.exports.handler = handler;
