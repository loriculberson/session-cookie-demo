const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const oneDay = 1000 * 60 * 60 * 24;
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: oneDay,
  },
  resave: false,
  saveUninitialized: true
};

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//username and password for demo purposes
const myusername = 'User1'
const mypassword = 'Password1'

app.get('/', (req,res) => {
  console.log('GET', req.session)
  console.log('*******************')
  console.log('GET SESSION ID',  req.session.id)

  if(req.session.userid){
      res.send("Welcome User <a href=\'/logout'>click to logout</a>");
  } else {
  res.sendFile(path.join(__dirname, '/public/index.html'))
  }
});

app.post('/user',(req,res) => {
  console.log('/user SESSION', req.session)
  console.log('*******************')
  console.log('/user SESSION ID',  req.session.id)
  if(req.body.username == myusername && req.body.password == mypassword){
      req.session.userid = req.body.username;
      console.log('/user SESSION inside', req.session)
      res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
  } else {
      res.send('Invalid username or password');
  }
})

app.get('/logout',(req,res) => {
  req.session.destroy();
  console.log('/logout SESSION', req.session)

  res.redirect('/');
});

app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));

