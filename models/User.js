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
