const router = require('express').Router();
const axios = require('axios');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');


router.get('/events', (req, res) => {
    res.render('events/events')
})


module.exports = router