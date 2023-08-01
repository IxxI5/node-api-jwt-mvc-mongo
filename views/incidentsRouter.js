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
