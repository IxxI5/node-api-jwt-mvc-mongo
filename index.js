/* loads  environment variables from .env file */
require("dotenv").config();

/* library to add colors to console output */
require("colors");

/* library to access mongo database from Node.js */
const mongoose = require("mongoose");

/* web framework for Node.js */
const express = require("express");

/* library that provides Cross-origin resource sharing (means outside the domain from which the web api is being served) */
const cors = require("cors");

/* creates an Express application */
const app = express();

/* parses cookie header or may create cookie with httpOnly (inaccessible to client-side scripts) */
const cookieParser = require("cookie-parser");

/* imports the users router */
const usersRouter = require("./views/usersRouter");

/* imports the incidents router */
const incidentsRouter = require("./views/incidentsRouter");

/* mongoDB uri connection string */
const MONGODB_URI = process.env.MONGODB_URI;

/* API PORT */
const API_PORT = process.env.API_PORT;

/* middleware => only parses json */
app.use(express.json());

/* middleware => parses cookies => that are sent to client with a server request and stored on the client side */
app.use(cookieParser());

/* middleware => cors */
app.use(cors());

/* middleware => users and incidents routers */
app.use("/users", usersRouter);
app.use("/incidents", incidentsRouter);

/* initiate the connection to MongoDB server and then listen to user requests  */
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB Database Server (MongoDB) is Running...".bgCyan);
  })
  .then(() => {
    // on successful connection with the database, listen (web api) to user requests
    app.listen(API_PORT, () => {
      console.log(`API Server (Port ${API_PORT}) is Running...`.bgBlue);
    });
  })
  .catch((err) => {
    console.log(`${err}`.bgRed);
  });

/* Node WEB API Endpoints
   e.g. http://localhost:3001/incidents

  POST:   /register
  POST:   /login
  POST:   /logout
  POST:   /incidents
  DELETE: /incidents/:incidentId
  GET:    /incidents/:authorId
  GET:    /user
    
*/
