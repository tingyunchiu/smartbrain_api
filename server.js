const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const knex = require('knex')
const bcrypt = require('bcryptjs')
const db = knex({
    client: 'pg',
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(cors())
app.use(bodyParser.json());

// api/login
app.post('/api/login', (req, res) => {
    db.select('*').from('login').where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            if (isValid) {
                res.json({
                            uid: data[0].uid,
                            name: data[0].name,
                            email: data[0].email
                        });
            } else {
                res.status(400).json('try again')
            }
        })
        .catch(err => res.status(400).json('try again'))
})

// api/signup
app.post('/api/signup', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  const date = new Date()

    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email,
        name: name,
        joined: date
      })
      .into('login')
      .returning('uid')
      .then(uid => {
        return trx('scores')
          .returning('*')
          .insert({
            uid: uid[0],
            date: date
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to sign up'))
})

// api/home/:uid
app.get('/api/home/:uid', (req, res) => {
    const { uid } = req.params;
    db.select('scores').from('scores').where('uid', '=', uid)
        .then(data => {
            res.json(data.map(item =>item.scores))
        })
    .catch(err => res.status(400).json('unable to get recorders'))
})

// api/scores
app.post('/api/scores', (req, res) => {
    const { uid, scores } = req.body;
    db('scores')
        .returning('*')
        .insert({
            uid: uid,
            scores: scores,
            date: new Date()
        })
        .then(user => {
            res.json(user[0])
        })
        .catch(err => res.status(404).json('unable to add scores'))
})


app.listen(3001, () => {
    console.log('app is running on port 3001');
})