const twilio = require('twilio');
const dotenv = require('dotenv').config();

/** TWILIO INTEGRATION
 *
 * 2 Features:
 *  - phone number verification during sign up
 *  - SMS alert messages
 */

const accountSid = ''; // Your Account SID from www.twilio.com/console
const authToken = ''; // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken);

/** VERIFY USER'S PHONE NUMBER DURING SIGNUP */
// client.messages.create({
// 	body: 'Hello from twilio-node',
// 	to: '+14083732704', // Text this number
// 	from: '', // From a valid Twilio number
// });
// 	.then((message) => console.log(message.sid));

/** CREATE AND TEXT VERIFICATION CODE TO USER
 * https://www.twilio.com/docs/verify/api/verification
 */
client.verify.v2.verifications // .services('')
	.create({ to: '', channel: 'sms' })
	.then((verification) => console.log(verification.sid));

/** CHECK VERIFICATION CODE USER HAS INPUTTED 
 * https://www.twilio.com/docs/verify/api/verification-check
 * 
 * The status of the verification. Can be: pending, approved, or canceled.
 * 
 * Twilio deletes the verification SID once it’s:

	- expired (10 minutes)
	- approved
	- when the max attempts to check a code have been reached

   	If any of these occur, verification checks will return a 404 not found error:
	"Unable to create record: The requested resource /Services/VAXXXXXXXXXXXXX/VerificationCheck was not found"
*/
client.verify.v2.verificationChecks // .services('')
	.create({ to: '', code: '12432' })
	.then((verification_check) => console.log(verification_check.status));
