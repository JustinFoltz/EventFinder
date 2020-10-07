# EventFinder

- Maxime Hutinet

- Justin Foltz

## Le projet

Le projet consiste en un  site web permettant aux utilisateurs de pouvoir trouver des évènements autour d'eux et de pouvoir les ajouter dans une liste de favoris. Les données sont récupérées aupres de l'API EventFul et placées sur une carte fournie par l'API Leaflet.

## Les fonctionnalités

* Visualisation de concert/festival, symbolisés par des marqueurs sur une carte;

* Visualisation des détails d'un évènement en cliquant sur un marqueur;

* Sauvegarde/suppression d'un évènement dans son profil;

* Visualisation de son profil et du profil des autres utilisateurs;

* Inscription/autentification au site;

* Ajout d'évènements à son profil depuis le profil d'un autre;

* Recherche d'utilisateurs et de lieux.

## L'architecture

Le site est regroupé en deux containers Docker : 

- Web : contenant notre API ainsi que le front-end, exposé sur le port 8080, mappé sur le port 80 de la machine hôte;

* DB : contenant notre base de donnée MongoDB

## Lancement du projet

Afin de faciliter le lancement du projet, nous avons mis en place un fichier docker-compose.

### Pré-requis

Pour pouvoir lancer ce projet, il est nécessaire d'avoir :

* Docker
* Docker-compose

### Lancement

Le lancement du projet est effectué grace a la commande ci-dessous : 

```bash
docker-compose up -d
```

Il suffit ensuite simplement d'ouvrir un navigateur et d'aller sur`localhost` ou `127.0.0.1`

## Les routes

Notre API dispose des routes suivantes :

```javascript
GET /register
```
Envoi fichier du *register.html*.

```bash
POST /register
```
Ajoute un utilisateur au site. Le champ `id` doit être unique dans toute la base de donnée.

Paramètres :

| Nom   | Type  | Description  |
|---|---|---|
| username | String  | ID de l'utilisateur  |
| name  | String  | Nom de l'utilisateur  |
| pass  | String  | Mot de passe de l'utilisateur  |

```bash
GET /login
```
Envoi du fichier *login.html*.

```bash
POST /login
```
Vérifie si un utilisateur a le droit de ce connecter à l'application. Si oui, un token est créé et renvoyé à l'utilisateur pour maintenir sa session.

Paramètres :

| Nom   | Type  | Description  |
|---|---|---|
| username | String  | ID de l'utilisateur  |
| pass  | String  | Mot de passe de l'utilisateur  |

```bash
GET /logout
```
Deconecte l'utilisateur en supprimant son token JWT.

```bash
GET /map
```
Envoi du fichier *map.html*.

```bash
GET /profil
```
Retourne l'ID et le nom de l'utilisateur courant.

Paramètres :

| Nom   | Type  | Description  |
|---|---|---|
| username | String  | ID de l'utilisateur  |
| name  | String  | Nom de l'utilisateur  |


```bash
GET /profil/favorite
```
Retourne une liste des évènements favoris de l'utilisateur courant.

```bash
POST /profil/event/:eventID
```
Ajoute un évènement à la liste des favoris de l'utilisateur courant.

Paramètres :

| Nom   | Type  | Description  |
|---|---|---|
| eventID  | String  | ID de l'évènements |

```bash
DELETE /profil/event/:eventID
```
Supprime un évènement de la liste des favoris de l'utilisateur courant.

Paramètres :

| Nom   | Type  | Description  |
|---|---|---|
| eventID  | String  | ID de l'évènements |

```bash
GET /event/:latitude/:longitude/:radius
```
Retourne une liste d'évènements

Paramètres :

| Nom   | Type  | Description  |
|---|---|---|
| latitude  | String  | latitude du lieu |
| longitude  | String  | longitude du lieu |
| radius  | String  | rayon dans lequel chercher (en KM) |

```bash
GET /profil/names/:name
```
Retourne une liste de profil utilisateur matchant un mot clé

Paramètres :

| Nom   | Type  | Description  |
|---|---|---|
| name  | String  | Utilisateur recherché |

```bash
GET /profil/:name
```
Retourne le profil de l'utilisateur matchant un mot clé

Paramètres :

| Nom   | Type  | Description  |
|---|---|---|
| name  | String  | Utilisateur recherché |

```bash
POST /profil/edit/check
```
Vérifie si un ID d'utilisateur est libre.

Paramètres :

| Nom   | Type  | Description  |
|---|---|---|
| username  | String  | ID d'Utilisateur à vérifier |

```bash
POST /profil/edit/activate
```
Vérifie le mot de passe de l'utilisateur courant afin d'activer l'édition de son mot de passe.

Paramètres :

| Nom   | Type  | Description  |
|---|---|---|
| pass  | String  | Mot de passe du l'utilisateur |

```bash
POST /profil/edit
```
Applique les modifications de profil demandées par l'utilisateur.

Paramètres :

| Nom   | Type  | Description  |
|---|---|---|
| username  | String  | ID de l'utilisateur |
| name  | String  | Nom de l'utilisateur |
| pass  | String  | Mot de passe de l'utilisateur |
