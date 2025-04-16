const router = require('express').Router();
const axios = require('axios');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const { checkUserPoint } = require('../../controllers/club/add_club.controllers');
const { createEvent } = require('../../controllers/event/event.controller');

// 이벤트페이지 렌더링
router.get('/:clubId/events', async (req, res) => {
    // http://localhost:3000/clubs/detail/1/events
    try {
        const { login_access_token } = req.cookies;
        const { properties } = jwt.verify(login_access_token, process.env.TOKEN);
        const { clubId } = req.params;

        if (properties) {
            res.render('events/events', {
                data: properties,
                clubId: clubId
            });
        } else {
            res.json({ state: 400, message: "이벤트 추가 페이지 렌더링 실패" });
        }
    } catch (error) {
        console.log('error', error);
        res.render('main/main', { data: null });
    }
});

router.post("/:clubId/events", checkUserPoint, createEvent )


module.exports = router