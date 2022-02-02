const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());

app.use(express.static(path.join(__dirname, "/build"))); //  "public" off of current is root

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

const server = app.listen(8080, () => {
  const port = server.address().port;

  console.log(`listening at port:${port}`);
});