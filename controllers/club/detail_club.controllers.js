const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const {
  Clubs, Categorys, Tags, Locations,
  Reviews, Users, Events, Verifications,
  Members, Hearts, Participants, Points
} = require('../../models/configs');
const { ValidationErrorItemOrigin } = require('sequelize');

const getUserIdFromToken = (req, res) => {
    const token = req.cookies.login_access_token;
    if (token === undefined ) {
      res.json({state : 401, message : "로그인이 필요합니다."});
    }
    try {
      const decoded = jwt.verify(token, process.env.TOKEN);
      return decoded.id;
    } catch (e) {
      return null;
    }
};

const isClubMember = async (userId, clubId) => {
    const result = await Members.findOne({
    where: {
        user_id_fk: userId,
        club_id_fk: clubId
    }
    });
    return !!result; 
};

const clubDetail = async (req, res) => {
    const clubId = req.params.clubId;
    let userId = null;
    let properties = null;
  
    try {
      const { login_access_token } = req.cookies;
      if (login_access_token) {
        const decoded = jwt.verify(login_access_token, process.env.TOKEN);
        userId = decoded.id;
        properties = decoded.properties;
      }
    } catch (err) {
    }
  
    try {
      await Clubs.increment('view_count', {
        by: 1,
        where: { club_id: clubId }
      });

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
      if (club.Events?.length > 0) {
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
  
      let liked = false;
      if (userId) {
        const heart = await Hearts.findOne({
          where: { club_id_fk: clubId, user_id_fk: userId }
        });
        liked = !!heart;
      }
  
      const isMember = userId ? await isClubMember(userId, clubId) : false;
  
      return res.render("club/detail_club", {
        club,
        liked,
        loginUserId: userId,
        isMember,
        data: properties 
      });
    } catch (error) {
      return res.status(500).json({ state: 401, message: "clubDetail, 상세페이지 서버 오류" });
    }
  };

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
    return res.json({ state: 500, message: "찜하기 서버 오류" });
    }
};

const participateInEvent = async (req, res) => {
  const { userId, clubId, state } = req.body;
  const { eventId } = req.params;
  try {
    if (!userId) {return res.status(400).json({state: 402, message: "로그인이 필요합니다."});}
    const existing = await Participants.findOne({
        where: {
            participants_id_fk: eventId,
            user_id_fk: userId
        }
    });

    if (existing) {
        await existing.update({ state });
    } else {
        await Participants.create({
            participant_id: uuidv4().slice(0, 20),
            participants_id_fk: eventId,
            user_id_fk: userId,
            state
        });
    }

    return res.json({ success: true });
  } catch (err) {
      return res.status(500).json({ success: false, message: '서버 에러' });
  }
};

const postReview = async (req, res) => {
    const { clubId } = req.params;
    const { userId, rating, content, affiliation } = req.body;

    try {
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

    await Reviews.create({
        id: uuidv4().slice(0, 20),
        content,
        star: rating,
        affiliation,
        user_id_fk: userId,
        club_id_fk: clubId
    });

    const [point, created] = await Points.findOrCreate({
        where: { user_id_fk: userId },
        defaults: { point: 10 }
    });

    if (!created) {
        await point.increment('point', { by: 10 });
    }

    return res.json({ success: true });

    } catch (error) {
    return res.status(500).json({ success: false, message: '서버 오류' });
    }
};

const addMember = async (req,res) => {
  const {clubId} = req.params;

  try {
    const token = req.cookies.login_access_token;
    if(!token) return res.json({state : 400, message : "로그인이 필요합니다."})
    
    const decoded = jwt.verify(token, process.env.TOKEN);
    const userId = decoded.id
    
    const existing = await Members.findOne({
      where : {
        user_id_fk : userId,
        club_id_fk : clubId
      }
    });

    if(existing) {
      return res.json({state : 401, message : "이미 존재하는 회원입니다"});
    }

    const today = newDate();
    const signupDate = today.toISOString().split("T")[0];

    await Members.create({
      member_uid: uuidv4().slice(0,20),
      signupDate:signupDate,
      user_id_fk:userId,
      club_id_fk: clubId
    });
    return res.json({ state : 200, message : "회원추가가 완료되었습니다."})
  } catch (error) {
    return res.json({state : 401, message : "가입실패"})
  }
}

module.exports = {
    clubDetail,
    heart,
    isClubMember,
    participateInEvent,
    getUserIdFromToken,
    postReview,
    addMember
};
