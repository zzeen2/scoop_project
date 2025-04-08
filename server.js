require('dotenv').config();
const express = require('express')
const path = require('path');
const app = express();


const {mypageRouter} = require('./routers')




app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use('/public', express.static(path.join(__dirname, "public")))



app.use(mypageRouter);




app.listen(3000,() => {
    console.log("서버 작동중...")
})


