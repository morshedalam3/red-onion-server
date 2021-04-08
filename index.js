const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
require('dotenv').config();


const app = express()
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ossg7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err );
  const collection = client.db("redoniondb").collection("foodify");
  const orderCollection = client.db("redoniondb").collection("order");
  console.log('mongodb connected successfully');

  app.post('/adOrder', (req, res) => {
    const newOrder = req.body;
    console.log(newOrder)
    orderCollection.insertOne(newOrder)
    .then(result => {
        res.send(result.insertedCount > 0);
    })
  })

  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, items) => {
        res.send(items)
    })
})

  app.get('/home/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    collection.find({_id:id})
    .toArray((err, documents) =>{
        res.send(documents[0])
    })
})

  app.get('/foods', (req, res) => {
    collection.find()
    .toArray((err, items) => {
        res.send(items)
    })
})
   
  app.post('/addFood', (req, res) => {
    const food = req.body;
    collection.insertMany(food)
    .then(result =>{
      console.log(result.insertedCount)
      res.send(result.insertedCount)
    })
  })

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })