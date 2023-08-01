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
