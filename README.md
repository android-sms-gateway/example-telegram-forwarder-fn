<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![License][license-shield]][license-url]
[![Issues][issues-shield]][issues-url]
[![Stars][stars-shield]][stars-url]



<!-- PROJECT TITLE -->
<br />
<div align="center">
  <h3 align="center">Example Telegram Forwarder Function</h3>

  <p align="center">
    Zero-dependency cloud function to forward SMS messages to Telegram
    <br />
    <a href="https://github.com/android-sms-gateway/example-telegram-forwarder-fn"><strong>Explore the repo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/android-sms-gateway/example-telegram-forwarder-fn/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/android-sms-gateway/example-telegram-forwarder-fn/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
    - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)


<!-- ABOUT THE PROJECT -->
## About The Project

This repository contains a zero-dependency [cloud function](https://en.wikipedia.org/wiki/Function_as_a_service) that forwards incoming SMS messages received through [SMSGate App](https://github.com/capcom6/android-sms-gateway) webhooks to a specified Telegram chat. The entire implementation is a single Node.js file with no external packages.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Node.js][Nodejs-shield]][Nodejs-url] — native `fetch`, zero dependencies
* [![Telegram][Telegram-shield]][Telegram-url] — Bot API (`sendMessage`)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

- **Node.js 18+** (required for native `fetch`)
- **SMSGate App** installed on your device in Local, Cloud, or Private mode
- A **Telegram bot** and its token — create one via [BotFather](https://core.telegram.org/bots/features#botfather)
- A **Telegram chat ID** where messages will be forwarded

### Setup

1. Clone the repository
   ```sh
   git clone https://github.com/android-sms-gateway/example-telegram-forwarder-fn.git
   ```
2. No dependencies to install — the function uses only Node.js built-in APIs. Run `npm install` only if you add external packages.
3. Set up your environment variables (see [Environment Variables](#environment-variables))
4. Deploy to your preferred cloud provider (AWS Lambda, Google Cloud Functions, etc.). The handler uses the standard `(event, context)` FaaS signature. You may need to adapt the entry point — consult your provider's documentation.
5. [Register a webhook in SMSGate App](https://docs.sms-gate.app/getting-started/webhooks/) with the URL of your deployed function, appending `?apiKey=YOUR_API_KEY` as a query parameter.

#### Environment Variables

| Variable             | Description                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| `API_KEY`            | Random secret for webhook authentication, passed as the `apiKey` query parameter |
| `TELEGRAM_BOT_TOKEN` | Token of your Telegram bot (from BotFather)                                      |
| `TELEGRAM_CHAT_ID`   | ID of the Telegram chat where messages will be forwarded                         |

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE -->
## Usage

The function is triggered by incoming webhook events from SMSGate App. Upon receiving an SMS, it:

1. Validates the `apiKey` query parameter against `API_KEY` (returns `401 Unauthorized` on mismatch)
2. Parses the webhook JSON payload — expects `payload.phoneNumber` and `payload.message`
3. Escapes HTML special characters in the message body
4. Sends a formatted message to Telegram via the Bot API (`sendMessage`) with HTML parse mode
5. Returns `200 OK` on success

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- TESTING -->
## Testing

A [`requests.http`](requests.http) file is provided for manual testing with the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension for VS Code. It includes:

- Endpoints to verify your Telegram bot (`getMe`, `getUpdates`, `getWebhookInfo`)
- A sample POST request against a deployed Lambda URL with a realistic SMS webhook payload

For local testing with the REST Client extension: create a `.env` file (use [`.env.example`](.env.example) as a template) — the `$dotenv` placeholders in `requests.http` read from it automatically. Then open `requests.http` and click **Send Request** above each block.
For cloud or hosted deployments, set these variables through your provider's environment configuration (e.g., AWS Lambda environment variables, Google Cloud Functions `--set-env-vars`) instead of a `.env` file.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue. Don't forget to give the project a star!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the Apache-2.0 License. See [`LICENSE`](LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Project Link: [https://github.com/android-sms-gateway/example-telegram-forwarder-fn](https://github.com/android-sms-gateway/example-telegram-forwarder-fn)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Telegram Bot API](https://core.telegram.org/bots/api)
* [BotFather](https://core.telegram.org/bots/features#botfather)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS -->
[license-shield]: https://img.shields.io/github/license/android-sms-gateway/example-telegram-forwarder-fn?style=for-the-badge
[license-url]: https://github.com/android-sms-gateway/example-telegram-forwarder-fn/blob/main/LICENSE
[issues-shield]: https://img.shields.io/github/issues/android-sms-gateway/example-telegram-forwarder-fn?style=for-the-badge
[issues-url]: https://github.com/android-sms-gateway/example-telegram-forwarder-fn/issues
[stars-shield]: https://img.shields.io/github/stars/android-sms-gateway/example-telegram-forwarder-fn?style=for-the-badge
[stars-url]: https://github.com/android-sms-gateway/example-telegram-forwarder-fn/stargazers
[Nodejs-shield]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Nodejs-url]: https://nodejs.org/
[Telegram-shield]: https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white
[Telegram-url]: https://core.telegram.org/bots/api