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

_This document describes the steps of developing a simple Web API in NodeJS from scratch demonstrating the following_:

&check; (Controllers) **incidentsController.js, usersController.js**: Defining the logic (Controller) behind the Web API responses for any client request

&check; (Models) **Incident.js, User.js**: Creating two simple models using Mongoose

&check; (Views) **incidentsRouter.js, usersRouter.js**: Defining the routes (Web API endpoints responses to client requests) through the Express Router:

- **users/register** [POST]: creates a new user document in Mongo database

- **users/login** [POST]: user (sends the access and refresh tokens stored in seperate httpOnly cookies)

- **users/logout** [POST]: loggedin user (access and refresh tokens are forced to expire (creation of expired tokens))

- **users/refresh** [POST]: access token (sends a new access token created from an existing refresh token)

- **users/** [GET]: actual loggedin user

- **incidents/** [GET]: all incidents stored in Mongo database

- **incidents/:userId** [GET]: all incidents stored in Mongo database by userId

- **incidents/** [POST]: creates an incident document in Mongo database

- **incident/:incId** [DELETE]: deletes an incident document stored in Mongo database by incId

&check; **.env**: Defining the environment variables as the **MONGODB_URI**, **API_PORT**, and **JWT_SECRET**

&check; **auth.js**: Authenticating (JWT access token verification) a client request

&check; **index.js**:

- **Connecting to the Mongo database** through the MongoDB Server

- **Starting the Web API Server** for listening to user requests

## Table of Contents

- [Step 1 - Install the VS Code Non-Mandatory Plugins](#step-1---install-the-vs-code-non-mandatory-plugins)
- [Step 2 - Install the MongoDB Server on your Desktop](#step-2---install-the-mongodb-server-on-your-desktop)
- [Step 3 - Install the MongoDB Shell on your Desktop](#step-3---install-the-mongodb-shell-on-your-desktop)
- [Step 4 - Create the Project Structure](#step-4---create-the-project-structure)
- [Step 5 - Install the Packages (dependencies)](#step-5---install-the-packages-dependencies)
- [Step 6 - Define the Environment Variables (.env)](#step-6---define-the-environment-variables-env)
- [Step 7 - Define the Controllers](#step-7---define-the-controllers)
- [Step 8 - Define the Models (using Mongoose)](#step-8---define-the-models-using-mongoose)
- [Step 9 - Define the Views](#step-9---define-the-views)
- [Step 10 - JWT Authentication](#step-10---jwt-authentication)
- [Step 11 - Define the Web API Middlewares and Server](#step-11---define-the-web-api-middlewares-and-server)
- [Step 12 - Start the Web API](#step-12---start-the-web-api)

### [**Step 1 - Install the VS Code Non-Mandatory Plugins**](#table-of-contents)

- **Thunder Client**: A a lightweight Rest API Client Extension for Visual Studio Code

- **MongodDB for VS Code**: Easy to work with your data in MongoDB directly from your VS Code environment

### [**Step 2 - Install the MongoDB Server on your Desktop**](#table-of-contents)

- **Download MongoDB Community Server**: https://www.mongodb.com/try/download/community

- **Install MongoDB**: As a Service. Apply default options during installation

- **Services**: MongoDB Database Server is running

### [**Step 3 - Install the MongoDB Shell on your Desktop**](#table-of-contents)

- **Download MongoDB Shell**: https://www.mongodb.com/try/download/shell

- **Extract the File**: Unzip mongosh-x.xx.x-win32-x64.zip file

- **Run the Mongosh.exe**: Run ..\mongosh-x.xx.x-win32-x64\mongosh-x.xx.x-win32-x64\bin\mongosh.exe

**Mongosh (MongoDB Shell) Command Prompt Terminal**

- Create (preparation) the database:

  ```
  use repository
  ```

- Create a user object with read/write roles to connect to "repository" database:
  ```
  db.createUser({
    user: "username1234",
    pwd: "password1234",
    roles: [{ role: "readWrite", db: "repository" }],
  });
  ```

### [**Step 4 - Create the Project Structure**](#table-of-contents)

**VS Code Command Prompt Terminal**

```
mkdir api

cd api

mkdir controllers

mkdir models

mkdir views

type nul > controllers/incidentsController.js

type nul > controllers/usersController.js

type nul > models/Incident.js

type nul > models/User.js

type nul > views/incidentsRouter.js

type nul > views/usersRouter.js

type nul > .env

type nul > auth.js

type nul > index.js

npm init -y
```

**Resulted Project Structure**

```
api
  │
  ├── controllers
  ├── models
  ├── views
  ├── .env
  ├── auth.js
  ├── index.js
  └── package.json
```

**Modify the created package.json** as follow:

```javascript
{
  "name": "node-web-api",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "start": "nodemon index.js"
  },
}
```

### [**Step 5 - Install the Packages (dependencies)**](#table-of-contents)

**VS Code Command Prompt Terminal**

```
npm install
```

**Resulted package.json**

```javascript
{
  "name": "node-web-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
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
  }
}

// Note: dependencies versions may vary.
```

### [**Step 6 - Define the Environment Variables (.env)**](#table-of-contents)

**.env**

```
MONGODB_URI=mongodb://username1234:password1234@localhost:27017/repository

API_PORT=8000

JWT_SECRET=KKKmyJwtsecretKeykkk
```

### [**Step 7 - Define the Controllers**](#table-of-contents)

**controllers/incidentsController.js**

```javascript
/* imports the Incidents Model */
const IncidentModel = require("../models/Incident");

/* imports the sign, decode and verify functions of jwt the library */
const jwt = require("jsonwebtoken");

/* get all incidents from the mongo database */
const GetAllIncidents = async (req, res) => {
  try {
    /* find all incidents  */
    const incidents = await IncidentModel.find({});

    res.status(200).json(incidents);
  } catch (err) {
    res.status(400).json(err);
  }
};

/* get all incidents by author from the mongo database */
const GetAllIncidentsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // /incidents/:id
    const incidents = await IncidentModel.find().where({
      userId: userId,
    });

    res.status(200).json(incidents);
  } catch (err) {
    res.status(400).json(err);
  }
};

/* creates a new incident document into database */
const CreateIncident = async (req, res) => {
  const { project, title, description, type, status } = req.body;
  const newIncident = new IncidentModel({
    project,
    title,
    description,
    type,
    status,
  });

  const secretKey = process.env.JWT_SECRET;
  const token = req.cookies["access-token"];
  const { username, id } = jwt.verify(token, secretKey);

  await newIncident
    .save()
    .then(() => {
      newIncident.incidentId = `${newIncident.project}-${newIncident.incId}`; // populate the incidentId property
      newIncident.userId = id;
      newIncident.save();

      res.status(201).json({
        message: "INCIDENT CREATED",
        incidentId: newIncident.incidentId,
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

/* deletes a single incident by incidentId from the mongo database */
const DeleteIncident = async (req, res) => {
  try {
    const incId = req.params.incId;

    await IncidentModel.deleteOne({ incId: incId });

    res.status(200).json({ message: "INCIDENT DELETED", incId: incId });
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  GetAllIncidents,
  GetAllIncidentsByUserId,
  CreateIncident,
  DeleteIncident,
};
```

**controllers/usersController.js**

```javascript
/* imports the Users Model */
const UserModel = require("../models/User");

/* imports the sign, decode and verify functions of jwt the library */
const jwt = require("jsonwebtoken");

/* library to hash passwords */
const bcrypt = require("bcrypt");

/* controller function for registering a user */
const Register = async (req, res) => {
  /*  request data from body (send by the client) */
  const { username, password } = req.body;

  /* find the user in database having the given username */
  const user = await UserModel.findOne({ username: username });

  if (user) {
    return res
      .status(400)
      .json({ message: "USERNAME ALREADY EXISTS", username: username });
  }

  /* hashes (obscures/not readable in database) and then creates a user in database with the hashed password */
  await bcrypt
    .hash(password, 10)
    .then((hash) => {
      const userObj = {
        username: username,
        password: hash,
      };

      const newUser = new UserModel(userObj);
      newUser.save();

      res.status(201).json({ message: "USER CREATED", username: username });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

/* controller function for logging in a user */
const Login = async (req, res) => {
  /* request data from body (send by the client) */
  const { username, password } = req.body;

  /* find the user in database having the given username */
  const user = await UserModel.findOne({ username: username }); // instead of username, use req.body.username

  if (!user) {
    res
      .status(400)
      .json({ message: "USER DOES NOT EXIST", username: username });

    return;
  }

  const dbPassword = user.password;

  /* while logging in, the unhashed entered password is hashed and compared with all those in database (if any)  */
  await bcrypt.compare(password, dbPassword).then((match) => {
    if (!match) {
      res.status(400).json({ message: "WRONG USERNAME AND PASSWORD" });
    } else {
      const secretKey = process.env.JWT_SECRET;
      const userObj = { username: user.username, id: user.userId };

      const accessToken = jwt.sign(userObj, secretKey, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(userObj, secretKey, {
        expiresIn: "1d",
      });

      res
        .cookie("refresh-token", refreshToken, {
          httpOnly: true,
        })
        .cookie("access-token", accessToken, {
          httpOnly: true,
        })
        .status(200)
        .json({ message: "LOGGED IN", username: username });
    }
  });
};

/* controller function for logging out a logged in user */
const Logout = async (req, res) => {
  const secretKey = process.env.JWT_SECRET;
  const token = req.cookies["access-token"];

  let expired = false;

  if (!token) {
    return res
      .status(400)
      .json({ message: "LOGGED OUT. NO ACCESS TOKEN AVAILABLE" });
  }

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      console.log(err.message);
      res.status(400).json(err);
      expired = true;
    }
  });

  if (expired) return;

  /* synchronously verify and decode the access token */
  const { username, id } = jwt.verify(token, secretKey);
  const accessToken = jwt.sign({ username: username, id: id }, secretKey, {
    expiresIn: "-1h", // expires immediatelly
  });

  const refreshToken = jwt.sign({ username: username, id: id }, secretKey, {
    expiresIn: "-1h", // expires immediatelly
  });

  /* send (response) back the invalid (expired) access and refresh tokens */
  res
    .cookie("refresh-token", refreshToken, {
      httpOnly: true,
    })
    .cookie("access-token", accessToken, {
      httpOnly: true,
    })
    .status(200)
    .json({ message: "LOGGED OUT", username: username });
};

/* creates an access from the refresh token */
const Refresh = async (req, res) => {
  /* jwt secret is stored in the .env file */
  const secretKey = process.env.JWT_SECRET;
  const refreshToken = req.cookies["refresh-token"];

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "ACCESS DENIED. NO REFRESH TOKEN AVAILABLE" });
  }

  try {
    /* synchronously verify and decode the accessToken */
    const { username, id } = jwt.verify(refreshToken, secretKey);

    /* create a new accessToken from the refreshToken  */
    const accessToken = jwt.sign({ username: username, id: id }, secretKey, {
      expiresIn: "1h",
    });

    /* send (response) back the new accessToken */
    res
      .cookie("access-token", accessToken, {
        httpOnly: true,
      })
      .status(200)
      .json({ username: username, id: id });
  } catch (error) {
    return res.status(400).json({ message: "INVALID REFRESH TOKEN" });
  }
};

/* controller function for getting the loggedin user */
const GetUser = async (req, res) => {
  try {
    const secretKey = process.env.JWT_SECRET;
    const token = req.cookies["access-token"];
    const { username, id } = jwt.verify(token, secretKey);

    res.status(200).json({ username: username, id: id });
  } catch (err) {
    return res.status(400).json({ message: "INVALID USER DATA" });
  }
};

module.exports = {
  Register,
  Login,
  Logout,
  Refresh,
  GetUser,
};
```

### [**Step 8 - Define the Models (using Mongoose)**](#table-of-contents)

**models/Incident.js**

```javascript
/* library to access mongo database from Node.js */
const mongoose = require("mongoose");

/* library that lets you create fields which autoincrement their value */
const AutoIncrement = require("mongoose-sequence")(mongoose);

/* incidents mongoose schema (model) */
const IncidentSchema = mongoose.Schema({
  /* project initials e.g. np (new project) */
  project: {
    type: String,
    required: true,
  },
  /* calculated property on document creation retruns e.g. np-512 */
  incidentId: {
    type: String,
  },
  /* e.g. button does not work */
  title: {
    type: String,
    required: true,
  },
  /* e.g. button monitor value works but button does nothing */
  description: {
    type: String,
    required: true,
  },
  /* e.g. sw */
  type: {
    type: String,
    enum: ["sw", "hw"], // sw (software) or hw (hardware)
    required: true,
  },
  /* e.g. new */
  status: {
    type: String,
    enum: ["new", "assigned", "closed"],
    default: "new",
    required: true,
  },
  /* e.g. provided from the decoded accessToken */
  userId: {
    type: Number,
  },
});

/* automatically adds the id property  */
IncidentSchema.plugin(AutoIncrement, { inc_field: "incId" }); // works only with"mongoose": "^6.11.2" and tested with "mongoose-sequence": "^5.3.1"

const IncidentModel = mongoose.model("incidents", IncidentSchema);

module.exports = IncidentModel;
```

**models/User.js**

```javascript
/* library to access mongo database from Node.js */
const mongoose = require("mongoose");

/* library that lets you create fields which autoincrement their value */
const AutoIncrement = require("mongoose-sequence")(mongoose);

/* users mongoose schema (model) */
const UserSchema = new mongoose.Schema({
  /* e.g. john1234 */
  username: {
    type: String,
    required: true,
    unique: true,
  },
  /* e.g. password1234 */
  password: {
    type: String,
    required: true,
  },
  /* it is automatically created and populated through the AutoIncrement (see below) */
  // userId: {
  //   type: Numbrer,
  // },
});

/* automatically adds the userId property with auto increment capabilities  */
UserSchema.plugin(AutoIncrement, { inc_field: "userId" }); // works only with"mongoose": "^6.11.2" and tested with "mongoose-sequence": "^5.3.1"

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
```

### [**Step 9 - Define the Views**](#table-of-contents)

**views/incidentsRouter.js**

```javascript
/* web framework for Node.js */
const express = require("express");

/* import the incidents controller functions */
const {
  GetAllIncidents,
  GetAllIncidentsByUserId,
  CreateIncident,
  DeleteIncident,
} = require("../controllers/incidentsController");

/* validates a token e.g. hosted in a protected cookie (httpOnly) */
const auth = require("../auth");

/* defines the router function */
const router = express.Router();

/* incidents router */
router.get("/", auth, GetAllIncidents);
router.get("/:userId", auth, GetAllIncidentsByUserId);
router.post("/", auth, CreateIncident);
router.delete("/:incId", auth, DeleteIncident);

module.exports = router;
```

**views/usersRouter.js**

```javascript
/* web framework for Node.js */
const express = require("express");

/* import the users controller functions */
const {
  Register,
  Login,
  Logout,
  Refresh,
  GetUser,
} = require("../controllers/usersController");

/* validates a token e.g. hosted in a protected cookie (httpOnly) */
const auth = require("../auth");

/* defines the router function */
const router = express.Router();

/* users router */
router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/refresh", Refresh);
router.get("/", auth, GetUser);

module.exports = router;
```

### [**Step 10 - JWT Authentication**](#table-of-contents)

**auth.js**

```javascript
/* loads  environment variables from .env file */
require("dotenv").config();

/* library to sign, decode and verify jwt web tokens */
const jwt = require("jsonwebtoken");

/* authenticates (access token verification) a request */
const auth = async (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  const refreshToken = req.cookies["refresh-token"];

  /* check if both access and refresh tokens are available */
  if (!accessToken && !refreshToken) {
    return res
      .status(401)
      .send("ACCESS DENIED. NO ACCESS AND REFRESH TOKENS AVAILABLE");
  }

  /* jwt secret is stored in the .env file */
  const secretKey = process.env.JWT_SECRET;

  try {
    /* synchronously verify and decode the accessToken */
    const decoded = jwt.verify(accessToken, secretKey);

    /* req.user is a custom key (but we do not use it) that is accessible from where the authenticate is called */
    req.user = decoded.username;

    next();
  } catch (err) {
    /* if accessToken is not valid, check if the refreshToken is available */
    if (!refreshToken) {
      return res.status(401).send("ACCESS DENIED. NO REFRESH TOKEN AVAILABLE");
    }

    try {
      /* create an accessToken from the refreshToken */
      const decoded = jwt.verify(refreshToken, secretKey);
      const accessToken = jwt.sign(
        { user: decoded.userObj.username, id: decoded.userObj.id },
        secretKey,
        {
          expiresIn: "1h",
        }
      );

      /* resend (response) the existing refreshToken (httpOnly cookie) along with the newly created accessToken (header) */
      res
        .cookie("refresh-token", refreshToken, {
          httpOnly: true,
        })
        .cookie("access-token", accessToken, {
          httpOnly: true,
        })
        .status(200)
        .send();
    } catch (err) {
      /* at this point it means both accessToken and refreshToken are available but invalid */
      return res.status(400).json("INVALID ACCESS AND REFRESH TOKENS");
    }
  }
};

module.exports = auth;
```

### [**Step 11 - Define the Web API Middlewares and Server**](#table-of-contents)

**index.js**

```javascript
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
```

### [**Step 12 - Start the Web API**](#table-of-contents)

**VS Code Command Prompt Terminal**

```
npm start
```

**Result**

```
MongoDB Database Server (MongoDB) is Running...

API Server (Port 8000) is Running...
```
