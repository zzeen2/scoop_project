const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Clubs, Tags } = require('../../models/configs');
const { updateClub } = require('../../controllers/club/manage_club.controllers');
const {upload} = require('../../lib/multer')

router.get('/:clubId/manage', async (req, res) => {
    try {
        const { login_access_token } = req.cookies;
        const { properties, id: userId } = jwt.verify(login_access_token, process.env.TOKEN);
        const { clubId } = req.params;

        const club = await Clubs.findOne({
        where: { club_id: clubId },
        include: [Tags]
        });

        if (!club) {
        return res.status(404).render('main/main', { data: properties });
        }

        res.render('club/manage_club', {
        data: properties,
        clubId,
        club,
    });
  } catch (error) {
    console.log("manage_club 렌더링 오류:", error);
    res.status(500).render('main/main', { data: null });
  }
});

router.post('/:clubId/manage', upload.single('image'), updateClub);

module.exports = router;
