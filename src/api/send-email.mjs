import { Router } from 'express';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const router = Router();

const sendgridApiKey = process.env.SENDGRID_API_KEY;
if (!sendgridApiKey) {
    throw new Error('SENDGRID_API_KEY is not defined');
}
sgMail.setApiKey(sendgridApiKey);

router.use(cors()); // Add CORS middleware

router.post('/', async (req, res) => {
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

export default router;