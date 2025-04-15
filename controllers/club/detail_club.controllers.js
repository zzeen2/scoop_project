const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const {
  Clubs, Categorys, Tags, Locations,
  Reviews, Users, Events, Verifications,
  Members, Hearts, Participants, Points
} = require('../../models/configs');

// -- 토큰에서 유저 ID 추출 함수
const getUserIdFromToken = (req) => {
    const token = req.cookies.login_access_token;
    if (!token) return null;

    try {
    const decoded = jwt.verify(token, process.env.TOKEN);
    return decoded.id;
    } catch (e) {
    return null;
    }
};

// -- 회원 여부 확인 함수
const isClubMember = async (userId, clubId) => {
    const result = await Members.findOne({
    where: {
        user_id_fk: userId,
        club_id_fk: clubId
    }
    });
    return !!result; 
};

// -- 상세 페이지 렌더링
const clubDetail = async (req, res) => {
    const clubId = req.params.clubId;
    const userId = getUserIdFromToken(req);
    const {login_access_token} = req.cookies;
    const {id, properties} = await jwt.verify(login_access_token, process.env.TOKEN)

    try {
    const club = await Clubs.findOne({
        where: { club_id: clubId },
        include: [
        { model: Categorys, as: "Category", include: [{ model: Categorys, as: "Parent" }] },
        { model: Tags },
        { model: Locations },
        { model: Reviews, include: { model: Users } },
        { model: Events, include: { model: Verifications } },
        { model: Members, include: [{ model: Users }] }
        ]
    });

    if (!club) {
        return res.json({ state: 400, message: "동호회가 존재하지 않습니다." });
    }

    // 상태별 참여자 정보 넣기
    if (club.Events && club.Events.length > 0) {
        for (const event of club.Events) {
        const participants = await Participants.findAll({
            where: { participants_id_fk: event.id },
            include: [{ model: Users }]
        });
    
        event.dataValues.attending = participants
            .filter(p => p.state === 'yes')
            .map(p => p.User?.kakao_name || '이름없음');
    
        event.dataValues.notAttending = participants
            .filter(p => p.state === 'no')
            .map(p => p.User?.kakao_name || '이름없음');
    
        event.dataValues.maybe = participants
            .filter(p => p.state === 'maybe')
            .map(p => p.User?.kakao_name || '이름없음');
        }
    }
    

    // 찜 상태
    let liked = false;
    if (userId) {
        const heart = await Hearts.findOne({
        where: { club_id_fk: clubId, user_id_fk: userId }
        });
        liked = !!heart;
    }

    // 회원 여부
    const isMember = userId ? await isClubMember(userId, clubId) : false;

    return res.render("club/detail_club", {
        club,
        liked,
        loginUserId: userId,
        isMember,
        data : properties
    });
    } catch (error) {
    console.error("상세페이지 오류", error);
    return res.json({ state: 401, message: "clubDetail, 상세페이지 서버 오류" });
    }
};

// -- 찜하기 버튼 동작
const heart = async (req, res) => {
    const token = req.cookies.login_access_token;
    if (!token) return res.json({ state: 402, message: "로그인이 필요합니다." });

    const { id: userId } = jwt.verify(token, process.env.TOKEN);
    const { clubId } = req.params;

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
};

// -- 참여자 등록
const participateInEvent = async (req, res) => {
    const { userId, clubId, state } = req.body;
    const { eventId } = req.params;

    try {
        const existing = await Participants.findOne({
        where: {
            participants_id_fk: eventId,
            user_id_fk: userId
        }
        });

        if (existing) {
        await existing.update({ state });
        console.log(`상태 업데이트: ${userId} > ${state}`);
        } else {
        await Participants.create({
            participant_id: userId,
            participants_id_fk: eventId,
            user_id_fk: userId,
            state
        });
        console.log(`새 참가자 등록: ${userId} > ${state}`);
        }

        return res.json({ success: true });
    } catch (err) {
        console.error('참여 등록 실패', err);
        return res.status(500).json({ success: false, message: '서버 에러' });
    }
};
//-- 리뷰등록
const postReview = async (req, res) => {
    const { clubId } = req.params;
    const { userId, rating, content, affiliation } = req.body;

    try {
    // 최근 리뷰 작성일 검사
    const lastReview = await Reviews.findOne({
        where: { user_id_fk: userId, club_id_fk: clubId },
        order: [['createdAt', 'DESC']]
    });

    if (lastReview) {
        const diffDays = Math.floor((new Date() - new Date(lastReview.createdAt)) / (1000 * 60 * 60 * 24));
        if (diffDays < 10) {
        return res.status(400).json({
            success: false,
            message: `최근에 리뷰를 작성하셨습니다. ${10 - diffDays}일 후에 다시 작성하실 수 있습니다.`
        });
        }
    }

    // 리뷰 등록
    await Reviews.create({
        id: uuidv4().slice(0, 20),
        content,
        star: rating,
        affiliation,
        user_id_fk: userId,
        club_id_fk: clubId
    });

    // 포인트
    const [point, created] = await Points.findOrCreate({
        where: { user_id_fk: userId },
        defaults: { point: 10 }
    });

    if (!created) {
        await point.increment('point', { by: 10 });
    }

    return res.json({ success: true });

    } catch (error) {
    console.error('리뷰 등록 실패:', error);
    return res.status(500).json({ success: false, message: '서버 오류' });
    }
};


module.exports = {
    clubDetail,
    heart,
    isClubMember,
    participateInEvent,
    getUserIdFromToken,
    postReview
};
