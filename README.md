# EventFinder

**Directed by**: Maxime Hutinet, Justin Foltz

**Date:** 12.2019

## Project's description

EventFinder is a web application allowing users to find events (concert, festival) anywhere in the world. Users can quickly view a summary of an event, access its website for more information and add to their personal list to keep track of it. It is possible to view the list of all his friends in order to complete his own or to organize appointments.

![](./img/map.jpg)

## Functionalities

* Visualization of concert/festival, symbolized by markers on a map;
* Visualization of event details by clicking on a marker;
* Access to event website from event details;
* Save/delete an event in its profile;
* Viewing one's profile and the profiles of other users;
* Adding events to one's profile from someone else's profile;
* Search for users and locations.

## Technologies

- API REST and HTTP server : Express.JS, jsonwebtoken, mongoose;
- Website : HTML/CSS, JavaScript/JQuery, Bootstrap;
- Database : MongoDB;
- External API : Eventful (provides events), Leaflet (provides the map).

## Running the project

**Requirements :** Docker and Docker-compose must be installed.

1. Clone the repository;

2. In project root folder, run the below command : 

   ```bash
   docker-compose up -d
   ```

3. navigate to `localhost` or `127.0.0.1`

## Project's configuration

Environment variables and secrets are stored in the `.env` file in the root directory. It is at least necessary to obtain an Eventful API key ([EventFul API key](https://api.eventful.com/keys)) and added to the following field :

```
APIKEY=<your api key>
```