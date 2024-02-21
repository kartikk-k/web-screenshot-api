import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from './router';

// for loding .env file
// const path = require('path')
// require('dotenv').config({ path: path.resolve(__dirname, '../.env') })


const app = express();
app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const PORT = process.env.PORT || 8080;

server.listen(PORT, async () => {
    console.log('Server is running on port 8080')
});


app.get('/', (req, res) => {
    res.send('active')
})

app.use('/api', router())

