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
