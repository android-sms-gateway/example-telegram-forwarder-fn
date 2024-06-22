/**
 * Escapes special characters in a string to their HTML entities.
 *
 * @param {string} text - The string to escape.
 * @return {string} The escaped string.
 */
function escapeHTML(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Lambda function handler for incoming webhook events from SMS Gateway.
 * Validates the API key, processes the message, and forwards it to the specified Telegram chat.
 *
 * @param {Object} event - The event object passed to the handler.
 * @param {Object} context - The context object passed to the handler.
 * @returns {Promise} - A promise that resolves to the response object.
 */
module.exports.handler = async (event, context) => {
    // Check if the API key is valid
    const apiKey = event.queryStringParameters.apiKey;
    if (apiKey !== process.env.API_KEY) {
        return {
            statusCode: 401,
            body: 'Unauthorized' // Return 401 Unauthorized if the API key is invalid
        };
    }

    // Parse the request body
    const body = JSON.parse(event.body);
    const payload = body.payload;
    const phoneNumber = payload.phoneNumber;
    const message = escapeHTML(payload.message);

    // Prepare the message to be sent to Telegram
    const text = `New message from <b>${phoneNumber}</b>:\n<code>${message}</code>`;

    // Send the message to Telegram
    await fetch('https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text,
            parse_mode: 'HTML'
        })
    });

    return {
        statusCode: 200,
        body: 'OK' // Return 200 OK if the message was sent successfully
    };
};
