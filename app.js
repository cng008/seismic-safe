const axios = require('axios');
const dotenv = require('dotenv').config();
// by configurating dotenv, our app will read our .env file to make any API keys/passwords available in process.env. process.env will include our environtment variables

console.log(process.env);

const BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1';

let lastEntryTime = null;

async function getEarthquakeData(lastEntryTime) {
	const startDate = new Date();
	const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

	const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate.toISOString()}&endtime=${endDate.toISOString()}${
		lastEntryTime ? `&minmagnitude=0&minupdate=${lastEntryTime}` : ''
	}`;

	try {
		const response = await axios.get(url);
		const earthquakes = response.data.features.map((feature) => ({
			magnitude: feature.properties.mag,
			place: feature.properties.place,
			time: feature.properties.time,
			url: feature.properties.url,
		}));

		const greaterThanOrEqual4 = earthquakes.filter(
			(earthquake) => earthquake.magnitude >= 4
		);
		const lessThan4 = earthquakes.filter(
			(earthquake) => earthquake.magnitude < 4
		);

		const citiesAndStatesGreaterThanOrEqual4 = greaterThanOrEqual4.map(
			(earthquake) => {
				const place = earthquake.place;
				const regex = /,\s+/; // Match comma followed by one or more spaces
				const cityStateArray = place.split(regex); // Split the place string using the regex pattern
				const state = cityStateArray.pop(); // Remove the state from the end of the array
				const city = cityStateArray.join(', '); // Join the remaining elements as the city
				return { city, state };
			}
		);

		const citiesAndStatesLessThan4 = lessThan4.map((earthquake) => {
			const place = earthquake.place;
			const regex = /,\s+/; // Match comma followed by one or more spaces
			const cityStateArray = place.split(regex); // Split the place string using the regex pattern
			const state = cityStateArray.pop(); // Remove the state from the end of the array
			const city = cityStateArray.join(', '); // Join the remaining elements as the city
			return { city, state };
		});

		if (earthquakes.length > 0) {
			lastEntryTime = earthquakes[earthquakes.length - 1].time;
		}

		console.log('Greater than or equal to 4:');
		console.log(citiesAndStatesGreaterThanOrEqual4);

		console.log('Less than 4:');
		console.log(citiesAndStatesLessThan4);
	} catch (error) {
		console.error(error);
	}

	setTimeout(() => {
		getEarthquakeData(lastEntryTime);
	}, 5 * 60 * 1000);
}

getEarthquakeData(lastEntryTime);

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
