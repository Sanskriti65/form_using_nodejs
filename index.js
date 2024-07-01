// Import MongoClient from the mongodb package
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'form';
const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();

const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Async function 
async function FormData(req, res,hash) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Data send to database');

    const db = client.db(dbName);
    const collection = db.collection('users');
    const data=req.body;
    data.hash=hash;

    // Insert a new document into the users collection
     await collection.insertOne({ data});
    
    res.send('Login sucessfull');
  } catch (error) {

  } finally {
    await client.close();
  }
}
app.get('/signup', function (req, res) {
  res.sendFile(__dirname + '/templates/signup.html');
});

app.post('/signup', urlencodedParser, function (req, res) {
  const { password1, confirm_password } = req.body;
    if (password1 === confirm_password) {

      bcrypt.hash( password1,saltRounds, function(err, hash) {
        console.log(hash)
        FormData(req, res,hash);
        res.send('Signup successful!');
      
    });  
    } else {
        res.send('Passwords do not match.');
    }
        console.log(req.body)
  
  });

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/templates/home.html');
});

app.post('/saveData', urlencodedParser, function (req, res) {
  
  console.log(req.body);
  FormData(req, res);
});

app.listen(3000);