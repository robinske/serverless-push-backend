# Verify Push Backend + Challenge Interface

This project can be used in conjunction with the Push SDKs for [Android](https://github.com/twilio/twilio-verify-android) or [iOS](https://github.com/twilio/twilio-verify-ios) to get started with Verify Push.

### Known Limitations

* The [create-challenge](/functions/create-challenge.js) endpoint sends a challenge to every factor registered with a given identity. In a production implementation you would use a specific factor SID to send a challenge to a specific device.
