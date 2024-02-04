const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pillPulseRouter = require('./routes/pillpulse');

const app = express();

app.use(cors('*'));
app.use(express.json());
app.use('/api', pillPulseRouter);

app.listen(process.env.SERVER_PORT, '0.0.0.0', () => {
    console.log('server started at port '+process.env.SERVER_PORT+'...');
});