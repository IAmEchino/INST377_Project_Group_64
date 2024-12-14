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

// main pages stuff

app.get('/', async (req, res) => {
    res.sendFile('public/home.html', {root: __dirname});
})

app.get('/about', async (req, res) => {
    res.sendFile('public/about.html', {root: __dirname});
})

app.get('/functional', async (req, res) => {
    res.sendFile('public/functional.html', {root: __dirname});
})

// physical address db things
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

// email db things
app.get('/email_addresses', async (req, res) => {
    console.log('Attempting to get all emails')

    const {data, error} = await supabase
    .from('email_addresses')
    .select();

    if (error) {
        console.log ('Error: ', error);
        res.send(error)
    } else {
        console.log('Data Retrieved!');
        res.send(data);
    }
})



app.post('/email_address', async (req, res) => {
    console.log('Request', req.body);

    const emailAddress = req.body.email_address;
    const format = req.body.format;
    const domain = req.body.domain;
    const disposable = req.body.disposable
    const dns = req.body.dns

    const {data, error} = await supabase
    .from('email_addresses')
    .insert({
        'email_address' : emailAddress,
        'format' : format,
        'domain' : domain,
        'disposable' : disposable,
        'dns' : dns
    }).select();

    if (error) {
        console.log ('Error: ', error);
        res.send(error);
    } else {
        console.log('Data Retrieved!');
        res.send(data);
    }
})




// phone number db things
app.get('/phone_numbers', async (req, res) => {
    console.log('Attempting to get all phone numbers')

    const {data, error} = await supabase
    .from('phone_numbers')
    .select();

    if (error) {
        console.log ('Error: ', error);
        res.send(error)
    } else {
        console.log('Data Retrieved!');
        res.send(data);
    }
})


app.post('/phone_number', async (req, res) => {
    console.log('Request', req.body);

    const phoneNumber = req.body.phone_number;
    const valid = req.body.valid;
    const location = req.body.location;
    
    const {data, error} = await supabase
    .from('phone_numbers')
    .insert({
        'phone_number' : phoneNumber,
        'valid' : valid,
        'location' : location
    }).select();

    if (error) {
        console.log ('Error: ', error);
        res.send(error);
    } else {
        console.log('Data Retrieved!');
        res.send(data);
    }
})

app.get('/email_addresses/:email', async (req, res) => {
    const email = req.params.email;
    console.log(`Attempting to get email for: ${email}`)

    const {data, error} = await supabase
    .from('email_addresses')
    .select('email_address, domain, format')
    .eq('email_address', email)
    .single(); // Fetch a single record

    if (error) {
        console.log('Error: ', error);
        res.status(404).send(error);
    } else {
        console.log('Email Data Retrieved!');
        res.send(data);
    }
})

// New route to get a specific phone number
app.get('/phone_numbers/:phone', async (req, res) => {
    const phone = req.params.phone;
    console.log(`Attempting to get phone number for: ${phone}`)

    const {data, error} = await supabase
    .from('phone_numbers')
    .select('phone_number, location, valid')
    .eq('phone_number', phone)
    .single(); // Fetch a single record

    if (error) {
        console.log('Error: ', error);
        res.status(404).send(error);
    } else {
        console.log('Phone Number Data Retrieved!');
        res.send(data);
    }
})

// New route to get a specific physical address
app.get('/physical_addresses/:address', async (req, res) => {
    const address = req.params.address;
    console.log(`Attempting to get address for: ${address}`)

    const {data, error} = await supabase
    .from('physical_addresses')
    .select('address, dpv_match_code, dpv_vacant')
    .eq('address', address)
    .single(); // Fetch a single record

    if (error) {
        console.log('Error: ', error);
        res.status(404).send(error);
    } else {
        console.log('Physical Address Data Retrieved!');
        res.send(data);
    }
})

app.listen(port, () => {
    console.log("A P P   O N L I N E")
})