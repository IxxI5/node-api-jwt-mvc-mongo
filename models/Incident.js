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
