/**
 * @author Hutinet Maxime <maxime@hutinet.ch>
 * @author Foltz Justin <justin.foltz@gmail.com>
 * @description Manages app server and routes
 * Date 12.2019
 */

"use strict"

const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const eventfulClient = require('./EventfulClient.js');
const db = require("./DB.js");
require('dotenv').config();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// -------------------------------------------------------------------------
// APP MIDDLEWARES 
// -------------------------------------------------------------------------

/** 
 * Auth middleware
 */
let auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, process.env.JWT_SECRET);
        let checkToken = await db.checkToken(data.userId, token);
        if(!checkToken) {
            throw new Error();
        }
        req.userId = data.userId;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send( { error: 'Not authorized to access this resource' } );
    }
}


// -------------------------------------------------------------------------
// APP ROUTES 
// -------------------------------------------------------------------------

/** 
 * Redirect the user to the /map route
 * URL: /
 * METHOD: GET
 * AUTHORIZATION: none
 */ 
app.get('/', (req, res) => {
    res.redirect('/map');
});


/** 
 * Send the register.html file for user registration
 * URL: /register
 * METHOD: GET
 * AUTHORIZATION: none
 */
app.get('/register', (req, res) => {
    res.sendFile("./views/register.html", { root: __dirname });
});


/** 
 * Register the user in the database
 * URL: /register
 * METHOD: POST
 * AUTHORIZATION: none
 * BODY DATA: 
 *  - username: username of user (unique)
 *  - name: name of user
 *  - pass: password of user
 */
app.post('/register', async (req, res) => {
    let isValid = await db.registration(req.body.username, req.body.pass, req.body.name);
    if(!isValid) {
        res.status(409).json( {error: "username already used"} );
    } else {
        res.sendStatus(200).send();
    }
});


/**
 * Send the login.html file for user login
 * URL: /login
 * METHOD: GET
 * AUTHORIZATION: none
 */
app.get('/login', (req, res) => {
    res.sendFile("./views/login.html", { root: __dirname });
});


/** 
 * Login the user, create and save jwt token in the database
 * URL: /login
 * METHOD: POST
 * AUTHORIZATION: none
 * BODY DATA: 
 *  - username: username of user
 *  - pass: password of user
 */
app.post("/login", async (req,res) => {
    let isValid = await db.login(req.body.username, req.body.pass);

    if(!isValid) {
        res.status(401).json( {error: "authentication error"} );
    } else {
        let user = await db.getProfilByUsername(req.body.username);
        let token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '24h'});
        let isSaved = await db.saveToken(user.username, token);
        if(isSaved){
          res.status(200).send( {user: user, token:token} );
        }
    }
});


/** 
 * Logout the user, delete the token from the database
 * URL: /logout
 * METHOD: GET
 * AUTHORIZATION: JWT
 */
app.get('/logout', auth, async (req, res) => {
    let response = await db.deleteToken(req.userId);
    if(response){
      res.status(200).send();
    }

 });


/** 
 * Send the map.html file
 * URL: /map
 * METHOD: GET
 * AUTHORIZATION: none
 * NOTE: non-authenticated users are redirected to the login page 
 */
app.get('/map', (req, res) => {
    res.sendFile("./views/map.html", { root: __dirname });
});


/** 
 * Return the username and name of the current user
 * URL: /profil
 * METHOD: GET
 * AUTHORIZATION: JWT
 */
app.get('/profil', auth, async (req, res) => {
    let user = await db.getProfilById(req.userId);
    res.status(200).json( {username: user.username, name: user.name, token: req.token} );
});


/** 
 * Return a list of the users favorite events
 * URL: /profil/favorite
 * METHOD: GET
 * AUTHORIZATION: JWT
 */
app.get('/profil/favorite', auth, async (req, res) => {
    let username = (await db.getProfilById(req.userId)).username;
    let events = await db.getEventInProfil(username);
    res.status(200).json( {events: events, token: req.token} );
});


/** 
 * Add an event to the users profil
 * URL: /profil/event
 * METHOD: POST
 * AUTHORIZATION: JWT
 * BODY DATA: 
 *  - eventID : id of event to add
 */
app.post('/profil/event', auth, async (req, res) => {
    new eventfulClient().searchEvent(req.body.eventID).then( async(results) => {
        let username = (await db.getProfilById(req.userId)).username;
        let response = await db.pushEventInProfil(username, results);
        if(response){
            res.status(200).send( {token: req.token} );
        }
        else {
            res.status(409).send();
        }
    });
});


/** 
 * Return a list of events depending of latitude, longitude and radius
 * URL: /event/:latitude/:longitude/:radius
 * METHOD: GET
 * AUTHORIZATION: JWT
 * REQUEST DATA: 
 *  - latitude: latitude of event location
 *  - longitude : longitude of event location
 *  - radius : radius of search area
 */
app.get('/event/:latitude/:longitude/:radius', auth, (req, res) => {
    new eventfulClient().search( req.params.latitude,
                                 req.params.longitude,
                                 req.params.radius)
                        .then( results=> {
                            res.status(200).send( {events: results, token: req.token} );
                        });                        
});


/** 
 * Return a list of profil matching a keyword
 * URL: /profil/names/:name
 * METHOD: GET
 * AUTHORIZATION: JWT
 * REQUEST DATA: 
 *  - name: name of the searched user
 */
app.get('/profil/names/:name', auth, async (req, res) => {
    let users = await db.searchProfil(req.params.name);
    if(users){
      res.status(200).json( {users: users, token:req.token} );
    }
});


/** 
 * Return one single profil depending on id (used to show a profil user)
 * URL: /profil/names/:name
 * METHOD: GET
 * AUTHORIZATION: JWT
 * REQUEST DATA: 
 *  - name: name of the searched user
 */
app.get('/profil/:name', auth, async (req, res) => {
    let user = await db.searchProfil(req.params.name);
    if(user){
      res.status(200).json( {user: user[0], token:req.token} );
    }
    else{
      res.status(401).send( {token:token} );
    }
});


/**
 * Delete a specific event from the users profil
 * URL: /profil/event/:eventID
 * METHOD: DELETE
 * AUTHORIZATION: JWT
 * REQUEST DATA: 
 *  - eventID: id of event to delete
 */
app.delete('/profil/event/:eventID', auth, async (req, res) => {
    let username = (await db.getProfilById(req.userId)).username;
    let response = await db.removeEventInProfil(username, req.params.eventID)
    if(response){
      res.status(200).send( {token: req.token} );
    }
  });


/**
 * Check if a username is already used before edition
 * URL: /profil/edit/check
 * METHOD: POST
 * AUTHORIZATION: JWT
 * BODY DATA: 
 *  - username: username to check
 */
app.post('/profil/edit/check', auth, async (req, res) => {
    let username = (await db.getProfilById(req.userId)).username;
    let isValid = true;
    if(req.body.username !== username) 
        isValid = !(await db.containUsername(req.body.username));
    res.status(200).send( {valid:isValid, token: req.token} );
});


/**
 * Verify login before active password modification
 * URL: /profil/edit/activate
 * METHOD: POST
 * AUTHORIZATION: JWT
 * BODY DATA: 
 *  - pass: password of current user
 */
app.post('/profil/edit/activate', auth, async (req, res) => {
    let username = (await db.getProfilById(req.userId)).username;
    let isValid = await db.login(username, req.body.pass);
    res.status(200).send( {valid:isValid, token: req.token} );
});


/**
 * Verify login before active password modification
 * URL: /profil/edit
 * METHOD: POST
 * AUTHORIZATION: JWT
 * BODY DATA: 
 *  - username: updated username of current user
 *  - name: updated name of current user
 *  - pass: updated password of current user
 */
app.post('/profil/edit', auth, async (req, res) => {
    let user = (await db.getProfilById(req.userId));
    let username = user.username;
    let name = user.name;
    if(req.body.username !== "" && req.body.username !== username) {
        await db.modifyUsername(req.userId, req.body.username);
    }
    if(req.body.name !== "" && req.body.name !== name) {
        await db.modifyName(req.userId, req.body.name);
    }
    if(req.body.pass !== "undefined") {
        await db.modifyPass(req.userId, req.body.pass);
    }
    res.status(200).send( {token:req.token} );

});

app.use(auth);
app.listen(8080);
