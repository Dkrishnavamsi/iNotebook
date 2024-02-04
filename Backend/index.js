const connectToMongo = require("./db");
const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
//for getting information from req body
app.use(express.json());
app.use(cors());

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log("iNotebook Backend listening to port 5000");
});
