
const {Categorys, Users, Userintrests, sequelize, Clubs, Points, Reviews, Hearts, Participants} = require('../../models/configs');


const Createuser = async ( id, name, image, user_age, user_gender, user_introduction, location) => {
    try {
        const data = await Users.findOne({where : {kakao_id : id}})
        if (data) {
            await Users.update({age : user_age, gender : user_gender, introduction : user_introduction, location : location}, {where : {kakao_id : id}})
            return ({state : 200, message : '수정 완료료 1'})
        } else {
            const data = await Users.create({uid : id, kakao_id : id, kakao_name : name, kakao_profile_image : image})
            return ({state : 200, message : '수정 완료료'})
        }
    } catch (error) {
        console.log(error)
        return ({state : 400, message : error})
    }
}
const Finduser = async (uid) => {
    const [data] = await Users.findAll({where : {kakao_id : uid}})
    return data;
}
const Finduserintrest = async (uid) => {
    const data = await Userintrests.findAll({where : {uid}})
    return data
}
const Deleteuserintrest = async (uid) => {
    const data = await Userintrests.destroy({where : {uid}})
    return ({state : 200, message : '삭제 완료료'})
}
const Updatecategory = async (id, content) => {
    try {
        await sequelize.query('ALTER TABLE userintrests AUTO_INCREMENT = 1')
        const data = await Userintrests.create({uid : id , keyword_category_name : content})
    } catch (error) {
        console.log(error)
    }
    return {state : 200, message : '획인'}
}


const Findclub = async (id) => {
    try {
        const Club = await Clubs.findAll({
            where : {
                creator_id: id
            }
        });
        const arrayClub = Club.map(el => el.dataValues);
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
        const arrayClub = Club.map(el => el.dataValues);
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

const Getparticipantdate = async (id) => {
  const Participant = await Participants.findAll({where : {user_id_fk : id}})
  const arraydate = Participant.map(el => el.dataValues)
  return arraydate
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

const Createpoint = async (id) => {
  try {
    await Points.create({user_id_fk : id})
    console.log('point created')
  } catch (error) {
    console.log('point exits')
  }
}

// insertdata();
// Participants.create({
//   participant_id : 'asdf5',
//   user_id_fk : '4202096295'

// })

module.exports = {Createpoint,Getparticipantdate, Findclub_id, Findlike, Findactivity, Checkpoint, Createuser, Finduser, Updatecategory, Finduserintrest, Deleteuserintrest, Findclub}