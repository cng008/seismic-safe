# **SeismicSafe**

## **Overview**
This is a Node.js application that fetches earthquake data from the USGS API every 5 minutes and sends SMS alerts to users using the Twilio API. User's will be prompted to register for messages using their phone number, city, and state which will be saved to our database in Firebase. 


## **Technologies Used**
- Node.js
- Twilio
- Firebase
- USGS API

## **Installation**
Clone the repository: git clone https://github.com/username/earthquake-alert.git
Install dependencies: npm install
Create a .env file in the root directory with the following variables:
- TWILIO_ACCOUNT_SID: Your Twilio account SID.
- TWILIO_AUTH_TOKEN: Your Twilio auth token.
- TWILIO_PHONE_NUMBER: Your Twilio phone number.

Start the application: **npm start**

## **Usage**
When the application is running, it will fetch earthquake data every 5 minutes and send SMS alerts to users who have a matching location in the Firebase database.

To add a user, use the Firebase console to add a new document to the users collection with the following fields:

- phoneNumber: The user's phone number, including country code (e.g. +15551234567).
- location: The user's location, in the format "City, State" (e.g. "San Francisco, CA").

When an earthquake with a magnitude of 4 or greater occurs within the user's location, the user will receive an SMS alert with details on the magnitude, place, time, and URL of the earthquake.