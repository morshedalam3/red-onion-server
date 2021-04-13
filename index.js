const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
require('dotenv').config();


const app = express()
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ossg7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('error', err)
  const collection = client.db("redoniondb").collection("foodify");
  const featureCollection = client.db("redoniondb").collection("feature");
  const orderCollection = client.db("redoniondb").collection("customerorder")
  console.log('connected successfully')

  app.post('/submitorder', (req, res) => {
    const data = req.body;
    console.log(data);
    orderCollection.insertOne(data)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/food/:id', (req, res) => {
    const foodId = Number(req.params.id);
    collection.find({ id: foodId })
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.get('/features', (req, res) => {
    featureCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.get('/foods', (req, res) => {
    collection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })
})

app.get('/', (req, res) => {
  res.send("Welcome to Red Onion Server");
})

app.post('/addfood', (req, res) => {
  const data = req.body;
  console.log(data);
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    const collection = client.db("redoniondb").collection("foodify");
    collection.insertMany(data, (rej, result) => {
      if (rej) {
        res.status(500).send("Filed to inset")
      } else {
        res.send(result.ops)
      }
    })
  })
})

app.post('/addfeatures', (req, res) => {
  const data = req.body;
  console.log(data);
  client.connect(err => {
    const featureCollection = client.db("redoniondb").collection("feature");
    featureCollection.insertMany(data, (rej, result) => {
      if (rej) {
        res.status(500).send("Filed to inset")
      } else {
        res.send(result.ops)
      }
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})