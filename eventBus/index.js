import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

const app = express();


app.use(bodyParser.json());
app.use(cors());

//store all event happen to reuse it if any service crash 
const events = []; 

app.post('/events', (req, res) => {
    const event = req.body;
    events.push(event);

    axios.post('http://localhost:4000/events', event).catch((error) => {
        console.log(error.message)
    });
    axios.post('http://localhost:4001/events', event).catch(error => {
        console.log(error.message)
    });
    axios.post('http://localhost:4002/events', event).catch(error => {
        console.log(error.message)
    });
    axios.post('http://localhost:4003/events', event).catch(error => {
        console.log(error.message)
    });

    res.send({ status: 'event success' })
});

//service can get all events happen and update it's response to increase availability
app.get('/events', (req, res) => {
    res.send(events);
})

app.listen(4005, () => {
    console.log('app listen on port 4005')
})
