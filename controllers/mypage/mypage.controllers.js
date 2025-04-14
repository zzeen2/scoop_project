
const {Categorys, Users, Userintrests, sequelize, Clubs, Points, Reviews, Hearts} = require('../../models/configs');
// const Userintrest = require('../models/users/userintrests');


const Createuser = async ( kakao_id1, kakao_name1, kakao_profile_image1, age1, gender1, introduction1, location) => {
    try {
        const data = await Users.findOne({where : {kakao_id : kakao_id1}})
        if (data) {
            // console.log(data, 'asdf')
            await Users.update({age : age1, gender : gender1, introduction : introduction1, location : location}, {where : {kakao_id : kakao_id1}})
            console.log('done')
            return ({state : 200, message : '수정 완료료 1'})
        } else {
            console.log('hhhhhhhhhhh')            
            const data = await Users.create({uid : kakao_id1, kakao_id : kakao_id1, kakao_name : kakao_name1, kakao_profile_image : kakao_profile_image1, age : age1, gender : gender1, introduction : introduction1, location : location})
            
            return ({state : 200, message : '수정 완료료'})
        }
    } catch (error) {
        console.log(error)
        return ({state : 400, message : error})
    }
}
const Finduser = async (uid) => {
    const [data] = await Users.findAll({where : {kakao_id : uid}})
    // console.log(data, 'finduser')
    return data;
}
const Finduserintrest = async (uid) => {
    const data = await Userintrests.findAll({where : {uid}})
    console.log(data, 'find')
    return data
}
const Deleteuserintrest = async (uid) => {
    const data = await Userintrests.destroy({where : {uid}})
    return ({state : 200, message : '삭제 완료료'})
}
const Updatecategory = async (id, content) => {
    console.log(id, content)
    try {
        await sequelize.query('ALTER TABLE userintrests AUTO_INCREMENT = 1')
        const data = await Userintrests.create({uid : id , keyword_category_name : content})
        console.log(data)
    } catch (error) {
        console.log(error)
    }
    return {state : 200, message : '획인'}
}
const categoryData = {
    "스포츠": ["구기스포츠", "수상스포츠", "실내 피트니스", "아웃도어 스포츠", "격투 스포츠", "동계 스포츠", "기타 스포츠"],
    "독서": ["책/독서", "글쓰기"],
    "사교/인맥": ["파티 맛집", "여성", "남성", "세대"],
    "여행/아웃도어": ["캠핑", "국내여행", "해외여행", "낚시", "등산", "트래킹/산책"],
    "음악": ["악기연주", "보컬/노래", "작사/작곡", "장르", "합주/밴드"],
    "자기계발": ["시험/자격증", "스터디", "스피치", "기타"],
    "문화/공연/축제": ["뮤지컬", "오케스트라", "연극", "전시회", "페스티벌", "오페라", "문화재 탐방"],
    "공예": ["시각 예술", "입체 공예", "디자인/페이퍼", "공연 공예"],
    "언어": ["영어", "일본어", "중국어", "프랑스어", "스페인어", "러시아어", "독일어"],
    "댄스": ["방송/힙합", "발레", "재즈댄스", "밸리댄스", "현대무용"],
    "봉사": ["양로원", "보육원", "환경봉사", "사회봉사", "재능나눔", "유기동물보호"],
    "사진/영상": ["영상제작", "필름카메라", "디지털카메라", "DSLR"],
    "요리/제조": ["한식", "양식", "중식", "일식", "제과/제빵", "커피", "와인", "칵테일"],
    "자동차": ["바이크", "드라이브"],
    "반려동물": ["강아지", "고양이", "물고기", "파충류"],
    "투자/금융": ["주식투자", "부동산투자", "금융상품"],
    "창업/사업": ["스타트업", "프렌차이즈", "네트워킹"]
};
const seedCategories = async () => {
    try {
        await Categorys.sync(); 

        for (const [main, subs] of Object.entries(categoryData)) {
            // 1. 대표 카테고리 추가
            const mainCategory = await Categorys.create({
                name: main,
                depth: 1
            });

            // 2. 세부 카테고리 추가
            for (const sub of subs) {
                await Categorys.create({
                    name: sub,
                    depth: 2,
                    categorys_id_fk: mainCategory.id 
                });
            }
        }

        console.log("샘플 카테고리 삽입 완료");
        process.exit();
    } catch (err) {
        console.error("카테고리 삽입 중 오류", err);
        process.exit(1);
    }
};
const clubs = [
    {
      club_id: 'club001',
      name: 'Book Club',
      introduction: 'A club for book lovers to share and discuss literature.',
      image: 'https://example.com/images/book.jpg',
      creator_id: 'user001',
      member_limit: 50,
      club_category_name: 'Literature',
      allow_guest: 'yes',
      view_count: 15
    },
    {
      club_id: 'club002',
      name: 'Fitness Freaks',
      introduction: 'Stay fit, stay healthy. Join our workout sessions!',
      image: 'https://example.com/images/fitness.jpg',
      creator_id: 'user002',
      member_limit: 100,
      club_category_name: 'Health',
      allow_guest: 'no',
      view_count: 45
    },
    {
      club_id: 'club003',
      name: 'Movie Nights',
      introduction: 'Weekly movie marathons and discussions.',
      image: 'https://example.com/images/movie.jpg',
      creator_id: 'user003',
      member_limit: 30,
      club_category_name: 'Entertainment',
      allow_guest: 'yes',
      view_count: 67
    },
    {
      club_id: 'club004',
      name: 'Gamers Unite',
      introduction: 'Multiplayer game events and tournaments.',
      image: 'https://example.com/images/gaming.jpg',
      creator_id: 'user004',
      member_limit: 70,
      club_category_name: 'Gaming',
      allow_guest: 'no',
      view_count: 88
    },
    {
      club_id: 'club005',
      name: 'Art Lovers',
      introduction: 'For those who appreciate and create art.',
      image: 'https://example.com/images/art.jpg',
      creator_id: 'user005',
      member_limit: 40,
      club_category_name: 'Art',
      allow_guest: 'yes',
      view_count: 20
    },
    {
      club_id: 'club006',
      name: 'Tech Talk',
      introduction: 'Discuss the latest in technology and innovation.',
      image: 'https://example.com/images/tech.jpg',
      creator_id: 'user006',
      member_limit: 60,
      club_category_name: 'Technology',
      allow_guest: 'yes',
      view_count: 105
    },
    {
      club_id: 'club007',
      name: 'Cooking Masters',
      introduction: 'Share and learn delicious recipes together.',
      image: 'https://example.com/images/cooking.jpg',
      creator_id: 'user007',
      member_limit: 25,
      club_category_name: 'Food',
      allow_guest: 'yes',
      view_count: 33
    },
    {
      club_id: 'club008',
      name: 'Photography Club',
      introduction: 'Capture the world one click at a time.',
      image: 'https://example.com/images/photo.jpg',
      creator_id: 'user008',
      member_limit: 45,
      club_category_name: 'Photography',
      allow_guest: 'no',
      view_count: 59
    },
    {
      club_id: 'club009',
      name: 'Travel Buddies',
      introduction: 'Plan trips and share travel stories.',
      image: 'https://example.com/images/travel.jpg',
      creator_id: 'user009',
      member_limit: 35,
      club_category_name: 'Travel',
      allow_guest: 'yes',
      view_count: 76
    },
    {
      club_id: 'club010',
      name: 'Startup Circle',
      introduction: 'Network with entrepreneurs and innovators.',
      image: 'https://example.com/images/startup.jpg',
      creator_id: 'user010',
      member_limit: 80,
      club_category_name: 'Business',
      allow_guest: 'no',
      view_count: 91
    }
  ];
const clubdata = async () => {
    await Clubs.create( 
      
    
    

      {
        club_id: 'club005',
        name: 'Art Lovers',
        introduction: 'For those who appreciate and create art.',
        image: 'https://example.com/images/art.jpg',
        creator_id: '4202096295',
        member_limit: 40,
        club_category_name: 'Art',
        allow_guest: 'yes',
        view_count: 20
      },
      {
        club_id: 'club006',
        name: 'Tech Talk',
        introduction: 'Discuss the latest in technology and innovation.',
        image: 'https://example.com/images/tech.jpg',
        creator_id: '4202096295',
        member_limit: 60,
        club_category_name: 'Technology',
        allow_guest: 'yes',
        view_count: 105
      },
      {
        club_id: 'club007',
        name: 'Cooking Masters',
        introduction: 'Share and learn delicious recipes together.',
        image: 'https://example.com/images/cooking.jpg',
        creator_id: 'user007',
        member_limit: 25,
        club_category_name: 'Food',
        allow_guest: 'yes',
        view_count: 33
      },
      {
        club_id: 'club008',
        name: 'Photography Club',
        introduction: 'Capture the world one click at a time.',
        image: 'https://example.com/images/photo.jpg',
        creator_id: 'user008',
        member_limit: 45,
        club_category_name: 'Photography',
        allow_guest: 'no',
        view_count: 59
      },  
      {
        club_id: 'club009',
        name: 'Travel Buddies',
        introduction: 'Plan trips and share travel stories.',
        image: 'https://example.com/images/travel.jpg',
        creator_id: 'user009',
        member_limit: 35,
        club_category_name: 'Travel',
        allow_guest: 'yes',
        view_count: 76
      },
      {
        club_id: 'club010',
        name: 'Startup Circle',
        introduction: 'Network with entrepreneurs and innovators.',
        image: 'https://example.com/images/startup.jpg',
        creator_id: 'user010',
        member_limit: 80,
        club_category_name: 'Business',
        allow_guest: 'no',
        view_count: 91
      })
}
// clubdata();
// seedCategories();

const Findclub = async (id) => {
    try {
        const Club = await Clubs.findAll({
            where : {
                creator_id: id
            }
        });
        // [Club {asd{asd}}, ]
        const arrayClub = Club.map(el => el.dataValues);
        // console.log(Club.dataValues,arrayClub[0], 'asdfasdfasdf')
        return arrayClub;
    } catch (error) {
        console.log("세부카테고리 불러오기 오류 : ", error);
        return({state : 400, message : "세부카테고리 불러오기 오류"})
    }
}
const Findclub_id = async (clubid) => {
    try {
        const Club = await Clubs.findAll({
            where : {
                club_id : clubid
            }
        });
        // [Club {asd{asd}}, ]
        const arrayClub = Club.map(el => el.dataValues);
        // console.log(Club.dataValues,arrayClub[0], 'asdfasdfasdf')
        return arrayClub;
    } catch (error) {
        console.log("세부카테고리 불러오기 오류 : ", error);
        return({state : 400, message : "세부카테고리 불러오기 오류"})
    }
}

const Checkpoint = async (uid) => {
  const Point = await Points.findAll({where : {user_id_fk : uid}})
  const arrayPoint = Point.map(el => el.dataValues);
  return arrayPoint
}

const Findactivity = async (id) => {
  const Review = await Reviews.findAll({where : {user_id_fk : id}})
  const arrayReview = Review.map(el => el.dataValues.club_id_fk)
  return arrayReview
}

const Findlike = async (id) => {
  const Heart = await Hearts.findAll({where : {user_id_fk : id}})
  const arrayHearts = Heart.map(el => el.dataValues.club_id_fk)
  return arrayHearts
}

const Userinput = []
const Reviewsinput = [{
  id : 'hello3',
  content : 'asdfasd',
  affiliation : 'fffasd',
  user_id_fk : '4202096295',
  club_id_fk : '2'
},{
  id : 'hello5',
  content : 'asdfasd',
  affiliation : 'fffasd',
  user_id_fk : '4202096295',
  club_id_fk : '2'
}]
const Heartsinput = [{  
    user_id_fk : '4202096295',
    club_id_fk : '2',
}]

const insertdata = async () => {
  // for (let i = 0; i < Userinput.length; i++) {
  //   await Reviews.create(Userinput[i])
  // }
  // for (let i = 0; i < Reviewsinput.length; i++) {
  //   await Users.create(Userinput[i])
  // }
  for (let i = 0; i < Heartsinput.length; i++) {
    await Hearts.create(Heartsinput[i])    
  }
}

// insertdata();

module.exports = {Findclub_id, Findlike, Findactivity, Checkpoint, Createuser, Finduser, Updatecategory, Finduserintrest, Deleteuserintrest, Findclub}