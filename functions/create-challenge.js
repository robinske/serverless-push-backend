/**
 *  Create an authentication challenge
 *
 *  Sends a push notification to registered factor.
 *
 *
 *  Pre-requisites
 *  - Create a Verify Service (https://www.twilio.com/console/verify/services)
 *  - Create a Factor on a device
 *
 *  Parameters
 *  - identity - required
 *  - message - required
 *  - details like IP, Location, etc. - optional
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
  requiredParameter(event.message, "message", response, callback);

  const client = context.getTwilioClient();
  const service = context.VERIFY_SERVICE_SID;

  const fields = [
    { label: "Public IP", value: event.ip },
    { label: "Location", value: event.location },
  ];

  client.verify
    .services(service)
    .entities(event.identity)
    .factors.list({ limit: 20 })
    .then((factors) => {
      if (factors.length === 0) {
        response.setBody({
          error: {
            message:
              "No factors found for identity. Register a factor before continuing.",
            moreInfo: "https://www.twilio.com/docs/verify/api/factor",
          },
        });
        callback(null, response);
      }
      factors.forEach(({ sid }) =>
        client.verify
          .services(service)
          .entities(event.identity)
          .challenges.create({
            factorSid: sid,
            "details.message": event.message,
            "details.fields": fields,
          })
          .then((challenge) => {
            response.setStatusCode(200);
            response.setBody(challenge);
            callback(null, response);
          })
          .catch((error) => {
            console.log(error);
            response.setStatusCode(error.status);
            response.setBody({
              error: {
                message: error.message,
                moreInfo: error.moreInfo,
              },
            });
            callback(null, response);
          })
      );
    });
};
