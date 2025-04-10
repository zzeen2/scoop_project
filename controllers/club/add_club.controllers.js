const {Categorys, Clubs, Locations, Tags, Points} = require("../../models/configs")
const jwt = require("jsonwebtoken")

// 대표 카테고리 조회
const getMainCategories = async (req,res) => {
    try {
        const mainCategories = await Categorys.findAll({
            where: {depth: 1}
        });
        res.json(mainCategories)
    } catch (error) {
        console.error("대표카테고리 불러오기 오류 : ", err);
        res.json({state : 400, message : "대표카테고리 불러오기 오류"})
    }
}

// 세부카테고리 조회
const getSubCategories = async (req,res) => {
    const mainId = req.params.mainId;
    try {
        const SubCategories = await Categorys.findAll({
            where : {
                depth: 2,
                categorys_id_fk: mainId
            }
        });
        res.json(SubCategories);
    } catch (error) {
        console.log("세부카테고리 불러오기 오류 : ", err);
        res.json({state : 400, message : "세부카테고리 불러오기 오류"})
    }
}

// 데이터 추가하기
const createClub = async (req, res, userId) => {
    try {
        if (!req.body.activity_type) {
            return res.status(400).json({ message: "activity_type이 필요합니다" });
        }

        const {
            name,
            introduction,
            main_category_id,
            sub_category_name,
            member_limit,
            local_station
        } = req.body;

        const wide_regions = req.body.wide_regions ? JSON.parse(req.body.wide_regions) : [];
        const tags = req.body.tags ? JSON.parse(req.body.tags) : [];


        // 중복 방지
        const existing = await Clubs.findOne({ where: { name } });
        if (existing) {
            return res.status(400).json({ message: "이미 존재하는 동호회 이름입니다." });
        }

        const image = req.file ? `/uploads/clubs/${req.file.filename}` : "/public/default.png";

        // 동호회 생성
        const newClub = await Clubs.create({
            name,
            introduction,
            image,
            creator_id: userId,
            member_limit: parseInt(member_limit),
            club_category_name: sub_category_name,
            categorys_id_fk: parseInt(main_category_id),
            view_count: 0
        });

        // 위치 저장
        await Locations.create({
            club_id: newClub.club_id,
            point: local_station || "",
            poligon: wide_regions.length ? JSON.stringify(wide_regions) : ""
        });

        // 태그 저장
        for (const tagText of tags) {
            await Tags.create({
                club_id_fk: newClub.club_id,
                tag: tagText
            });
        }

        return res.status(200).json({ message: "동호회 생성 완료" });
    } catch (err) {
        //console.error("동호회 생성 중 에러:", err);
        res.status(500).json({ message: "서버 오류 발생" });
    }
};

// 접근제한 미들웨어
const checkUserPoint = async (req, res, next) => {
    try {
        const token = req.cookies.login_access_token;
        if(!token) return res.json({state : 400, message : "로그인이 필요합니다."})
        const decoded = jwt.verify(token, process.env.TOKEN);
        const userId = decoded.id;

        const searchUserPoint = await Points.findOne({where : { user_id_fk : userId }});
        console.log(searchUserPoint);
        const point = searchUserPoint?.point || 0;
        if (point < 300) res.json({state : 401, message : "동호회생성은 포인트 300점 이상부터 가능합니다."})
        next();
    } catch (error) {
        console.log("포인트 확인 오류", error);
        res.json({state : 403, message : "포인트 확인 중 서버 오류"})
    }
}


module.exports = {getMainCategories, getSubCategories , createClub, checkUserPoint}