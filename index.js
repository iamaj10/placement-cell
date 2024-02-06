const express = require("express");

const app = express();
const port = 8001;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Example app listening on port ${port}`);
});
