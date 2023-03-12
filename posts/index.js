import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto';
import cors from 'cors';


const app = express();
const posts = {};

app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
    res.send(posts)
});
 
app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id , title
    };

    await axios.post('http://localhost:4005/events', {
        type: 'postCreated',
        data: {
            id, title
        }
    });

    res.status(201).send(posts[id]);
});

app.post('/events', async (req, res) => {
    console.log('event received: ', req.body.type);

    res.send({});
});

app.listen(4000, () => {
    console.log('app listen on port 4000')
})
