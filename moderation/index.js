import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();


app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'commentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        // created event from moderation service to event bus to ensure updated status of comment
        await axios.post('http://localhost:4005/events', {
            type: 'commentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        })
        res.send({})
    }
})

app.listen(4003, () => {
    console.log('app lsiten on port 4003');
})