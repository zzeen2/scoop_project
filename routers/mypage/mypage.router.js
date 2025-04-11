


const router = require('express').Router();
const axios = require('axios');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const {Createuser, Finduser, Updatecategory, Finduserintrest, Deleteuserintrest, seedCategories, Findclub} = require('../../controllers/mypage/mypage.controllers');
const { getSubCategories } = require('../../controllers/club/add_club.controllers');





router.use(cookieParser())

router.get('/login', (req, res) => {
    res.render('mypage/login')
})
router.get('/kakao/login', (req, res) => {
    const kakaoAuth = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}`
    res.redirect(kakaoAuth)
})
router.get('/auth/kakao/callback', async(req, res) => {
    const {code} = req.query;
    // console.log(code)
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
        // console.log(response)
        const {access_token} = response.data;
        // console.log(access_token)
        const {data : userData} = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers : {
                Authorization: `Bearer ${access_token}`
            }
        })
        const {id, properties} = userData;
        const token = jwt.sign({id, properties}, process.env.TOKEN, {expiresIn : '1h'});
        // console.log(userData, token, access_token)

        res.cookie('login_access_token', token, {httpOnly : true, maxAge : 10 * 60 * 60 * 1000})
        res.cookie('kakao_access_token', access_token, {httpOnly : true, maxAge : 10 * 60 * 60 * 1000})
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }

})
// router.get('/', async (req, res) => {
//     try{
        
//         const {login_access_token} = req.cookies;
//         const {id, properties} = jwt.verify(login_access_token, process.env.TOKEN)

//         console.log('done', id, properties.nickname, properties.profile_image)
//         const data = await Createuser(id, properties.nickname, properties.profile_image)
//         console.log('done')
//         res.render('main/main', {data : properties, uuid : id})
  
//     }
//     catch(error) {
//         console.log('error')
//         res.render('main/main', {data : null})
//     }
// })

router.get('/mypage', async (req, res) => {
    try{
        const {login_access_token} = req.cookies;
        const {id, properties} = jwt.verify(login_access_token, process.env.TOKEN)
        const {dataValues : Userdata} = await Finduser(id)
        const clubdata = await Findclub(id);
        // const {a} = clubdata[0]
        // console.log(clubdata,'ffffffffffff')
        console.log(clubdata, 'asdfasd')
        if(Userdata) {
            res.render('mypage/mypage', {data : properties, uuid : id, Userdata, clubdata})
        }
        else {
            res.render('mypage/mypage', {data : properties, uuid : id, clubdata})
        }
    }
    catch(error) {
        console.log('error', error)
        res.render('main/main', {data : null})
    }
})

// router.get('/', (req, res) => {
//     res.render('main/main')
// })

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

router.get('/Edituser', (req, res) => {
    res.render('mypage/edituser')
})

router.post('/Edituser', async (req, res) => {
    const {login_access_token} = req.cookies;
    const {id, properties} = jwt.verify(login_access_token, process.env.TOKEN)
    const {nickname, profile_image} = properties;
    console.log(req.body, 'asdfasdf')
    const { agevalue, gendervalue, locationvalue, contentvalue} = req.body;
    console.log(id, nickname, profile_image, agevalue, gendervalue, locationvalue, contentvalue)
    const data = await Createuser(id, nickname, profile_image, agevalue, gendervalue, contentvalue, locationvalue );
    console.log(data, 'router')
    res.json({state : 200 , message : '관심분야 수정 완료'})
    
})

router.get('/Userintrest', (req, res) => {
    res.render('mypage/userintrest')
})

router.post('/Userintrest', async (req, res) => {
    const {login_access_token} = req.cookies;
    const {id} = jwt.verify(login_access_token, process.env.TOKEN)
    console.log(id)
    const {userdata} = req.body;
    console.log(userdata, 'asdf')
    const [finddata] = await Finduserintrest(id)
    try {
        if(finddata) {
            console.log( 'finduser')
            await Deleteuserintrest(id)
            for (let i = 0; i < userdata.length; i++) {
                const data = await Updatecategory(id, userdata[i])
                // console.log(data)
                console.log('if')
                
            }
        }
        else {     
            for (let i = 0; i < userdata.length; i++) {
                const data = await Updatecategory(id, userdata[i])
                console.log(data, 'for')
            }
        }
        res.json({state : 200, message : '추가 완료'})
    } catch (error) {
        res.json({state : 200, message : error})
    }
})
// seedCategories();
module.exports = router