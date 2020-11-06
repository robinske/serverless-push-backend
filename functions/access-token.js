/**
 *  Requeset an Access Token
 *
 *
 *  Pre-requisites
 *  - Create a Verify Service (https://www.twilio.com/console/verify/services)
 *
 *  Parameters
 *  - identity - required - unique user id, no PII
 * 
 *
 *  Returns JSON
 * 
 *  on Success:
 *  {
 *    "token": "eyJ6aXAiOiJERUYiLCJraWQiOiJTQVNfUzNfX19...."
 *  }
 * 
 *  on Error:
 *  {
 *    "error" {
 *       "message": "Details about your error",
 *       "moreInfo": "Link to error"
 *    }
 *  }
 */

exports.handler = function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Content-Type', 'application/json');

  // uncomment to support CORS
  // response.appendHeader('Access-Control-Allow-Origin', '*');
  // response.appendHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  // response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (typeof event.identity === 'undefined') {
    response.setBody({
      "error": {
        "message": "Missing parameter; please provide a phone number or email.",
        "moreInfo": "https://www.twilio.com/docs/verify/api/verification"
      }
    })
    response.setStatusCode(400);
    return callback(null, response);
  }

  const client = context.getTwilioClient();
  const service = context.VERIFY_SERVICE_SID;

  client.verify.services(service)
    .accessTokens
    .create({ identity: 'User_UUID', factorType: 'push' })
    .then(resp => {
      response.setStatusCode(200)
      response.setBody({
        "token": resp.token
      })
      callback(null, response);
    }).catch(error => {
      console.log(error);
      response.setStatusCode(error.status);
      response.setBody({
        "success": false,
        "error": {
          "message": error.message,
          "moreInfo": error.moreInfo
        }
      });
      callback(null, response);
    });
};
