const express = require('express');
// const db = require('./firebase');
const { User } = require('./firebase');

const app = express();
app.use(express.json());

// initialize the User collection in our Firestore cloud database. Documents are added to our collection as we add individual user data.

app.post('/create', async (req, res) => {
	const data = req.body;
	await User.set(data);
	res.send({ msg: 'user successfully added' });
});

// The app.listen() function is used to bind and listen to the connections on the specified host and port. This method is identical to Node’s http.Server.listen() method.
app.listen(5000, () => console.log('Server 5000 is running'));
