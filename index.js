
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cbfh0.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const productCollection = client.db('warehouse_management').collection('products');

        app.post('/product',async(req,res)=>{
          const newProduct =req.body;
          const result =await productCollection.insertOne(newProduct);
          res.send(result)
        })
        
        app.get('/product', async(req, res) =>{
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

// post
app.post('/product', async (req, res) => {
  const newProduct = req.body;
  const result = await productCollection.insertOne(newProduct);
  res.send(result);
});


        app.get('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const query= {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        });

// my items

        app.get('/myItems',async(req,res)=>{
          const email = req.query.email;
          const query ={email:email};
          const cursor = productCollection.find(query);
          const products = await cursor.toArray()
          res.send (products);
        });



//update items
app.put("/product/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const options = { upsert: true };
  const data = req.body;
  const updateDoc = {
    $set: {
      quantity: data.quantity,
    },
  };
  const result = await productCollection.updateOne(
    query,
    updateDoc,
    options
  );
  res.send(result);
});



 // Delete items
 
        app.delete('/product/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const result = await productCollection.deleteOne(query);
          res.send(result);
      });

    }
    finally{

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Welcome to perfume world!')
})

app.listen(port, () => {
  console.log('App Listening to Port', port);
})