
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

        app.get('/product', async(req, res) =>{
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
        app.get('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        });
 //Quantity update
 app.put("/product/:id",async(req,res)=>{
  const id =req.params.id;
  const deliveredQuantity =req.body;
  console.log(deliveredQuantity);
  const filter ={_id: ObjectId(id)};
  const options ={upsert:true};
  const updateDoc ={
    $Set:{
      quantity:deliveredQuantity.newQuantity,
    }
  };
  const result = await productCollection.updateOne(filter, updateDoc, options);
  res.send(result);
 });

 app.put("/product/:id",async(req,res)=>{
  const id =req.params.id;
  const setQuantity =req.body;
  const filter = { _id: ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
        quantity: setQuantity.newQuantity,
    }
};
const result = await productCollection.updateOne(filter, updateDoc, options);
res.send(result);
});

    }
    finally{

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello!')
})

app.listen(port, () => {
  console.log(` App listening on port ${port}`)
})