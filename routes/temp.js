var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');

// MongoDB setup
const MongoClient = mongodb.MongoClient;
const dbURL = "mongodb://localhost";

router.get('/', (req, res) => {

    MongoClient.connect(dbURL, {useUnifiedTopology: true}, (err, client) => {
        if (err) throw err;
        else {
            const db = client.db('responsible');
            const tempReading = db.collection('tempReading');

            tempReading.find( {}).project( { "temperature": { "$slice": -10 } }).toArray((err, tempData) => {
                if (err) throw err;
                else {
                    console.log("Reading from Mongo: ")
                    tempData.forEach(element => {
                        console.log(element['temperature'][0]['timestamp']);
                        console.log(element['temperature'][0]['degreesCelsius']);
                    });
                }
                client.close();
                res.json({result: tempData});
            });
        }
    });

});

module.exports = router;
