const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const sendgridApiKey = process.env.SENDGRID_API_KEY;
if (!sendgridApiKey) {
    throw new Error('SENDGRID_API_KEY is not defined');
}
sgMail.setApiKey(sendgridApiKey);

app.post('/send-email', async (req, res) => {
    const { personalizations, from, content } = req.body;

    const msg = {
        personalizations,
        from,
        content,
    };

    try {
        await sgMail.send(msg);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.body : error);
        res.status(500).send({
            message: 'Error sending email. Please try again.',
            error: error.response ? error.response.body : error.message,
        });
    }
});

module.exports = app;