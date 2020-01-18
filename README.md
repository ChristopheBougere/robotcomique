# Robot comique

A bot that posts a webcomic from [FaaS and Furious](https://faasandfurious.com/) everyday on slack.

## Install

```bash
npm install
```

## Configure slack

1. Add the [Incoming WebHooks application](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks) to your workspace and configure a webhook on a channel.
2. Create and fill `.env` file:
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/ABCDEFGHI/JKLMNOPQR/STUVWXYZ0123456789
ONLY_NEW=true # set to false if you want a random webcomic in there is nothing new
```


## Deploy on AWS

```bash
serverless deploy
```
