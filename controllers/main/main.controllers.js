const { Clubs, Members, Hearts, Reviews, sequelize: Sequelize } = require('../../models/configs');
const { Op } = require("sequelize");
const fs = require('fs');
const path = require('path');

const USERORDER = "member";
const REVIEWORDER = "review";
const LIKEORDER = "like"; 
const STARORDER = "star";

const FilteringSort = async (index, local_station) => {
    switch (index) {
        case USERORDER: {
            try {
                if(local_station) {
                    const data = await Clubs.findAll({
                        attributes: [
                            'club_id',
                            'name',
                            'introduction',
                            'image',
                            "view_count",
                            [Sequelize.fn('COUNT', Sequelize.col('Members.member_uid')), 'MemberCount']
                        ],
                        where : {local_station},
                        include: [{
                            model: Members,
                            attributes: []
                        }],
                        group: ['club_id'],
                        order: [[Sequelize.literal('MemberCount'), 'DESC']]
                    });
                    return { state: 200, message: "회원순 정렬 성공", data };
                }else { 
                    const data = await Clubs.findAll({
                        attributes: [
                            'club_id',
                            'name',
                            'introduction',
                            'image',
                            "view_count",
                            [Sequelize.fn('COUNT', Sequelize.col('Members.member_uid')), 'MemberCount']
                        ],
                        include: [{
                            model: Members,
                            attributes: []
                        }],
                        group: ['club_id'],
                        order: [[Sequelize.literal('MemberCount'), 'DESC']]
                    });
                    return { state: 200, message: "회원순 정렬 성공", data };
                }
            } catch (error) {
                return { state: 404, message: "회원순 정렬 실패", error };
            }
        }
        case REVIEWORDER: {
            try {
                if(local_station){
                    const data = await Clubs.findAll({
                        attributes: [
                            'club_id',
                            'name',
                            'introduction',
                            'image',
                            'view_count'
                        ],
                        where : {local_station},
                        order: [["view_count", 'DESC']]
                    });
                    return { state: 200, message: "조회순 정렬 성공", data };
                }else {
                    const data = await Clubs.findAll({
                        attributes: [
                            'club_id',
                            'name',
                            'introduction',
                            'image',
                            'view_count'
                        ],
                        order: [["view_count", 'DESC']]
                    });
                    return { state: 200, message: "조회순 정렬 성공", data };
                }
            } catch (error) {
                return { state: 404, message: "조회순 정렬 실패", error };
            }
        }
        case STARORDER: {
            try {
                if(local_station){
                    const data = await Clubs.findAll({
                        attributes: [
                            'club_id',
                            'name',
                            'introduction',
                            'image',
                            "view_count",
                            [Sequelize.fn('AVG', Sequelize.col('Reviews.star')), 'ReviewScore'],
                            [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'ReviewCount']
                        ],
                        where : {local_station},
                        include: [{
                            model: Reviews,
                            attributes: []
                        }],
                        group: ['club_id'],
                        order: [[Sequelize.literal('ReviewScore'), 'DESC']]
                    });
                    return { state: 200, message: "평점순 정렬 성공", data };
                } else {
                    const data = await Clubs.findAll({
                        attributes: [
                            'club_id',
                            'name',
                            'introduction',
                            'image',
                            "view_count",
                            [Sequelize.fn('AVG', Sequelize.col('Reviews.star')), 'ReviewScore'],
                            [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'ReviewCount']
                        ],
                        include: [{
                            model: Reviews,
                            attributes: []
                        }],
                        group: ['club_id'],
                        order: [[Sequelize.literal('ReviewScore'), 'DESC']]
                    });
                    return { state: 200, message: "평점순 정렬 성공", data };
                }
            } catch (error) {
                return { state: 404, message: "평점순 정렬 실패", error };
            }
        }

        case LIKEORDER: {
            try {
                if(local_station){
                    const data = await Clubs.findAll({
                        attributes: [
                            'club_id',
                            'name',
                            'introduction',
                            'image',
                            "view_count",
                            [Sequelize.fn('COUNT', Sequelize.col('Hearts.like_id')), 'HeartCount']
                        ],
                        where : {local_station},
                        include: [{
                            model: Hearts,
                            attributes: []
                        }],
                        group: ['club_id'],
                        order: [[Sequelize.literal('HeartCount'), 'DESC']]
                    });
                    return { state: 200, message: "좋아요순 정렬 성공", data };
                }else {
                    const data = await Clubs.findAll({
                        attributes: [
                            'club_id',
                            'name',
                            'introduction',
                            'image',
                            "view_count",
                            [Sequelize.fn('COUNT', Sequelize.col('Hearts.like_id')), 'HeartCount']
                        ],
                        include: [{
                            model: Hearts,
                            attributes: []
                        }],
                        group: ['club_id'],
                        order: [[Sequelize.literal('HeartCount'), 'DESC']]
                    });
                    return { state: 200, message: "좋아요순 정렬 성공", data};
                }
            } catch (error) {
                return { state: 404, message: "좋아요순 정렬 실패", error };
            }
        }
        default:
            return { state: 400, message: "잘못된 정렬 기준입니다", data: [] };
    }
};

const SubwayFilter = async (index, local_station) => {
    try {
        const data = await FilteringSort(index, local_station);
        
        return data;
    } catch (error) {
        return { state : 405, message : "지하철 좌표 필터링 실패!", error}
    }
}

const subwayAllFilter = async () => {
    try {
        const filePath  = path.join(__dirname, "../../json/Station.json");
        const subwayData = fs.readFileSync(filePath, 'utf-8');
        const stationJson = JSON.parse(subwayData)["DATA"];
        const data = await Clubs.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('local_station')), 'local_station']
            ]
        });
        const club = await Clubs.findAll({
            attributes: [
                "local_station",
                "image",
                [Sequelize.fn('COUNT', Sequelize.col('Members.member_uid')), 'MemberCount']
            ],
            include: [{
                model: Members,
                attributes: []
            }],
            group: ["club_id"],
        });
        const subways = data.map(el => el.dataValues.local_station)
        const result = stationJson.filter(el =>{
                for (let i = 0; i < subways.length; i++) {
                    if(el.bldn_nm === "서울역"){
                        if(el.bldn_nm === subways[i]){
                                
                                
                            subways.splice(i,1)
                            return true;
                        }
                    }else {
                        if(el.bldn_nm === subways[i]){
                            subways.splice(i,1)
                            club.forEach(item => {
                                if(item.dataValues.local_station === el.bldn_nm)
                                    if(el.image){
                                        el.MembersCount = el.MembersCount + item.dataValues.MemberCount;
                                        el.image.push(item.dataValues.image)
                                    }else {
                                        el.MembersCount = 0;
                                        el.image = []
                                        el.image.push(item.dataValues.image)
                                        el.MembersCount =+ item.dataValues.MemberCount;
                                    };
                             })
                            return true;
                        }
                    }
                }
                return false
            }
        )
        return result;
    } catch (error) {
        return error
    }
}

const AreaAllFilter = async () => {
    try {
        const areaPath = path.join(__dirname, "../../json/Area.json");
        const areaData = fs.readFileSync(areaPath, 'utf-8');
        const areaJson = JSON.parse(areaData)["features"];
        const data = await Clubs.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('wide_regions')), 'wide_regions']
            ]
        });
        const areaList = data.map(el => el.dataValues.wide_regions)
        const result = areaJson.filter(el => {

            for (let i = 0; i < areaList.length; i++) {
                if(areaList[i] === "") continue; 
                const cleaned = areaList[i].replace(/[\[\]"]/g, "").replace(/,/g, ",").split(",").map(el => el.trim().split(" "));
                const temp = cleaned.map(el => el[1]);
                if (temp.includes(el.properties.SIG_KOR_NM)) {
                    return true
                }
            }
            return false;
        });
        
        return result;
    } catch (error) {
        
    }
}

const AreaFilter = async (wide_regions) => {
    try {
        const data = await Clubs.findAll({
            where: {
                wide_regions: {
                    [Op.like]: `%${wide_regions}%`
                }
            }
        });
        return data
    } catch (error) {
        return { state: 406, message: "시/군구 동호회 필터링 실패", error };
    }
};

module.exports = { FilteringSort , SubwayFilter, subwayAllFilter, AreaAllFilter, AreaFilter};
