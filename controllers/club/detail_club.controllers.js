const jwt = require('jsonwebtoken');
const {
  Clubs, Categorys, Tags, Locations,
  Reviews, Users, Events, Verifications,
  Members, Hearts
} = require('../../models/configs');

// -- 상세페이지 렌더링을 위한 미들웨어
const clubDetail = async (req,res) => {
    const clubId = req.params.clubId;
    const token = req.cookies.login_access_token; 
    try {
        const club = await Clubs.findOne({
            where : {club_id : clubId},
            include : [
                {model : Categorys},
                {model : Tags},
                {model : Locations},
                {model : Reviews, include : {model :Users}}, // 동호회 리뷰 작성자 정보까지 같이 가져오기
                {model : Events, include : {model :Verifications}},
                {model : Members},
            ]
        })
        if (!club) return res.json ({state : 400, message : "동호회가 존재하지 않습니다."})
        
        // 찜버튼 상태
        let liked = false;
        if (token) {
            const { id: userId } = jwt.verify(token, process.env.TOKEN);
            const heart = await Hearts.findOne({ where: { club_id_fk: clubId, user_id_fk: userId } });
            liked = !!heart;
        }

        res.render("club/detail_club", {club, liked});
    } catch (error) {
        console.log("상세페이지 오류", error);
        res.json({state:401, message : "clubDetail, 상세페이지 서버 오류"})
    }
} 

// --  찜버튼 동작을 위한 미들웨어
const heart = async (req,res) => {
    const token = req.cookies.login_access_token;
    if(!token) return res.json ({state : 402, message : "로그인이 필요합니다."})

    const {id : userId } = jwt.verify(token, process.env.TOKEN);
    const {clubId } = req.params;
    try {
        const likeExisting = await Hearts.findOne({
            where: { club_id_fk: clubId, user_id_fk: userId }
        });

        if (likeExisting) {
            await Hearts.destroy({ where: { club_id_fk: clubId, user_id_fk: userId } });
            return res.json({ liked: false });
        } else {
            await Hearts.create({ club_id_fk: clubId, user_id_fk: userId });
            return res.json({ liked: true });
        }
        } catch (error) {
        console.error("찜하기 오류:", error);
        return res.json({ state: 500, message: "찜하기 서버 오류" });
    }
}

module.exports = {clubDetail, heart }