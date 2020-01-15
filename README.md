# Robot comique

A bot that posts a webcomic from [FaaS and Furious](https://faasandfurious.com/) everyday on slack.

## Install

```bash
npm install
```

## Configure slack

1. Add the [Incoming WebHooks application](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks) to your workspace.
2. Configure a webhook on a channel, and fill the value in `.env`: `echo "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/ABCDEFGHI/JKLMNOPQR/STUVWXYZ0123456789" > .env`


## Deploy on AWS

```bash
serverless deploy
```
