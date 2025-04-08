const express = require('express')
const path = require('path');
const app = express();


app.set('view engine', 'ejs');

app.use(express.urlencoded({extended : false}))
app.use('/public', express.static(path.join(__dirname, "public")))

app.get('/' , (req, res) => {
    res.render('main/main')
})

// 지은 - 테스트 라우터
app.get("/club", (req,res)=> {
    res.render("club/add_club")
})
app.get("/detail", (req,res)=> {
    res.render("club/detail_club")
})

app.listen(3000,() => {
    console.log("서버 작동중...")
})