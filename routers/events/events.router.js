const router = require('express').Router();
const axios = require('axios');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');


router.get('/events', async (req, res) => {
    try{
        const {login_access_token} = req.cookies;
        const {properties} = jwt.verify(login_access_token, process.env.TOKEN)
        if(properties) {
            res.render('events/events', {data : properties})
        }
        else {
            res.render('events/events', {data : properties})
        }
    }
    catch(error) {
        console.log('error', error)
        res.render('main/main', {data : null})
    }
    // res.render('events/events')
})


module.exports = router