import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

//make handling function reusable
const queryHandler = ( type, data) => {
    if( type === 'postCreated' ) {
        const { id, title } = data;
        posts[id] = {id, title, comments: []};
    }

    if( type === 'commentCreated' ) {
        const {id, content, postId, status} = data;
        const post = posts[postId]
        post.comments.push({id, content, status});
    }

    if( type === 'commentUpdated' ) {
        const {id, content, postId, status} = data;
        const post = posts[postId]
        const comment = post.comments.find(comment => {
            return comment.id === id
        })

        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    queryHandler(type, data);

    res.send({});
});


app.listen(4002, async () => {
    console.log('app listen on post 4002')
    //call event to get update events list if the query service is down 
    const res = await axios.get('http://localhost:4005/events');

    for ( let event of res.data){
        console.log('event listening: ', event.type)
        queryHandler(event.type, event.data);
    }; 
});
