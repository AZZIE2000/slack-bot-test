const crypto = require("crypto");
const port = process.env.PORT || 3000;
const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;
const fastify = require("fastify")({
  logger: true,
});

fastify.register(require("@fastify/formbody"));
fastify.addContentTypeParser(
  "application/json",
  { parseAs: "buffer" },
  (req, body, done) => {
    if (body && body.length) {
      try {
        const parsed = JSON.parse(body);
        done(null, parsed);
      } catch (error) {
        done(error);
      }
    } else {
      done(new Error("Invalid JSON body"));
    }
  }
);
fastify.get("/", function (request, reply) {
  reply.type("text/html").send("hi");
});

/**
 * @description
 *  this will be called when a user mentions the bot in a channel
 * you will receive the message in the request body with the channel id
 * @steps
 * 1. get the channel id from the request body
 * 2. look for the record in the lookup database that has a channel === req.channel
 * make the conversation_id using the bot_id&channel_id&user_id
 * 3. send the message with the conversation_id and the bot_id to the mock-engines or handle it however you want
 * 4. send a message using this api https://api.slack.com/methods/chat.postMessage and user the token in the heade and in the body use {channel: the saved channel id, [smth]: https://app.slack.com/block-kit-builder  use this to build the message}
 */
fastify.post("/slack-message", function (request, reply) {
  console.log("request.body");
  console.log(request.body);
  console.log("request.body");
  reply.send(request.body);
});

/**
 * @description
 * this will be called when a user uses the command /register in slack after installing the app and inviting the bot to the channel
 * ------
 * @steps
 * 1. the user will get the bot_id jwt token from the bot builder page
 * 2. you will decode the jwt token to get the bot_id
 * 3. receive the channel id from the request body
 * 4. look for the record in the lookup database that has a channel === req.channel
 * 5. if found then update the record with the bot_id
 * 6. send a message using this api https://api.slack.com/methods/chat.postMessage and user the token in the heade and in the body use {channel: the saved channel id, [smth]: https://app.slack.com/block-kit-builder  use this to build the message}
 *
 * @NOTE
 * this api with receive application/x-www-form-urlencoded
 */
fastify.post("/register", (req, res) => {
  const dataFromRequestBody = req.body;
  console.log("request.register 🟢🔴🟢🔴");
  console.log(req.body);
  console.log("request.register 🟢🔴🟢🔴");
  res.send(dataFromRequestBody);
});

/**
 * @description
 * this will be called when a new user install the app
 * and this will be called only once on initial install first thing
 * ------
 * @steps
 * 1. get the code from the request query request.query.code
 * 2. call slack api to get the access token
 * 3. save the access token and the channel id in the lookup database
 * 4. user the url incoming_webhook.url to send the welcome message and the instreuctions
 */
fastify.get("/slack-opt", async function (request, reply) {
  console.log("slack-opt💜💜💜");
  console.log(request.query);
  const formData = new FormData();
  formData.append("code", request.query.code);
  formData.append("client_id", "5876182247284.5876188892036"); // NOTE: from env & slack App Credentials
  formData.append("client_secret", "5cafe95a65c4ca523779eaf62ad1fefa"); // NOTE: from env & slack App Credentials
  console.log("formData 🚀🚀🚀");
  console.log(formData);
  console.log("formData 🚀🚀🚀");
  const response = await fetch("https://slack.com/api/oauth.v2.access", {
    // this api uses application/x-www-form-urlencoded
    method: "POST",
    body: formData,
  });
  console.log("🚀🚀🚀");
  console.log(response);
  console.log("🚀---🚀--🚀");
  console.log(JSON.stringify(response));
  console.log("🚀🚀🚀");
  const data = await response.json();
  console.log("dd🚀🚀🚀dd");
  console.log(data);
  console.log("dd🚀🚀🚀dd");
  const resToSlack = await fetch(data.incoming_webhook.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: data.access_token,
    }),
  });
  console.log("resToSlack");
  console.log(resToSlack);
  console.log("resToSlack");

  reply.send(request.query);
});

// twitter apis XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
fastify.get("/hook/x", async (req, res) => {
  const hmac = crypto
    .createHmac("sha256", consumer_secret)
    .update(crc_token)
    .digest("base64");
  res.send(hmac);
});
// twitter apis XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
fastify.listen({ host: host, port: port }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
// Access Token : 1305764054812839936-2W1tWfaHaOsSnW68aju5gYm4Pp6j6t
// Access Token Secret : GDE7eiaDSHMSEylwwQtehrl3ti7jDvn9E5K0BcLCDwqqb
// Bearer AAAAAAAAAAAAAAAAAAAAANphXAEAAAAA7dhuC%2Fj%2BIK45MM3EKvSiDMwaS5s%3D0WifP0OWNqqvOk16jhisgy6XZW2uBdOJDPk9OCor8rCTGwV6ih
//  NOTE: the bot cant wont be able to send messages to the channel unless the user install the app and invite the bot to the channel
const axios = require("axios");
const qs = require("querystring");

const CONSUMER_KEY =
  "Q7Iiye43HaMrE5PjlxVHmcVLL" ||
  "d3ZY00oQ8LkAa5N8RKdRr8I0DS4ykE3eUzWQ28yRJ7ND7cgPr4";
const ACCESS_TOKEN =
  "1305764054812839936-ZgIvJTfTqyk14Z6f7DUXmCNbsbHxxt" ||
  "9Xgv6JIzLOZrv5Ar7T4P0nFOr2H2iXcRmiiWn1T7AGtFQ";

// Define your webhook URL
const webhookURL = "https://your_domain.com/webhooks/twitter/0";

// Build the OAuth parameters
const oauthParams = {
  oauth_consumer_key: CONSUMER_KEY,
  oauth_nonce: generateNonce(),
  oauth_signature_method: "HMAC-SHA1",
  oauth_timestamp: generateTimestamp(),
  oauth_token: ACCESS_TOKEN,
  oauth_version: "1.0",
};

// Function to generate a random nonce
function generateNonce() {
  return Date.now().toString();
}

// Function to generate a timestamp
function generateTimestamp() {
  // Implement your own logic to generate a timestamp
  // For example, you can use Date.now()
  return Date.now().toString();
}

// Generate the OAuth header with the required parameters
const oauthHeader = generateOAuthHeader(oauthParams);

// Define the Twitter API endpoint for registering a webhook
const apiUrl = "https://api.twitter.com/1.1/account_activity/webhooks.json";

// Send the POST request to register the webhook
// axios
//   .post(apiUrl, qs.stringify({ url: webhookURL }), {
//     headers: {
//       Authorization: oauthHeader,
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   })
//   .then((response) => {
//     console.log("Webhook registered successfully:", response.data);
//   })
//   .catch((error) => {
//     console.error("Error registering webhook:", error);
//   });

// Function to generate the OAuth header
function generateOAuthHeader(params) {
  const orderedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}="${params[key]}"`)
    .join(", ");

  return `OAuth ${orderedParams}`;
}

console.log(oauthHeader);