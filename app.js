const { default: axios } = require("axios")
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/webhook', async (req, res) => {
    let reply_token = req.body.events[0].replyToken
    let msg = req.body.events[0].message.text
    let replymsg
    if (msg === 'Start') {
        replymsg = 'Starting....'
        bin_operator("start")
        reply(reply_token, replymsg)
    } else if (msg === 'Speed') {
        replymsg = 'Speeding up'
        bin_operator("speed")
        reply(reply_token, replymsg)
    } else if (msg === 'Slow') {
        replymsg = 'Slowing Down'
        bin_operator("slow")
        reply(reply_token, replymsg)
    } else {
        replymsg = 'Please choose option from menu.'
        reply(reply_token, replymsg)
    }

    res.sendStatus(200)
})

app.listen(port)

function reply(reply_token, msg) {
    // let status = await getStatus()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {LijrMkVBFJFPdCkdjrGY9LBzaFXk2qPNZYRQXjTd64zbY/QBdDXdQjrr+6rBZPg/UnnS2YdOrd1llF6pp0GMm3KjGL0sdJQ/IbU3w+Js6MyzuE7K0T1/aWfUk/wOKLMbo6gVw7rpmijRqxVf4T8rRgdB04t89/1O/w1cDnyilFU=}'
    }
    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [
        {
            type: 'text',
            text: msg
        }]
    })
    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
}

function bin_operator(op) {
    if (op === "start") {
        let res = axios.get("https://smart-bin-controller-server.herokuapp.com/moving?state=1")
        return
    } else if (op === "speed") {
        let res = axios.get("https://smart-bin-controller-server.herokuapp.com/setspeed?state=increase")
        return
    } else if (op === "slow") {
        let res = axios.get("https://smart-bin-controller-server.herokuapp.com/setspeed?state=decrease")
        return
    }
}

