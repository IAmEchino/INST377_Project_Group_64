const express = require('express')
const supabaseClient = require('@supabase/supabase-js')
const bodyParser = require('body-parser')

const app = express()
const port = 3000
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())

const supabaseUrl = 'https://wsxudvanqirrsqhzsgtc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzeHVkdmFucWlycnNxaHpzZ3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5Njk2NjgsImV4cCI6MjA0OTU0NTY2OH0.tsBM7FTCm7mHNVmOCJPypYNYN-3AwwRkdvqBaKvKoJI'
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey)

app.get('/physical_addresses', async (req, res) => {
    console.log('Attempting to get all addresses')

    const {data, error} = await supabase
    .from('physical_addresses')
    .select();

    if (error) {
        console.log ('Error: ', error);
        res.send(error)
    } else {
        console.log('Data Retrieved!');
        res.send(data);
    }
})

app.post('/physical_address', async (req, res) => {
    console.log('Request', req.body);

    const physicalAddress = req.body.address;
    const dpvMatchCode = req.body.dpv_match_code;
    const dpvVacant = req.body.dpv_vacant;

    console.log("Address data ", physicalAddress, dpvMatchCode, dpvVacant)

    const {data, error} = await supabase
    .from('physical_addresses')
    .insert({
        'address' : physicalAddress,
        'dpv_match_code' : dpvMatchCode,
        'dpv_vacant' : dpvVacant
    }).select();

    if (error) {
        console.log ('Error: ', error);
        res.send(error);
    } else {
        console.log('Data Retrieved!');
        res.send(data);
    }
})

app.listen(port, () => {
    console.log("A P P   O N L I N E")
})