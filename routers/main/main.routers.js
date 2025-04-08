const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.render("main/main")
})


router.get('/', (req, res) => {
    const { login_access_token } =  req.cookies;
    if(login_access_token){
        const { properties } = jwt.verify(login_access_token, "jwt_key");
        res.render('main/main', {data : properties})
    } else {
        res.render('main/main', {data : undefined });
    }
})

module.exports = router;