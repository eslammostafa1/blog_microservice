import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentByPostId[req.params.id] || [])
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentByPostId[req.params.id] || [];
    comments.push({ id: commentId, content, status: 'pending' });
    commentByPostId[req.params.id] = comments;
    
    //create event of commentCreated direct event to eventBus service 
    await axios.post('http://localhost:4005/events', {
        type: 'commentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    })
 
    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log('event received: ', req.body.type);
    const { type, data } = req.body;
    

    if ( type === 'commentModerated') {
        const { postId, id, status, content } = data;
        //get comments of post in the request 
        const comments = commentByPostId[postId]
        //get comment that will update this status 
        const comment = comments.find(comment => {
            return comment.id === id
        })
        comment.status = status;
        //new event to event bus to update all services with a comment status
        await axios.post('http://localhost:4005/events', {
            type: 'commentUpdated',
            data: {
                id,
                content,
                postId,
                status
            }
        });
    }
    res.send({});
});

app.listen(4001, () => {
    console.log('app lsiten to port 4001')
})
 