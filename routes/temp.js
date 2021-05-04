var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');
const TelegramBot = require('node-telegram-bot-api')
let botCredentials = require('../telegramBot.json');
console.log(botCredentials, 'the json obj');

// MongoDB setup
const MongoClient = mongodb.MongoClient;
const dbURL = "mongodb://localhost";

// Start bot
let bot = telegramBot();

function telegramBot() {
    const token = botCredentials.accessToken
    const bot = new TelegramBot(token, { polling: true })
    bot.onText(/\/echo (.+)/, (msg, match) => {

        const chatId = msg.chat.id
        const resp = match[1]
        bot.sendMessage(chatId, resp)
    });

    let users = []
    bot.onText(/\/register/, (msg, match) => {
        const chatId = msg.chat.id
        users.push(chatId)
        console.log('user registered')
        bot.sendMessage(chatId, 'Done.')
    })
    botSendTemperature(bot);
}


function botSendTemperature(bot) {
    bot.on('message', (msg) => {
        const chatId = msg.chat.id
        if (msg.text === 'getTemp') {

            MongoClient.connect(dbURL, {useUnifiedTopology: true}, (err, client) => {
                if (err) throw err;
                else {
                    const db = client.db('responsible');
                    const tempReading = db.collection('tempReading');

                    tempReading.find( {}).project( { "temperature": { "$slice": -1 } }).toArray((err, tempData) => {
                        if (err) throw err;
                        else {
                            // Check how many records were retrieved
                            let numTempReadings = tempData[0]['temperature'].length;
                            let latestTemp = tempData[0]['temperature'][numTempReadings - 1]['degreesCelsius'];
                            let timestamp = tempData[0]['temperature'][numTempReadings - 1]['timestamp'];
                            let readingDate = new Date(timestamp * 1000).toString().substr(0, 21);
                            bot.sendMessage(chatId, "Temperature: " + latestTemp + "°C.\n" + readingDate);
                        }
                        client.close();
                    });
                }
            });

        }
    });
}


router.get('/', (req, res) => {
    let sensorData = {};

    MongoClient.connect(dbURL, {useUnifiedTopology: true}, (err, client) => {
        if (err) throw err;
        else {
            const db = client.db('responsible');
            const tempReading = db.collection('tempReading');

            tempReading.find( {}).project( { "temperature": { "$slice": -10 } }).toArray((err, tempData) => {
                if (err) throw err;
                else {
                    let numTempReadings = tempData[0]['temperature'].length;
                    sensorData = {"lastReadTemp": tempData[0]['temperature'][numTempReadings - 1]['degreesCelsius'],
                        timestamp: tempData[0]['temperature'][numTempReadings - 1]['timestamp']};

                    console.log("sensor data: " + sensorData.lastReadTemp + " " + sensorData.timestamp);

                    res.json({result: tempData});
                    //botSendTemperature(bot, sensorData);
                }
                client.close();
            });
        }
    });

});

module.exports = router;
