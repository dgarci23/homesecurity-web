const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

/**
 * @type {import('http').Server}
 */
const server = awsServerlessExpress.createServer(app);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  /*if (event.pathParameters.userId === event.requestContext.authorizer.claims["cognito:username"]) {
    return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
  }

  if (event.resource.split('/')[1]!=="user") {
    return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
  }*/
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
