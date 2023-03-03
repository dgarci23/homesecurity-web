const AWS =  require('aws-sdk');


exports.handler = (event, context, callback) => {
  
  console.log("LOG");
  console.log(event);
  AWS.config.update({ region: process.env.TABLE_REGION });
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  let tableName = "hsdynamo";
  if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
  }

  let postItemParams = {
    TableName: tableName,
    Item: {
      userId: event.userName,
      name: event.request.userAttributes.name,
      phone: event.request.userAttributes.phone_number,
      email: event.request.userAttributes.email,
      sensors: {}
    }
  }
  dynamodb.put(postItemParams, (err, data) => {
    if (err) {
      console.log(`Unsuccessfull Put: ${err}`)
      callback(null, event);
    } else {
      console.log("Successfull Put");
      callback(null, event);
    }
  });
};