/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const { json } = require('body-parser')
const bodyParser = require('body-parser')
const express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "hsdynamo";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "userId";
const partitionKeyType = "S";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

const userPath = '/user'
const hubPath = '/hub'
const sensorPath = '/sensor'
const batteryPath = '/battery'

/********************************
 * HTTP Get method for list objects *
 ********************************/


// GET /user/:userId, retrieve user information (userId, name, phone, email)
// Cognito AUTH
app.get(userPath+hashKeyPath, function(req, res) {
  const condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }
  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [ convertUrlType(req.params[partitionKeyName], partitionKeyType) ];
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  // Check if user making the request is the one getting accessed
  console.log(req.apiGateway.event);
  if (req.apiGateway.event.requestContext.authorizer.claims["cognito:username"] !== req.params.userId) {
    return res.json({error: 'Wrong User'});
  }

  let searchParams = {
    TableName: tableName,
    Key: {
      userId: req.params.userId
    }
  }

  dynamodb.get(searchParams, (err, data) => {
    if (err) {
      res.status(500);
      res.json({error: 'Could not load items: ' + err});
    } else {
      const body = {
        userId: data.Item.userId,
        name: data.Item.name,
        email: data.Item.email,
        phone: data.Item.phone
      }
      res.status(200);
      res.json(body);
    }
  });
});

// GET /user/sensor/:userId, retrieve sensor information (sensorName, sensorId, sensorStatus, sensorType)
// Cognito AUTH
app.get(userPath+sensorPath+hashKeyPath, function(req, res) {
  const condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }
  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [ convertUrlType(req.params[partitionKeyName], partitionKeyType) ];
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  // Check if user making the request is the one getting accessed
  if (req.apiGateway.event.requestContext.authorizer.claims["cognito:username"] !== req.params.userId) {
    return res.json({error: 'Wrong User'});
  }

  let searchParams = {
    TableName: tableName,
    Key: {
      userId: req.params.userId
    }
  }

  dynamodb.get(searchParams, (err, data) => {
    if (err) {
      res.status(500);
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.status(200);
      res.json(data.Item.sensors);
    }
  });
});

/************************************
* HTTP post method for insert object *
*************************************/

// POST /user/:userId, add a new user
/*app.post(userPath+hashKeyPath, function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  if (req.apiGateway.event.requestContext.authorizer.claims["cognito:username"] !== req.params.userId) {
    return res.json({error: 'Wrong User'});
  }

  let postItemParams = {
    TableName: tableName,
    Item: {
      userId: req.params.userId,
      name: req.query.name,
      phone: req.query.phone,
      email: req.query.email,
      sensors: {}
    }
  }
  dynamodb.put(postItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else {
      res.json({success: 'post call succeed!', url: req.url, data: data})
    }
  });
});*/

// POST /sensor/:userId, add a new sensor and update sensor
app.post(userPath+sensorPath+hashKeyPath, function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  if (req.apiGateway.event.requestContext.authorizer.claims["cognito:username"] !== req.params.userId) {
    return res.json({error: 'Wrong User'});
  }

  const sensor = {
    sensorName: req.query.sensorName,
    sensorStatus: req.query.sensorStatus,
    sensorType: req.query.sensorType,
    battery: true
  }

  let postItemParams = {
    TableName: tableName,
    Key: {
      "userId": req.params.userId
    },
    UpdateExpression: "SET sensors.#m = :sensor",
    ExpressionAttributeValues: {
      ":sensor": sensor
    },
    ExpressionAttributeNames: {
      "#m": req.query.sensorId
    }
  }
  dynamodb.update(postItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else {
      res.json({success: 'post call succeed!', url: req.url})
    }
  });
});

/************************************
* HTTP put method for update object *
*************************************/

// PUT /user/:userId, add a new user
/*app.put(userPath+hashKeyPath, function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  if (req.apiGateway.event.requestContext.authorizer.claims["cognito:username"] !== req.params.userId) {
    return res.json({error: 'Wrong User'});
  }

  let postItemParams = {
    TableName: tableName,
    Key: {
      "userId": req.headers.userid
    },
    UpdateExpression: "SET #n = :userName, #e = :userEmail, #p = :userPhone",
    ExpressionAttributeValues: {
      ":userName": req.query.name,
      ":userEmail": req.query.email,
      ":userPhone": req.query.phone
    },
    ExpressionAttributeNames: {
      "#n": "name",
      "#e": "email",
      "#p": "phone"
    }
  }
  dynamodb.update(postItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else {
      res.json({success: 'post call succeed!', url: req.url, data: data})
    }
  });
});*/

// PUT /sensor/:userID, update sensor
app.put(userPath+sensorPath+hashKeyPath, function(req, res) {

  if (req.apiGateway.event.requestContext.authorizer.claims["cognito:username"] !== req.params.userId) {
    return res.json({error: 'Wrong User'});
  }

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }
  let postItemParams = {
    TableName: tableName,
    Key: {
      "userId": req.params.userId
    },
    UpdateExpression: "SET sensors.#m.sensorStatus = :sensorStatus",
    ExpressionAttributeValues: {
      ":sensorStatus": req.query.sensorStatus
    },
    ExpressionAttributeNames: {
      "#m": req.query.sensorId
    }
  };
  if (req.query.sensorStatus === "triggered") {
    postItemParams.ConditionExpression = "sensors.#m.sensorStatus <> :disarmed";
    postItemParams.ExpressionAttributeValues[":disarmed"] = "disarmed";
  }
  dynamodb.update(postItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else {
      res.json({success: 'post call succeed!', url: req.url})
    }
  });
});

// PUT /sensor/:userID, update sensor
app.put(hubPath+sensorPath+hashKeyPath, function(req, res) {
  
  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let postItemParams = {
    TableName: tableName,
    Key: {
      "userId": req.params.userId
    },
    UpdateExpression: "SET sensors.#m.sensorStatus = :sensorStatus, sensors.#m.triggerDate = :triggerDate",
    ExpressionAttributeValues: {
      ":sensorStatus": "triggered",
      ":triggerDate": Date.now() + 5000,
      ":threshold": Date.now(),
      ":armed" : "armed"
    },
    ExpressionAttributeNames: {
      "#m": req.headers.sensorid
    },
    ConditionExpression : "sensors.#m.sensorStatus = :armed AND sensors.#m.triggerDate < :threshold"
  };
  dynamodb.update(postItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else {
      let searchParams = {
        TableName: tableName,
        Key: {
          userId: req.params.userId
        }
      }
    
      dynamodb.get(searchParams, (err, data) => {
        if (err) {
          res.status(500);
          res.json({error: 'Could not load items: ' + err});
        } else {
          sendEmail(data.Item.email, data.Item.name, data.Item.sensors[req.headers.sensorid])
          res.json({success: 'post call succeed!', url: req.url})
        }
      });
    }
  });
});

app.put(batteryPath+hashKeyPath, function(req, res) {
  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let postItemParams = {
    TableName: tableName,
    Key: {
      "userId": req.params.userId
    },
    UpdateExpression: "SET sensors.#m.battery = :batteryStatus",
    ExpressionAttributeValues: {
      ":batteryStatus": req.headers.battery
    },
    ExpressionAttributeNames: {
      "#m": req.headers.sensorid
    }
  };

  dynamodb.update(postItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else {
      res.json({success: 'post call succeed!', url: req.url})
    }
  });
});

const sendEmail = (email, name, sensor) => {
  const link = "https://main.d3d1r936zownlp.amplifyapp.com/";
  var emailParams = {
    Destination: {
      ToAddresses: [
        email
      ]
    },
    Message: {
      Body: {
        Html: {
         Charset: "UTF-8",
         Data: `<h1>Hello ${name}</h1> <h3>The ${sensor.sensorType} sensor ${sensor.sensorName} was triggered.<h3/> <h3>Check the status of your home security system <a href="${link}">here</a>.<h3/>`
        },
        Text: {
         Charset: "UTF-8",
         Data: `Hello ${name}. The ${sensor.sensorType} sensor ${sensor.sensorName} was triggered.`
        }
       },
       Subject: {
        Charset: 'UTF-8',
        Data: 'ALERT: SENSOR TRIGGERED'
       }
      },
    Source: 'fa23.hs2.alerts@gmail.com',
    ReplyToAddresses: [
       'fa23.hs2.alerts@gmail.com'
    ],
  };

  // Create the promise and SES service object
  var sendPromise = new AWS.SES().sendEmail(emailParams).promise();
  
  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    function(data) {
      console.log(data.MessageId);
    }).catch(
      function(err) {
        console.error(err, err.stack);
    });
}

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
