const express = require('express');
const router = express.Router();

router.get('/manage', (req, res) => {
    res.render('club/manage_club');
});


module.exports = router;