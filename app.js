const { default: axios } = require("axios")
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// async function getData(){
//     let res = await axios.get("https://smart-bin-controller-server.herokuapp.com/")
//     return res
// }

app.post('/webhook', (req, res) => {
    // let data = await getData()
    // console.log(data.data)
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
    } else if (msg === 'speed100') {
        replymsg = 'Set speed to 100'
        bin_operator("speed100")
        reply(reply_token, replymsg)
    } else if (msg === 'speed150') {
        replymsg = 'Set speed to 150'
        bin_operator("speed150")
        reply(reply_token, replymsg)
    } else if (msg === 'speed200') {
        replymsg = 'Set speed to 200'
        bin_operator("speed200")
        reply(reply_token, replymsg)
    } else if (msg === 'turnleft') {
        replymsg = 'Turning left'
        bin_operator("turnright")
        reply(reply_token, replymsg)
    } else if (msg === 'turnright') {
        replymsg = 'Turning right'
        bin_operator("turnleft")
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
        let res = axios.get("https://smart-bin-controller-server.herokuapp.com/moving?state=1&setspeed=100")
        return
    } else if (op === "speed") {
        let res = axios.get("https://smart-bin-controller-server.herokuapp.com/setspeed?state=increase")
        return
    } else if (op === "slow") {
        let res = axios.get("https://smart-bin-controller-server.herokuapp.com/setspeed?state=decrease")
        return
    } else if (op === "speed100") {
        let res = axios.get("https://smart-bin-controller-server.herokuapp.com/setspeed?spd=100")
        return
    } else if (op === "speed150") {
        let res = axios.get("https://smart-bin-controller-server.herokuapp.com/setspeed?spd=150")
        return
    } else if (op === "speed200") {
        let res = axios.get("https://smart-bin-controller-server.herokuapp.com/setspeed?spd=200")
        return
    } else if (op === "turnleft") {
        let res = axios.get("https://smart-bin-controller-server.herokuapp.com/turn?state=left")
        return
    } else if (op === "turnright") {
        let res = axios.get("https://smart-bin-controller-server.herokuapp.com/turn?state=right")
        return
    }
}

