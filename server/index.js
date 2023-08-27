"use strict";

// Basic express setup:
const PORT = 8080;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/tweeter", (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.use("/tweeter", express.static(path.join(__dirname, '../public')));

// The in-memory database of tweets. It's a basic object with an array in it.
const db = require("./lib/in-memory-db");

// The `data-helpers` module provides an interface to the database of tweets.
const DataHelpers = require("./lib/data-helpers.js")(db);

// Update the dates for the initial tweets (data-files/initial-tweets.json).
require("./lib/date-adjust")();

// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// so it can define routes that use it to interact with the data layer.
const tweetsRoutes = require("./routes/tweets")(DataHelpers);

// Mount the tweets routes at the "/tweeter" path prefix:
app.use("/tweeter", tweetsRoutes);



app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
