var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');
const TelegramBot = require('node-telegram-bot-api')
let botCredentials = require('../telegramBot.json');
console.log(botCredentials, 'the json obj');

// MongoDB setup
const MongoClient = mongodb.MongoClient;
const dbURL = "mongodb://localhost";

router.get('/', (req, res) => {

    const token = botCredentials.accessToken
    const bot = new TelegramBot(token, { polling: true })
    bot.onText(/\/echo (.+)/, (msg, match) => {

        const chatId = msg.chat.id
        const resp = match[1]

        bot.sendMessage(chatId, resp)
    })


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
