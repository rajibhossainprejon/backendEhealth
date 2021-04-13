const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express()
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.epeww.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

const port = 5000


  app.get('/',(req,res) => {
res.send("Hello!!")
    })
  
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
      const appointmentCollection = client.db("eHealth").collection("appointments");
    
        app.post('/addAppointment',(req, res) => {
            const appointment = req.body;
            console.log(appointment);
            appointmentCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
        });

        app.post('/appointmentsByDate', (req, res) => {
          const date = req.body; 
          console.log(date.date);
          appointmentCollection.find({date: date.date})
            .toArray((err, documents) => {
          
            res.send(documents);
                      })
             
      })
        
    });
  


app.listen(process.env.PORT || port) 