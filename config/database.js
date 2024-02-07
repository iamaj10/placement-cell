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
    .then(console.log("DB CONNECTED SUCCESSFULLY"))
    .catch((err) => {
      console.log("DB CONNECTION FAILED");
      console.log(err);
      process.exit(1);
    });
};
