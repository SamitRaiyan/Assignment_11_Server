const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jj1r1yn.mongodb.net/?retryWrites=true&w=majority`;



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
    // await client.connect();
    
    const alltoys = client.db('Sports').collection('alltoys');
    

    
    app.get('/alltoys', async (req, res) => {
        const cursor = alltoys.find();
        const result= await cursor.toArray();
      res.send(result)
    })
   
    app.get('/alltoys/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const user = await alltoys.findOne(query);
      res.send(user);
  })
   
    
  app.post('/alltoys', async(req, res) => {
    const toy = req.body;
    console.log('new toy', toy);
    const result = await alltoys.insertOne(toy);
    res.send(result); 
});
 
app.patch('/alltoys/:id', async(req, res) =>{
  const id = req.params.id;
  const toy = req.body;
  console.log(id, toy);
  
  const filter = {_id: new ObjectId(id)}
  const options = {upsert: true}
  const updatedtoy = {
      $set: {
        price: toy.price,
        quantity: toy.quantity,
          description:toy.description
      }
  }

  const result = await alltoys.updateOne(filter, updatedtoy, options );
  res.send(result);

})

app.delete('/alltoys/:id', async(req, res) =>{
  const id = req.params.id;
  console.log(' delete from database', id);
  const query = { _id: new ObjectId(id)}
  
  const result = await alltoys.deleteOne(query);
  res.send(result);
})
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Sports vally is running ')
})
app.listen(port, () => {
    console.log(`ToyShop is running on port ${port}`)
})