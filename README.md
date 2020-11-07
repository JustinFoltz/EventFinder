# EventFinder

**Developed by**: Maxime Hutinet, Justin Foltz

**Date:** 12.2019

## The project

EventFinder is a web application allowing users to find events (concert, festival) anywhere in the world. Users can quickly view a summary of an event, access its website for more information and add to their personal list to keep track of it. It is possible to view the list of all his friends in order to complete his own or to organize appointments.

![](./img/map.jpg)

### Functionalities

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

## How to run the project ?

### Requirements

**Docker** and **Docker-compose** must be installed.

### Running the project

1. Clone the repository;

2. Configure the project : environment variables and secrets are stored in the `.env` file in the root directory. It is at least necessary to obtain an Eventful API key ([EventFul API key](https://api.eventful.com/keys)) and to add it to the following field

   ```bash
   APIKEY=<your api key>
   ```

3. In project root folder, run the below command : 

   ```bash
   docker-compose up -d
   ```

4. navigate to `localhost` or `127.0.0.1`

