const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to API'
    });
});

//validate route using a middleware
app.post('/api/posts', verifyToken, (req, res) => {
    console.log('bearer token', req.token);
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.status(403).send('Forbidden');
        } else {
            res.json({
                message: 'post created',
                authData
            });

        }
    });
});

app.post('/api/login', (req, res) => {
    //mock user
    const user = {
        id: 1,
        username: 'nodepro',
        email: 'nodepro@gmail.com'
    }
    //CREATE A JWT TOKEN
    jwt.sign({ user }, 'secretkey', (err, token) => {
        res.json({
            token
        });
    });
});

//format of token
//Authorization: Bearer<access_token>


// verify token
function verifyToken(req, res, next) {
    // get auth header value

    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if (bearerHeader !== undefined) {
        // split at space
        const bearer = bearerHeader.split(' ');
        //get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        next();
    } else {
        //forbidden
        res.status(403).send('Forbidden user');
    }

}

app.listen(3000, () => {
    console.log('Server started on 3000');
});