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
