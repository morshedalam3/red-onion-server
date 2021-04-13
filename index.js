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

// const collection = client.db("redoniondb").collection("foodify");
// const orderCollection = client.db("redoniondb").collection("order");

app.get('/' , (req, res) => {
  res.send("Welcome to Red Onion Backend Server");
})


app.get('/foods' , (req, res) => {
  client = new MongoClient(uri ,{useNewUrlParser:true});
  client.connect(err => {
      if(err){
          console.log(err);
      }else{
          const collection = client.db('redoniondb').collection('foodify');
          collection.find().toArray((rej,documents) => {
              if(rej){
                  console.log(rej);
                  res.status(500).send("Filed to Fetch Data ")
              }else{
                  res.send(documents);
              }
              client.close()
          })
      }
  })
})

app.get('/food/:id', (req,res) => {
  client = new MongoClient(uri,{useNewUrlParser:true,useUnifiedTopology: true})
  const foodId = Number(req.params.id)

  client.connect(err => {
    const collection = client.db("redoniondb").collection("foodify");
      console.log(foodId);
      collection.find({id:foodId}).toArray((err, documents) => {
          if(err){
              console.log(err);
          }else{
              res.send(documents[0]);
          }
          client.close();
      })
  })
})

app.get('/features' , (req,res) => {
  client = new MongoClient(uri , {useNewUrlParser:true , useUnifiedTopology: true});
  client.connect(err => {
    const collection = client.db("redoniondb").collection("foodify");
      collection.find().toArray((rej,documents) => {
          if(rej){
              res.status(500).send("Failed to fetch data");
          }else{
              res.send(documents)
          }
      }) 
      
  })

})

// Post routes
app.post('/submitorder' , (req,res) => {
  const data = req.body;
  console.log(data);
  client = new MongoClient(uri , {useNewUrlParser:true , useUnifiedTopology: true});
  client.connect(err => {
    const collection = client.db("redoniondb").collection("foodify");
      collection.insert(data , (rej, result) =>  {
          if(rej){
              res.status(500).send("Filed to inset")
          }else{
              res.send(result.ops[0])
          }
      })
  })
})

// Bellows are dummy post method used just one time
app.post('/addfood' , (req,res) => {
  const data = req.body;
  console.log(data);
  client = new MongoClient(uri , {useNewUrlParser:true , useUnifiedTopology: true});
  client.connect(err => {
    const collection = client.db("redoniondb").collection("foodify");
      collection.insertMany(data , (rej, result) =>  {
          if(rej){
              res.status(500).send("Filed to inset")
          }else{
              res.send(result)
          }
      })
  })
})
app.post('/addfeatures' , (req,res) => {
  const data = req.body;
  console.log(data);
  client = new MongoClient(uri , {useNewUrlParser:true , useUnifiedTopology: true});
  client.connect(err => {
    const collection = client.db("redoniondb").collection("foodify");
      collection.insertMany(data , (rej, result) =>  {
          if(rej){
              res.status(500).send("Filed to inset")
          }else{
              res.send(result)
          }
      })
  })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })