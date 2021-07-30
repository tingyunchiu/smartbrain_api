
const express =  require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app =  express ()
const knex = require('knex')
const bcrypt = require('bcryptjs')
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smartbrain'
  }
});

app.use(cors())
app.use(bodyParser.json());

// api/login
app.post('/api/login',  (req, res) => {
	db.select('email','hash').from('login').where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
		if (isValid) {
			return db.select('*').from('scores').where('email', '=', req.body.email)
						.then(user => {
							res.json(user[0]);
						})
						.catch(err => res.status(400).json('unable to get scores'))
		}else{
			res.status(400).json('try again')
		}
	})
	.catch (err => res.status(400).json('try again code'))
})

// api/signup
app.post('/api/signup',  (req, res) => {
 	const {name, email, password} = req.body
 	const hash = bcrypt.hashSync(password, 10)

 	db.transaction(trx =>{
		trx.insert({email: email, hash: hash })
 	.into('login')
 	.returning('email')
 	.then(loginEmail =>{
 		return trx('scores')
 						.returning('*')
 						.insert({
 							email: loginEmail[0],
 							name: name,
 							joined: new Date()
 						})
 						.then(user => {
							res.json(user[0])
 						})

 	})
 	.then(trx.commit)
 	.catch(trx.rollback)
  })
 	.catch(err => res.status(404).json('unable to join'))
})

// api/home/:id
app.get('/api/home/:id', (req, res) => {
	const {id} = req.params;
	
})

// api/scores
app.post('/api/scores', (req, res) => {
	const {name, email, scores} = req.body;
		db('scores')
		.returning('*')
		.insert({
			name: name,
			email: '',
			scores: scores,
			joined: new Date()
		})
		.then(user => {
			res.json(user[0])
		})
})


app.listen(3001, ()=> {
  console.log('app is running on port 3001');
})

