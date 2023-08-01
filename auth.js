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
