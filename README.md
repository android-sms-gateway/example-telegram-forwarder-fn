# Example Telegram Forwarder Function

This repository contains a Cloud Function designed to forward incoming SMS messages received through the [SMS Gateway for Android™](https://github.com/capcom6/android-sms-gateway) Webhooks to a specified Telegram chat.

## Prerequisites

- Node.js installed on your machine
- SMS Gateway installed on your device in any mode: Local, Cloud or Private
- A Telegram bot and its token, see [here](https://core.telegram.org/bots/features#botfather)
- A Telegram chat ID where messages will be forwarded

## Getting Started

1. Clone this repository to your local machine.
2. Install the required dependencies by running `npm install`.
3. Set up your environment variables to include:
   - `API_KEY`: Random value, which will be passed to cloud function in `apiKey` query parameter from webhook.
   - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token.
   - `TELEGRAM_CHAT_ID`: Your Telegram chat ID.
4. Deploy the function to your preferred cloud provider. You might need to make some changes to the source code, please consult with your cloud provider documentation.
5. [Register webhook in SMS Gateway](https://sms.capcom.me/getting-started/webhooks/) with the URL of your deployed function adding `?apiKey=YOUR_API_KEY` query parameter.

## Environment Variables

Ensure you have the following environment variables set up:

- `API_KEY`: Random value, which will be passed to cloud function in `apiKey` query parameter from webhook for security purposes.
- `TELEGRAM_BOT_TOKEN`: The token of your Telegram bot.
- `TELEGRAM_CHAT_ID`: The ID of the Telegram chat where messages will be sent.

## Usage

The function is triggered by incoming webhook events from SMS Gateway. When an SMS message is received, the function validates the API key, processes the message, and forwards it to the specified Telegram chat.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.
