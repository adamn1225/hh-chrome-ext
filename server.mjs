import express from 'express';
import bodyParser from 'body-parser';
import sendEmailRoute from './src/api/send-email.mjs';

const app = express();
const port = process.env.PORT || 3001; // Ensure this is set to 3001

app.use(bodyParser.json());
app.use('/api/send-email', sendEmailRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});