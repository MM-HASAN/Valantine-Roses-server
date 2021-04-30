const express = require("express");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

//Check database in heroko
app.get("/", (req, res) => {
  res.send("Database working in heroko");
});

//connecting server
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lm8iq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const roseCollection = client.db("valantine_roses").collection("roses");

  //add rose image
  app.get("/roses", (req, res) => {
    roseCollection.find().toArray((err, items) => {
      res.send(items);
      console.log("item data", items);
    });
  });

  app.post("/addRoses", (req, res) => {
    const newRoses = req.body;
    console.log("adding images", newRoses);
    roseCollection.insertOne(newRoses).then((result) => {
      console.log("resutl count", result);
      res.send(result.insertedCount > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello, I am in port 5000 and this server side programming");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
