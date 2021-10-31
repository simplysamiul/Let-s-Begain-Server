const express = require ("express");
const cors = require ("cors");
const { MongoClient } = require('mongodb');
const objectId = require("mongodb").ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
 
 
// Middleware
app.use(cors());
app.use(express.json());
 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2pwml.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
async function run() {
    try{
        await client.connect();
 
        const database = client.db("package");
        const packageCollection = database.collection("items");
 
        // Get Api
        app.get('/packages', async(req,res)=>{
            const cursor = packageCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
 
        // Get Specific Api
        app.get('/packages/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: objectId(id)};
            const result = await packageCollection.findOne(query);
            res.send(result);
        });
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);
 
app.get('/', (req,res)=>{
    res.send("Server Started");
})
 
app.listen(port, (req,res)=>{
    console.log(`Port listing at ${port}`);
})
