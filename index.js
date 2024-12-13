const express = require('express')

const app = express()
const port = 3000
app.use(express.static(__dirname + '/public'))

app.get

app.listen(port, () => {
    console.log("A P P   O N L I N E")
})