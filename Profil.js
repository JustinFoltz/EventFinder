const Profil = function(username, name) {
    this.username = username;
    this.name = name;
    this.preferences = [];
    this.token = undefined;
}

module.exports = Profil;
