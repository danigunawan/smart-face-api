const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require ('bcrypt-nodejs');
const cors = require ('cors');
const knex = require ('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');

const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'zerotomastery',
    database : 'smartface'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req,res) =>{
	const { id } = req.params;
	db.select('*').from('users').where({
		id: id
	})
		.then(user => {
			if (user.length){
				res.json(user[0])
			}else {
				res.status(400).json('Not Found')
			}
	})
		.catch(err => res.status(400).json('ERRROOORR'))
})

app.put ('/image', (req, res) => {
	const { id } = req.body;
	db('users')
	  .where('id', '=', id)
	  .increment('entries', 1)
	  .returning('entries' )
	  .then(entries	=> {
	  	res.json(entries[0]);
	  })
	  .catch(err => res.status(400).json('unable get entries'))	
})

app.listen(3001, ()=> {
	console.log('app running on port 3001');
})
