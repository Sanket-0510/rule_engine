

console.log(process.env.SECRETE_KEY)

import express from 'express';
import bodyParser from 'body-parser';


import cors from 'cors';

import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import rulesRouter from './routes/rules.js';
// import sequelize from './conn.js';


const app = express();

const port = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/rules', rulesRouter);

app.listen(port, () => {    
    console.log(`Server running on port ${port}`);
});

// sequelize.authenticate()


