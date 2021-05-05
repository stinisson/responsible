var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');
const TelegramBot = require('node-telegram-bot-api')
let botCredentials = require('../telegramBot.json');

// MongoDB setup
const MongoClient = mongodb.MongoClient;
const dbURL = "mongodb://localhost";

// Start bot
let bot = telegramBot();
let users = botRegister(bot);


function telegramBot() {
    const token = botCredentials.accessToken
    const bot = new TelegramBot(token, { polling: true })
    bot.onText(/\/echo (.+)/, (msg, match) => {
        const chatId = msg.chat.id
        const resp = match[1]
        bot.sendMessage(chatId, resp)
    });
    botSendTemperature(bot);
    return bot;
}

function botSendTemperature(bot) {
    bot.on('message', (msg) => {
        const chatId = msg.chat.id
        if (msg.text === 'temp') {

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

function botRegister(bot) {
    let users = []
    bot.onText(/\/register/, (msg, match) => {
        const chatId = msg.chat.id
        users.push(chatId)
        console.log('user registered')
        bot.sendMessage(chatId, 'Done.')
    })
    return users;
}

/*function botAlarm(bot, temperature, chatId) {
    console.log("IN botAlarm")
    if (temperature > 25) {
        console.log("temp too high")
        bot.sendMessage(chatId, "Temperature is too high! " + temperature + "°C!");
    }

}*/

function botAlarm(bot, temperature, users) {
    if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {

            if (temperature > 25) {
                bot.sendMessage(users[i], "Temperature is too high! " + temperature + "°C!");
            }
        }
    } else {
        console.log('no user registered')
    }
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

                    botAlarm(bot, sensorData.lastReadTemp, users)
                    res.json({result: tempData});

                }
                client.close();
            });
        }
    });
});

module.exports = router;
