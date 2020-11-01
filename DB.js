/**
 * @author Hutinet Maxime <maxime@hutinet.ch>
 * @author Foltz Justin <justin.foltz@gmail.com>
 * @description Manages and exports database operations
 * Date 12.2019
 */

// -------------------------------------------------------------------------
// DATABASE CONNEXION 
// -------------------------------------------------------------------------

let port = 27017
let mongoose = require('mongoose');
let options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
mongoose.Promise = global.Promise;


const mongodbUrl = "mongodb://"
                    + process.env.MONGODB_USER
                    + ":" + process.env.MONGODB_PASS
                    + "@db:27017/admin"

mongoose.connect(mongodbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, "[DB] - Error with the connexion"));
db.once('open', function (){
    console.log(console.log("[DB] - Connected"));
});


// -------------------------------------------------------------------------
// DATABASE PROFILS 
// -------------------------------------------------------------------------

/**
 * User schema
 * @username
 */
let profilSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
    select: false,
  },
  name: String,
  age: String,
  preferences: [],
  token: {
    type: String,
    select: false,
  }
});
let Profil = mongoose.model('Profil', profilSchema);


// -------------------------------------------------------------------------
// DATABASE OPERATIONS 
// -------------------------------------------------------------------------

/**
 * Check if the username is already in the DB
 * @param username username of user to check
 * @return true if username already exists, false otherwise
 */
containUsername = async (username) => {
  const users = await Profil.find({ "username" : username });
  if(users.length > 0) {
      return true;
  }
  return false;
}
exports.containUsername = function(username){
    return containUsername(username);
}

/**
 * Check if the ID is already in the DB
 * @param id id of user to check
 * @return true if ID already exists, false otherwise
 */
containId = async (id) => {
  const users = await Profil.find({ "_id" : id });
  if(users.length > 0) {
      return true;
  }
  return false;
}
exports.containId = function(id){
    return containId(id);
}

/**
 * Register user
 * @param username username of user to register
 * @param pass password of user to register
 * @param name name of user to register
 * @return true if registration is ok, false otherwise
 */
registration = async (username, pass, name) => {
  const containsUsername = await containUsername(username);

  if(containsUsername){
    console.log("[DB] - ID already registered");
    return false;
  }
  let newProfil = new Profil();
  newProfil.username = username;
  newProfil.pass = pass;
  newProfil.name = name;
  newProfil.save(function(err){
    if(err){
      console.log("[DB] - Error saving the profil")
      return false;
    }
  });
  console.log("[DB] - ID registered");
  return true;
}
exports.registration = function(username, pass, name){
    return registration(username, pass, name);
}

/**
 * Check if the password matches the one provided
 * @param username user's username related to password to check
 * @param pass password to check
 * @return true if pass matches user password, false otherwise
 */
authentication = async (username, pass) => {
  const containsUsername = await containUsername(username);
  if(containsUsername){
    const user = await Profil.findOne({ "username" : username }).select('+pass');
    if(user.toObject().pass === pass){
      return true;
    }
  }
  return false;
}
exports.login = function(username, pass){
    return authentication(username, pass);
}

/**
 * Retrieve profil from the DB
 * @param username username of user to retrieve
 * @return Profil object or undefined if no results is found
 */
getProfilByUsername = async (username) => {
  const containsUsername = await containUsername(username);

  if(containsUsername){
    const user = await Profil.findOne({ "username" : username });
    return user.toObject();
  }
  return undefined;
}
exports.getProfilByUsername = function(username){
    return getProfilByUsername(username);
}

/**
 * Retrieve profil from the DB
 * @param id id of user to retrieve
 * @return Profil object or undefined if no results is found
 */
getProfilById = async (id) => {
  const containsId = await containId(id);

  if(containsId){
    const user = await Profil.findOne({ "_id" : id });
    return user.toObject();
  }
  return undefined;
}
exports.getProfilById = function(id){
    return getProfilById(id);
}

/**
 * Search for a profil based on the id or name
 * @param name name of user to find
 * @return List of Profil objects or undefined if no results is found
 */
searchProfil = async (name) => {
    let regex = new RegExp("^" + name);
    const users = await Profil.find({ $or:[{"username" : regex}, {"name" : regex}]  });

    if(users.length > 0){
      return users;
    }
    return undefined;
}
exports.searchProfil = function(name){
    return searchProfil(name);
}

/**
 * Update the token field
 * @param username user's username related to the token to update
 * @param token updated token
 * @return true if update is ok, false otherwise
 */
saveToken = async (username, token) => {
  const containsUsername = await containUsername(username);

  if(containsUsername){
    const res = await Profil.updateOne({ "username" : username }, { "token": token });
    if(res.ok == 1){
      return true;
    }
  }
  return false;
}
exports.saveToken = function(username, token){
    return saveToken(username, token);
}

/**
 * Delete the current token field
 * @param id user's id related to the token to delete
 * @return true if deletion is ok, false otherwise
 */
deleteToken = async (id) => {

  const containsId= await containId(id);
  
  if(containsId){
    const res = await Profil.updateOne({ "_id" : id }, { "token": undefined });
    if(res.ok == 1){
      return true;
    }
  }
  return false;
}
exports.deleteToken = function(id){
    return deleteToken(id);
}

/**
 * Make sure the token is correct in the token field
 * @param id user's id related to token to check
 * @param token token to check
 * @return true if token matches user's token, false otherwise
 */
checkToken = async (id, token) => {
  const containsId = await containId(id);
  if(containsId){
    const user = await Profil.findOne({ "_id" : id }).select('+token');
    if(user.toObject().token !== null && user.toObject().token === token)
      return true; 
  }
  return false; 
}
exports.checkToken = function(id, token){
    return checkToken(id, token);
}

/**
 * Check if event in already in profil
 * @param username username of the user for whom the event must be checked
 * @param eventID ID of event to check
 * @return true if event is allready contains in user profil, false otherwise
 */
containEvent = async (username, eventID) => {
  const containsUsername = await containUsername(username);
  if(containsUsername){
    const res = await Profil.findOne({ "username" : username }).find({ "preferences.eventfulID" : eventID });
    return res.length > 0;
  }
  return false;
}
exports.containEvent = function(username, eventID){
    return containEvent(username, eventID);
}

/**
 * Push event in a profil
 * @param username username of user for whom event must be added
 * @param event Event object to add
 * @return true if event is added, false otherwise
 */
pushEventInProfil = async (username, event) => {
  const containsEvent = await containEvent(username, event.eventfulID);

  if(containsEvent){
    return false;
  }
  const res = await Profil.updateOne({ "username" : username }, { $push: { "preferences": event } });
  return res.ok == 1
}
exports.pushEventInProfil = function(username, event){
    return pushEventInProfil(username, event);
}

/**
 * Remove event in a profil
 * @param username username of user for whom event must be deleted
 * @param event event to delete
 * @return true if event is deleted, false otherwise
 */
removeEventInProfil = async (username, eventID) => {
  const containsUsername = await containUsername(username);
  if(containsUsername){
    const res = await Profil.update({ "username" : username }, { $pull : { "preferences" : { "eventfulID" : eventID } } });
    return res.ok == 1;
  }
  return false;
}
exports.removeEventInProfil = function(username, eventID){
    return removeEventInProfil(username, eventID);
}

/**
 * Get the different events in a profil
 * @param username username of user for whom get the event list
 * @return list of user's events or undefined if no event is found
 */
getEventInProfil = async (username) => {
  const containsUsername = await containUsername(username);
  if(containsUsername){
    const events = await Profil.find({ "username" : username }, "preferences");
    return events[0].preferences;
  }
  return undefined;
}
exports.getEventInProfil = function(username){
    return getEventInProfil(username);
}

/**
 * Modify username of a user
 * @param id id of user for whom the username is updated
 * @param newUsername updated username
 * @return true if username is updated, false otherwise
 */
modifyUsername = async (id, newUsername) => {
  const containsId = await containId(id);
  if(containsId){
    const res = await Profil.updateOne({ "_id" : id }, { "username": newUsername });
    if(res.ok == 1){
      return true;
    }
  }
  return false;
}
exports.modifyUsername = function(id, newUsername){
    return modifyUsername(id, newUsername);
}

/**
 * Modify name of a user
 * @param id id of user for whom the name is updated
 * @param newUsername updated name
 * @return true if name is updated, false otherwise
 */
modifyName = async (id, newName) => {
  const containsId = await containId(id);
  if(containsId){
    const res = await Profil.updateOne({ "_id" : id }, { "name": newName });
    if(res.ok == 1){
      return true;
    }
  }
  return false;
}
exports.modifyName = function(id, newName){
    return modifyName(id, newName);
}

/**
 * Modify pass of a user
 * @param id id of user for whom password is updated
 * @param newPass updated password
 * @return true if password is updated, false otherwise
 */
modifyPass = async (id, newPass) => {
  const containsId = await containId(id);
  if(containsId){
    const res = await Profil.updateOne({ "_id" : id }, { "pass": newPass });
    if(res.ok == 1){
      return true;
    }
  }
  return false;
}
exports.modifyPass = function(id, newPass){
  return modifyPass(id, newPass);
}