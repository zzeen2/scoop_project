// 메인페이지 오른쪽 영역 필터링 기능
const { Clubs, Members, Hearts, Reviews, sequelize: Sequelize } = require('../../models/configs');
const { Op } = require("sequelize");
const fs = require('fs');
const path = require('path');

const USERORDER = "member";
const REVIEWORDER = "review";
const LIKEORDER = "like";
const STARORDER = "star";



// FilteringSort - 필터링 조회 함수
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
                            [Sequelize.fn('COUNT', Sequelize.col('Reviews.star')), 'ReviewCount']
                        ],
                        where : {local_station},
                        include: [{
                            model: Reviews,
                            attributes: []
                        }],
                        group: ['club_id'],
                        order: [[Sequelize.literal('ReviewCount'), 'DESC']]
                    });
                    return { state: 200, message: "조회순순 정렬 성공", data };
                }else {
                    const data = await Clubs.findAll({
                        attributes: [
                            'club_id',
                            'name',
                            'introduction',
                            'image',
                            "view_count",
                            [Sequelize.fn('COUNT', Sequelize.col('Reviews.star')), 'ReviewCount']
                        ],
                        include: [{
                            model: Reviews,
                            attributes: []
                        }],
                        group: ['club_id'],
                        order: [[Sequelize.literal('ReviewCount'), 'DESC']]
                    });
                    return { state: 200, message: "평점순 정렬 성공", data };
                }
            } catch (error) {
                return { state: 404, message: "평점순순 정렬 실패", error };
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



// json 데이터를 가져와서 파싱한 후 필터링한 데이터를  클라이언트에게 응답을 보낸다


// 지역단위(지하철역) 필터링 하는 함수
const SubwayFilter = async (index, local_station) => {
    try {
        // 해당 지하철역을 필터링 하는 것
        // 동호회들 정보를 담아서 변수에 저장해서 필터링 하는것
        const data = await FilteringSort(index, local_station);
        console.log(data)
        return data;
    } catch (error) {
        return { state : 405, message : "지하철 좌표 필터링 실패!", error}
    }
}
// SubwayFilter("member", "서면역")

// 동호회가 있는 역 정보 보여주는 함수
const subwayAllFilter = async () => {
    try {
        // json 데이터 가져오기 path 사용
        const filePath  = path.join(__dirname, "../../json/Station.json");
        // fs 모듈로 파일을 읽어와서 인코딩
        const subwayData = fs.readFileSync(filePath, 'utf-8');
        const stationJson = JSON.parse(subwayData)["DATA"];
        // 동호회의 역을 다 가지고오고
        // 역이름 배열을 가지고 오고
        // 객체를 필터링해서 
        const data = await Clubs.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('local_station')), 'local_station']
            ]
        });
        const subways = data.map(el => el.dataValues.local_station)
        const result = stationJson.filter(el =>{
                for (let i = 0; i < subways.length; i++) {
                    if(el.bldn_nm === "서울역"){
                        if(el.bldn_nm === subways[i]){
                                console.log(el.bldn_nm)
                                console.log(subways[i])
                            subways.splice(i,1)
                            return true;
                        }
                    }else {
                        if(el.bldn_nm === subways[i]){
                            console.log(el.bldn_nm)
                            console.log(subways[i])
                            subways.splice(i,1)
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


// 시/군구 필터링 하는 함수
const AreaAllFilter = async () => {
    try {
        // 시/군구 JSON 데이터 가져와기
        const areaPath = path.join(__dirname, "../../json/Area.json");
        // fs 모듈로 파일 읽어옴
        const areaData = fs.readFileSync(areaPath, 'utf-8');
        const areaJson = JSON.parse(areaData)["features"];
        // console.log("ㅇㅇㅇ",areaJson)
        const data = await Clubs.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('wide_regions')), 'wide_regions']
            ]
        });
        const areaList = data.map(el => el.dataValues.wide_regions)
        
        // JSON에서 해당 DB wide_regions와 일치하는 Feature만 필터링 
        const result = areaJson.filter(el => {

            for (let i = 0; i < areaList.length; i++) {
                if(areaList[i] === "") continue; 
                const cleaned = areaList[i].replace(/[\[\]"]/g, "").replace(/,/g, ",").split(",").map(el => el.trim().split(" "));
                // [["경기", "남양주시"], ["서울","강남구"]]
                // console.log(cleaned, cleaned.includes(`'"${el.properties.SIG_KOR_NM}"'`), el.properties.SIG_KOR_NM);
                // console.log(el.properties.SIG_KOR_NM, cleaned.includes(el.properties.SIG_KOR_NM), cleaned);
                const temp = cleaned.map(el => el[1]);
                // ["남양주시", "강남구"]
                if (temp.includes(el.properties.SIG_KOR_NM)) {
                    // console.log(el.properties.SIG_KOR_NM);
                    // areaList.splice(i,1) // 중복 방지
                    return true
                }
            }
            return false;
        });
        console.log("필터링된 시/군구 수 ", result);
        return result;
    } catch (error) {
        console.log(error)   
    }
}
// AreaAllFilter();

// 동호회가 등록된 광역단위(시/군구) 필터링 하는 ㅎ마수
const AreaFilter = async (wide_regions) => {
    try {
        const data = await Clubs.findAll({
            where: {
                wide_regions: {
                    [Op.like]: `%${wide_regions}%`
                }
            }
        });
        // console.log("아니", data);
        return data
    } catch (error) {
        return { state: 406, message: "시/군구 동호회 필터링 실패", error };
    }
};
// AreaFilter("성남시 수정구")
module.exports = { FilteringSort , SubwayFilter, subwayAllFilter, AreaAllFilter, AreaFilter};
