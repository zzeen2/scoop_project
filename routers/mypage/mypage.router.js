


const router = require('express').Router();
const axios = require('axios');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const {Createuser, Finduser, Updatecategory, Finduserintrest, Deleteuserintrest, seedCategories, Findclub, Checkpoint, Findlike, Findactivity, Findclub_id, Getparticipantdate, Geteventtitle} = require('../../controllers/mypage/mypage.controllers');
const { getSubCategories } = require('../../controllers/club/add_club.controllers');

router.use(cookieParser())

router.get('/login', async (req, res) => { 
    try{
        const {login_access_token} = req.cookies;
        const {id, properties} = await jwt.verify(login_access_token, process.env.TOKEN)
        res.render('mypage/login',{data : properties})
    }
    catch(error) {
        res.render('mypage/login',{data : null})
    }
})
router.get('/kakao/login', (req, res) => {
    const kakaoAuth = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}`
    res.redirect(kakaoAuth)
})
router.get('/auth/kakao/callback', async(req, res) => {
    const {code} = req.query;
    const tokenUrl = `https://kauth.kakao.com/oauth/token`
    const data = new URLSearchParams({
        grant_type : 'authorization_code',
        client_id : process.env.REST_API_KEY,
        redirect_uri : process.env.REDIRECT_URI,
        code,
        client_secret : process.env.KAKAO_SECRETKEY
    })
    try {
        const response = await axios.post(tokenUrl, data, {
            headers : {
                'Content-type' : 'application/x-www-form-urlencoded'
            }
        })
        const {access_token} = response.data;
        const {data : userData} = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers : {
                Authorization: `Bearer ${access_token}`
            }
        })
        const {id, properties} = userData;
        const token = jwt.sign({id, properties}, process.env.TOKEN, {expiresIn : '2h'});
        res.cookie('login_access_token', token, {httpOnly : true, maxAge : 10 * 60 * 60 * 1000})
        res.cookie('kakao_access_token', access_token, {httpOnly : true, maxAge : 10 * 60 * 60 * 1000})
        res.redirect('/')
    } catch (error) {
        res.json(error)
    }

})
router.get('/mypage', async (req, res) => {
    try{
        const clubdata1 = []
        const club_id = []
        const {login_access_token} = req.cookies;
        const {id, properties} = jwt.verify(login_access_token, process.env.TOKEN)
        const {dataValues : Userdata} = await Finduser(id)
        const clubdata = await Findclub(id);
        const [pointdata] = await Checkpoint(id)
        const Userlevel = Math.floor(pointdata.point)
        const Activitydata = await Findactivity(id) || null;
        const Likedata = await Findlike(id) || null;
        const Participantdate = await Getparticipantdate(id) || null;
        // const eventtitle = await Geteventtitle(participantdate.participant_id_fk) || null;
        // console.log(Participantdate.arraydate, 'fffff')

        for (let i = 0; i < Activitydata.length; i++) {
            club_id.push(Activitydata[i])
        }
        for (let i = 0; i < Likedata.length; i++) {
            if(!(club_id.indexOf(Likedata[i]))){
                return;
            }else{
                club_id.push(Likedata[i])
            }           
        }
        for (let i = 0; i < club_id.length; i++) {
            const [data] = await Findclub_id(club_id[i]);
            clubdata1.push(data)
        }
        if(Userdata) {
            res.render('mypage/mypage', {data : properties, uuid : id, Userdata, clubdata, Userlevel, clubdata1, participantdate : Participantdate.arraydate, participanttitle : Participantdate.arraytitle})
        }
        else {
            res.render('mypage/mypage', {data : properties, uuid : id, clubdata, Userlevel, clubdata1, participantdate})
        }
    }
    catch(error) {
        // console.log('error', error)
        res.render('main/main', {data : null})
    }
})
router.get('/logout', (req, res) => {
    const kakao_logout = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.REST_API_KEY}&logout_redirect_uri=${process.env.LOGOUT_REDIRECT_URI}`
    res.redirect(kakao_logout)
})
router.get('/auth/kakao/logout/callback', (req, res) => {
    // console.log('hello')
    res.clearCookie('login_access_token')
    res.clearCookie('kakao_access_token')
    res.redirect('/')
})
router.get('/Edituser', async (req, res) => {
    try{
        
        const {login_access_token} = req.cookies;
        const {id, properties} = await jwt.verify(login_access_token, process.env.TOKEN)
        res.render('mypage/edituser', {data : properties})
    
    }
    catch(error) {
        console.log('error')

        res.render('mypage/edituser', {data : null})
    }
})
router.post('/Edituser', async (req, res) => {
const {login_access_token} = req.cookies;
    const {id, properties} = jwt.verify(login_access_token, process.env.TOKEN)
    const {nickname, profile_image} = properties;
    const { agevalue, gendervalue, locationvalue, contentvalue} = req.body;
    const data = await Createuser(id, nickname, profile_image, agevalue, gendervalue, contentvalue, locationvalue );
    res.json({state : 200 , message : '관심분야 수정 완료'})
    
})
router.get('/Userintrest',async (req, res) => {
    try{
        const {login_access_token} = req.cookies;
        const {id, properties} = await jwt.verify(login_access_token, process.env.TOKEN)
        res.render('mypage/userintrest', {data : properties})
    }
    catch(error) {
        console.log('error')
        res.render('mypage/userintrest', {data : null})
    }
})
router.post('/Userintrest', async (req, res) => {
    const {login_access_token} = req.cookies;
    const {id} = jwt.verify(login_access_token, process.env.TOKEN)
    const {userdata} = req.body;
    const [finddata] = await Finduserintrest(id)
    try {
        if(finddata) {
            await Deleteuserintrest(id)
            for (let i = 0; i < userdata.length; i++) {
                const data = await Updatecategory(id, userdata[i])
            }
        }
        else {     
            for (let i = 0; i < userdata.length; i++) {
                const data = await Updatecategory(id, userdata[i])
            }
        }
        res.json({state : 200, message : '추가 완료'})
    } catch (error) {
        res.json({state : 200, message : error})
    }
})
router.get('/checkcookie', (req, res) => {
    try {
        const {login_access_token} = req.cookies;
        if(login_access_token) {
            res.json({state : 200, message : 'checkcookie found'})
        }else {
            res.json({state : 400, message : 'checkcookie not found'})
        }
    } catch (error) {
        res.json({state : 400, message : error})
    }
})


module.exports = router