require('dotenv').config()
const express = require('express')
const path = require('path');
const app = express();
const cookie = require("cookie-parser")
const categoryRouter = require('./routers/categories/all_category.routers');
const manageClubRouter = require('./routers/club/manage_club.routers');
const createRouter = require('./routers/club/add_club.routers')
const mypageRouter = require('./routers/mypage/mypage.routers')


app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use('/public', express.static(path.join(__dirname, "public")))
app.use(cookie());

app.use('/categories', categoryRouter);
app.use('/clubs/create', createRouter)
app.use('/clubs', manageClubRouter);

app.use('/', mypageRouter)



// app.get('/' , (req, res) => {
//     res.render('main/main')
// })

app.listen(3000,() => {
    console.log("서버 작동중...")
})
