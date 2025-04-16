const router = require('express').Router();
const jwt = require('jsonwebtoken');
const {FilteringSort} = require('../../controllers/main/main.controllers')
const {Createuser, Createpoint} = require('../../controllers/mypage/mypage.controllers')


router.get('/', async (req, res) => {
    try{
        const {login_access_token} = req.cookies;
        console.log('main/', login_access_token)
        const {id, properties} = jwt.verify(login_access_token, process.env.TOKEN)
        await Createuser(id, properties.nickname, properties.profile_image)
        if(login_access_token) {
            await Createpoint(id)
        }
        console.log('done')
        res.render('main/main', {data : properties})
    }
    catch(error) {
        console.log('error')
        res.render('main/main', {data : null})
    }
})


router.get('/filter', async (req, res) => { 
  console.log("쿼리쿼리쿼리", req.query)
  const {index} = req.query;
  console.log("필터링 인덱스", index);
   const data = await FilteringSort(index);
   console.log(data);
   res.json(data);
})



module.exports = router;