const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(
      //in memory db
      // "mongodb://localhost:27017/placement_cell",
      "mongodb+srv://dbUser:dbUserPassword@atlascluster.nesbr6t.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(console.log("Connected to DB"))
    .catch((err) => {
      console.log("Failed connecting to DB");
      console.log(err);
      process.exit(1);
    });
};
