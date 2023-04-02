const axios = require('axios');
const twilio = require('twilio');
const dotenv = require('dotenv').config();
// by configurating dotenv, our app will read our .env file to make any API keys/passwords available in process.env. process.env will include our environtment variables

console.log(process.env);

const BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/';

const getEarthquakeData = async () => {
	try {
		const res = await axios.get(
			'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&format=geojson&starttime=2023-03-25'
			// need to find a way to dynamically change date in query every 24 hours
		);

		const results = res.data.features.map((quake) => ({
			magnitude: quake.properties.mag,
			location: quake.properties.place, // keep in mind some values are null/have miscorrect spelling
			time_of_occurence: quake.properties.time, // need to convert from UNIX to human readable time
			more_info_url: quake.properties.url,
		}));

		console.log(results);
	} catch (e) {
		console.error(e);
	}
};

getEarthquakeData();

/** LOGIC FOR SENDING EARTHQUAKE MESSAGES
 *  need to ensure messages are only sent AFTER time of user registration.
 *
 *  user enters phone/location --> saved in to database
 *  our server would request earthquake data every 5-10 min
 *
 * keep track of last few entries from previous data so that when we get new data we know where to start looping.
 *  --> we'll search for previous data in new response data and start our loop from that index
 *
 *  loop through new earthquake entries
 *  --> if the magnitude reading is 4 or less, we do not need to continue with current iteration of loop. no message to be sent.
 * 	--> otherwise, if 5 or above, for each location, we'll search our database for users which have the same city location AND have a registration time before the time the earthquake was recorded. (ensures we don't message people old quake data for that day)
 *  --> send text message to matching users of earthquake depending on magnitude severity level
 *
 *  Message should include only these properties from API response:
 *  - place
 *  - time (updated to human readable from unix)
 *  - magnitude
 *  - url --> for more info (URL only for magnitude 6 and up to keep texts short)
 *
 *
 * QUERYING EARTHQUAKES BY LATITUDE/LONGITUDE
 * 2013 US Government - Zip Code Coordinates: https://gist.github.com/erichurst/7882666
 */

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
