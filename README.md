# 🧪 SMSGate Telegram Forwarder Function

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stars][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

A zero-dependency Node.js cloud function that forwards SMS messages received through SMSGate webhooks to a Telegram chat. Part of the SMSGate ecosystem - see the [webhooks guide](https://docs.sms-gate.app/getting-started/webhooks/) for how SMSGate delivers events.

## 📖 About

This example is a single-file [Node.js](https://nodejs.org/) function ([index.js](index.js)) with no external packages: it validates an API key, parses the incoming SMS webhook, and sends the message to a Telegram chat via the Bot API. Deploy it to AWS Lambda, or another platform that accepts a Lambda-compatible HTTP event and proxy-response contract.

## 📚 Table of Contents

- [📖 About](#-about)
- [📚 Table of Contents](#-table-of-contents)
- [⭐ Features](#-features)
- [📦 Prerequisites](#-prerequisites)
- [🚀 Quickstart](#-quickstart)
- [💻 Usage](#-usage)
- [🔌 How It Works](#-how-it-works)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [⚖️ License](#️-license)

## ⭐ Features

- Zero dependencies - native `fetch` only, Node.js 18+
- API key validation on the webhook URL (`apiKey` query parameter)
- HTML-escaped message bodies for Telegram HTML parse mode
- Manual test requests in [requests.http](requests.http)

## 📦 Prerequisites

- Node.js 18+ (required for native `fetch`)
- SMS Gateway for Android installed and configured on a device
- A Telegram bot token from [BotFather](https://core.telegram.org/bots)
- A Telegram chat ID where messages will be forwarded
- A random `API_KEY` secret for webhook authentication
- An IAM execution role for the function, for example one with the `AWSLambdaBasicExecutionRole` managed policy attached

## 🚀 Quickstart

1. Clone the repository:

```bash
git clone https://github.com/android-sms-gateway/example-telegram-forwarder-fn.git
cd example-telegram-forwarder-fn
```

2. No dependencies to install - the handler uses only Node.js built-ins.

3. Configure the environment variables from [.env.example](.env.example):

| Variable | Description |
| -------- | ----------- |
| `API_KEY` | Secret passed as the `apiKey` query parameter on the webhook URL |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token from BotFather |
| `TELEGRAM_CHAT_ID` | Chat ID where messages will be forwarded |

### Deploy to AWS Lambda

The repository ships no provider configuration - [index.js](index.js) exposes `module.exports.handler`, the standard Lambda signature. Package the handler into `function.zip` (`zip function.zip index.js`), create the function with the three environment variables, expose it over HTTP with a Function URL, then register that URL as a webhook:

```bash
aws lambda create-function \
  --function-name smsgate-telegram-forwarder \
  --runtime nodejs24.x \
  --handler index.handler \
  --role arn:aws:iam::<ACCOUNT_ID>:role/<LAMBDA_ROLE> \
  --zip-file fileb://function.zip
aws lambda wait function-active-v2 \
  --function-name smsgate-telegram-forwarder
aws lambda update-function-configuration \
  --function-name smsgate-telegram-forwarder \
  --environment "Variables={API_KEY=...,TELEGRAM_BOT_TOKEN=...,TELEGRAM_CHAT_ID=...}"
```

Expose the function over HTTP and allow public invocation:

```bash
aws lambda create-function-url-config \
  --function-name smsgate-telegram-forwarder \
  --auth-type NONE \
  --invoke-mode BUFFERED
aws lambda add-permission \
  --function-name smsgate-telegram-forwarder \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE
aws lambda add-permission \
  --function-name smsgate-telegram-forwarder \
  --statement-id FunctionURLInvokeFunction \
  --action lambda:InvokeFunction \
  --principal "*" \
  --invoked-via-function-url
```

`create-function-url-config` prints the function URL to use in the next step. The two `add-permission` calls are required: the AWS CLI does not add the resource-based policy for a `NONE` function URL, and without it the endpoint answers `403 Forbidden` even though the URL exists. The policy makes the endpoint public, so `API_KEY` is the only thing protecting it - use a long random value and rotate it if it leaks.

4. Register the function URL printed above as a webhook in SMS Gateway for Android, appending `?apiKey=<YOUR_API_KEY>` as a query parameter - the handler rejects requests without a matching key with `401 Unauthorized`.

## 💻 Usage

Send a test webhook:

```bash
curl -X POST "https://<YOUR_FUNCTION_URL>/?apiKey=<YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"payload":{"phoneNumber":"+12025550123","message":"Hello from SMSGate"}}'
```

The function answers `200 OK` after the Telegram API returns an HTTP response - this does not confirm that Telegram accepted or delivered the message. [requests.http](requests.http) contains ready-made REST Client requests: bot `getMe`, `getUpdates`, `getWebhookInfo`, and a sample webhook POST. Its `{{$dotenv VARIABLE}}` placeholders read from a local `.env` file - copy [.env.example](.env.example) to `.env` and fill in the values.

## 🔌 How It Works

The webhook flow, all in [index.js](index.js):

1. `handler` validates `event.queryStringParameters.apiKey` against `API_KEY` (returns 401 on mismatch)
2. The body is parsed and `escapeHTML()` sanitizes the message for Telegram
3. `sendMessage` is called on the Telegram Bot API with HTML parse mode
4. The function returns `200 OK` once the Telegram API responds; the handler does not inspect that response, so this does not confirm that Telegram accepted or delivered the message

## 📚 Documentation

- [Central docs](https://docs.sms-gate.app/)
- [Webhooks guide](https://docs.sms-gate.app/getting-started/webhooks/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [GitHub repository](https://github.com/android-sms-gateway/example-telegram-forwarder-fn)

## 🤝 Contributing

Contributions are welcome - open an issue or submit a pull request on the [GitHub repository](https://github.com/android-sms-gateway/example-telegram-forwarder-fn).

## ⚖️ License

Apache-2.0. See [LICENSE](LICENSE).

<!-- Reference-style badge URLs: style=for-the-badge is mandatory -->
[contributors-shield]: https://img.shields.io/github/contributors/android-sms-gateway/example-telegram-forwarder-fn?style=for-the-badge
[contributors-url]: https://github.com/android-sms-gateway/example-telegram-forwarder-fn/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/android-sms-gateway/example-telegram-forwarder-fn?style=for-the-badge
[forks-url]: https://github.com/android-sms-gateway/example-telegram-forwarder-fn/network/members
[stars-shield]: https://img.shields.io/github/stars/android-sms-gateway/example-telegram-forwarder-fn?style=for-the-badge
[stars-url]: https://github.com/android-sms-gateway/example-telegram-forwarder-fn/stargazers
[issues-shield]: https://img.shields.io/github/issues/android-sms-gateway/example-telegram-forwarder-fn?style=for-the-badge
[issues-url]: https://github.com/android-sms-gateway/example-telegram-forwarder-fn/issues
[license-shield]: https://img.shields.io/github/license/android-sms-gateway/example-telegram-forwarder-fn?style=for-the-badge
[license-url]: https://github.com/android-sms-gateway/example-telegram-forwarder-fn/blob/master/LICENSE
