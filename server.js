

const { Webhooks, createNodeMiddleware } = require("@octokit/webhooks");
const webhooks = new Webhooks({
  secret: "secret",
});

const EventSource = require('eventsource')

const webhookProxyUrl = "https://smee.io/Vm8Pj1L3eTLpGKi5"; // replace with your own Webhook Proxy URL
const source = new EventSource(webhookProxyUrl);
source.onmessage = (event) => {
  const webhookEvent = JSON.parse(event.data);
  webhooks
    .verifyAndReceive({
      id: webhookEvent["x-request-id"],
      name: webhookEvent["x-github-event"],
      signature: webhookEvent["x-hub-signature"],
      payload: webhookEvent.body,
    })
    .catch(console.error);
};

webhooks.onAny(({ id, name, payload }) => {
    console.log(name, "event received");
  });

webhooks.on('pull_request.opened', ({id,payload}) => {
    console.log('opened a pull request, id: ', id, 'payload: ', payload);
})

  
  require("http").createServer(createNodeMiddleware(webhooks)).listen(3000);



