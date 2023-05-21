const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = 5000

// Middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASS}@cluster0.mtm85fa.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db('toyBD').collection('toyCollectioin')

    //service route
    app.get('/', (req, res) => {
      res.send('Hello World!')
    })
    
    app.get('/alltoys', async(req, res)=>{
      const projection = { _id: 1, name: 1, url: 1, sellerName: 1, category:1, price: 1, quantity:1  };
      const cursor = toyCollection.find().project(projection);
      const result = await cursor.toArray()
      res.send(result)
    })
    
    app.post('/addatoy', async(req, res)=>{
      const data = req.body;
      const result = await toyCollection.insertOne(data)
      res.send(result)
    })

    app.get('/mytoys/:mail', async(req, res)=>{
      const mail= req.params.mail
      const query = {email: mail}
      const result = await toyCollection.find(query).toArray()
      res.send(result)
    })

    app.delete('/mytoys/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await toyCollection.deleteOne(query)
      res.send(result);
    })

    app.get('/update/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await toyCollection.find(query).toArray()
      res.send(result);
    })
    
    app.patch('/update/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const options = { upsert: true };
      const toy = req.body;
      const updateDoc = { $set: toy }
      const result = await toyCollection.updateOne(query, updateDoc, options)
      res.send(result);
    })
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Server is running at port:  ${port}`)
})