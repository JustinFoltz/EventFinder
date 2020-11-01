/**
 * @author Hutinet Maxime <maxime@hutinet.ch>
 * @author Foltz Justin <justin.foltz@gmail.com>
 * @description Defines and exports a Profil object
 * Date 12.2019
 */

const Profil = function(username, name) {
    this.username = username;
    this.name = name;
    this.preferences = [];
    this.token = undefined;
}

module.exports = Profil;
