const express = require('express');
const bodyParser = require('body-parser');
const Users = require('../models/users');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.route('/')
  .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Users.find({})
      .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
  Users.register(new Users({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        // first have user successfully registered with username and password then capture first and lastname
        if (req.body.firstname)
          user.firstname = req.body.firstname;
        if (req.body.lastname)
          user.lastname = req.body.lastname;
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
          });
        });
      }
    });
});

userRouter.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {

  const token = authenticate.getToken({ _id: req.user._id }); // use the user_id to create the token
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});

// not sending anything in body so use get() method
userRouter.get('/logout', cors.corsWithOptions, (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

// Using OAuth with Passport and Facebook

// The user application, the client in this case, will pass in the Facebook access token that it has just obtained from Facebook. 
// And then our express server will then use the Facebook access token to verify the user on Facebook. 
// And then if the user is acknowledged by Facebook to be a legitimate user, then our express server will return a 
// JSON wed token to our client. And then our client is authenticated and then can proceed forward with carrying out 
// the other operations using the JSON wed token in the header of all the request messages. 
userRouter.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in!' });
  }
});


module.exports = userRouter;
