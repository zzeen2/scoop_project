const mainRouter = require('./main/main.routers');
const mypageRouter = require('./mypage/mypage.router')
const createRouter = require('./club/add_club.routers')
const detailRouter = require('./club/detail_club.routers')
const eventsRouter = require('./events/events.router')






module.exports = {mypageRouter, mainRouter, createRouter, eventsRouter, detailRouter}
