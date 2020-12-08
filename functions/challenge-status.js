/**
 *  Requeset an Access Token
 *
 *
 *  Pre-requisites
 *  - Create a Verify Service (https://www.twilio.com/console/verify/services)
 *
 *  Parameters
 *  - entity - required
 *  - factor_sid - required
 *
 *
 *  Returns JSON
 *
 *  on Success:
 *  challenge JSON - https://www.twilio.com/docs/verify/api/challenge#challenge-properties
 *
 *  on Error:
 *  {
 *    "error" {
 *       "message": "Details about your error",
 *       "moreInfo": "Link to error"
 *    }
 *  }
 */

function requiredParameter(param, paramName, response, callback) {
  if (typeof param === "undefined") {
    response.setBody({
      error: {
        message: `Missing parameter; please provide an ${paramName}.`,
        moreInfo:
          "https://www.twilio.com/docs/verify/api/challenge#create-a-challenge-resource",
      },
    });
    response.setStatusCode(400);
    return callback(null, response);
  } else {
    return null;
  }
}

exports.handler = function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader("Content-Type", "application/json");

  // uncomment to support CORS
  // response.appendHeader('Access-Control-Allow-Origin', '*');
  // response.appendHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  // response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  requiredParameter(event.identity, "identity", response, callback);
  requiredParameter(event.sid, "sid", response, callback);

  const client = context.getTwilioClient();
  const service = context.VERIFY_SERVICE_SID;

  // const factorSid = "YF033b298696c8954f8ed0e0b8b3d3507b";
  const fields = {
    Location: "Brooklyn, NY",
    "IP Address": "70.23.49.231",
  };

  client.verify
    .services(service)
    .entities(event.identity)
    .challenges(event.sid)
    .fetch()
    .then((challenge) => {
      response.setStatusCode(200);
      response.setBody(challenge);
      callback(null, response);
    })
    .catch((error) => {
      console.log(error);
      response.setStatusCode(error.status);
      response.setBody({
        success: false,
        error: {
          message: error.message,
          moreInfo: error.moreInfo,
        },
      });
      callback(null, response);
    });
};