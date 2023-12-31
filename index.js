const express = require('express')
const nodemailer = require('nodemailer');
const app = express()
const PORT = 2020

// Email Credentials
const serviceEmail = "wehubfreelanceagency@gmail.com"
const servicePassword = "qerqqpgtvigbfwbi"

app.use(express.json())
app.use(express.urlencoded())

//Will later change to a WebMail service
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: serviceEmail,
        pass: servicePassword
    },
})
app.get("/", (req, res) => {
    res.send("Homepage")
})

app.post("/:emailTo", async (req, res) => {
    const user = req.params.emailTo
    var siteAddress = await req.headers.referer
    var redirectLink = req.body.redirectlink

    if (redirectLink == undefined || redirectLink == null) {
        redirectLink = siteAddress
    }

    var body = req.body
    console.log(body);
    var objsKeys = Object.keys(body)
    var objsValues = Object.values(body)
    var emptyArray = []

    for (let index = 0; index < objsKeys.length; index++) {
        var html = `<h4>${objsKeys[index]}: ${objsValues[index]}</h4> <br>`
        emptyArray.push(html)
    }
    var htmlFullCode = `${emptyArray}`
    console.log(htmlFullCode);

    const mailer = transporter.sendMail({
        from: serviceEmail,
        to: user,
        subject: "New Mail from We-Hub Forms",
        html: htmlFullCode
    })
        .then(() => { res.status(200).location(redirectLink), console.log("Message Sent Succesfully") })//Mail sent succesfulyy
        .catch(err => { console.log(err), res.status(401).send('Error'), console.log("Error sending mail") })
})

app.listen(PORT, () => {
    console.log("Server is online on " + PORT);
})