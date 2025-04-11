// require('./models/configs');
const express = require('express')
const path = require('path');
const app = express();
const categoryRouter = require('./routers/categories/all_category.routers');
const manageClubRouter = require('./routers/club/manage_club.routers');
const {mypageRouter, mainRouter} = require('./routers')
const cookieParser = require('cookie-parser')

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended : false}))
app.use('/public', express.static(path.join(__dirname, "public")))
app.use(cookieParser())

app.use('/categories', categoryRouter);
app.use('/clubs', manageClubRouter);



app.use(mainRouter)



app.listen(3000,() => {
    console.log("서버 작동중...")
})
