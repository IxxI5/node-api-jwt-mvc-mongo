## NodeJS Web API

Author: IxxI5

**Dependencies**

```javascript
/*{
"bcrypt": "^5.1.0",
"colors": "^1.4.0",
"cookie-parser": "^1.4.6",
"cors": "^2.8.5",
"dotenv": "^16.3.1",
"express": "^4.18.2",
"jsonwebtoken": "^9.0.1",
"mongoose": "^6.11.2",
"mongoose-sequence": "^5.3.1",
"nodemon": "^3.0.1"
}*/
```

This project is a small Web API developed in NodeJS demonstrating the following:

&check; (Controllers) **incidentsController.js, usersController.js**: Defining the logic (Controller) behind the Web API responses for any client request

&check; (Models) **Incident.js, User.js**: Creating two simple models using Mongoose

&check; (Views) **incidentsRouter.js, usersRouter.js**: Defining the routes (Web API endpoints responses to client requests) through the Express Router:

- **users/register** [POST]: creates a new user document in Mongo database

- **users/login** [POST]: user

- **users/logout** [POST]: loggedin user

- **users/refresh** [POST]: access token

- **users/** [GET]: actual loggedin user

- **incidents/** [GET]: all incidents stored in Mongo database

- **incidents/:userId** [GET]: all incidents stored in Mongo database by userId

- **incidents/** [POST]: creates an incident document in Mongo database

- **incident/:incId** [DELETE]: deletes an incident stored in Mongo database by incId

&check; **.env**: Defining the environment variables as the **MONGODB_URI**, **API_PORT**, and **JWT_SECRET**

&check; **auth.js**: Authenticating (JWT access token verification) a client request

&check; **index.js**:

- **Connecting to a Mongo database** through the MongoDB Server

- **Starting the Web API Server** for listening to user requests

**Getting Started**

Hint: For more information see the **node-api-howto.md**.

- **MongoDB server** is installed and running

- **Mongosh CLI**: Create a database named "repository"

- **Mongosh CLI**: Create a user (to connect to database) with read/write roles

### Installation

- Open a **Command Prompt** Terminal (VS Code)
- Create a Folder and clone the Git Project

  ```
  mkdir api

  cd api

  git https://github.com/IxxI5/node-api-jwt-mvc-mongo.git
  ```

- Install the dependecies
  ```
  npm install
  ```
- Run the web api
  ```
  npm start
  ```

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

Copyright (c) 2015 Chris Kibble

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
