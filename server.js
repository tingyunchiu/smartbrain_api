
const express =  require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app =  express ()
app.use(cors())
app.use(bodyParser.json());


const database = {
	users: [
		{
			id: '123',
			name: 'Tammy',
			email: 'c199403@gmail.com',
			password: '1234a',
			scores: []
		},
		{
			id: '124',
			name: 'Lala',
			email: 'lalaC@gmail.com',
			password: 'cokacoka',
			scores: []
		}
	]
};

// api/
app.get('/api', (req, res) => {
	res.json(database)
})

// api/login
app.post('/api/login',  (req, res) => {
	const {email, password} = req.body
	let found =  false;
	database['users'].forEach(user => {
		if (user.email===req.body.email && user.password===req.body.password){
			found = true;
			return res.json('Welcome!')
		}
	})
	if(!found) {
		return res.status(400).json('try again');
	}
})

// api/signup
app.post('/api/signup',  (req, res) => {
 	const {name, email, password} = req.body
 	const user = {
		id: (123 + database['users'].length).toString(),
		name: name,
		email: email,
		password: password,
		scores: []
	}
	database['users'].push(user)
	res.json(user);
})

// api/home/:id
app.get('/api/home/:id', (req, res) => {
	const {id} = req.params;
	let found =  false;
	database['users'].forEach(user => {
		if (user.id === id){
			found = true;
			return res.json(user);
		}
	})
	if (!found) {
		return res.status(404).json('wrong id');
	}
})

// api/scores
app.post('/api/scores', (req, res) => {
	const {id, scores} = req.body;
	let found =  false;
	database['users'].forEach(user => {
		if (user.id === id){
			found = true;
			user.scores.push(scores)
			return res.json('added');
		}
	})
	if (!found) {
		return res.status(404).json('wrong id');
	}
})


app.listen(3001, ()=> {
  console.log('app is running on port 3001');
})

