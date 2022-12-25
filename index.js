const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
require('dotenv').config()
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors()) 

const port = process.env.PORT || 5000



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rj7gjik.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
    await client.connect();
    const productCollection = client.db("emajohn").collection("products")
    

    app.get('/products',async (req,res)=>{
      // console.log(req.query)
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
        const query = {}
        const cursor = productCollection.find(query)
        let products;
        if(page || size){
          products = await cursor.skip(page*size).limit(size).toArray()
        }
        else{
          products = await cursor.toArray()
        }
        
        res.send(products)
    })
  

    app.get('/productCount', async(req,res)=>{
      const count = await productCollection.estimatedDocumentCount();
      // res.json(count)
      res.send({count})
    })

    app.post('/productByKeys',  async(req,res)=>{
      const keys = req.body
      const ids = keys.map(id => ObjectId(id))
      const query = {_id: {$in: ids}}
      const cursor = productCollection.find(query)
      const products = await cursor.toArray()
      res.send(products)
      // console.log(keys)
    })





}   
finally{

} 
}
run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})