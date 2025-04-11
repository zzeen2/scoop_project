
const {Users, Userintrests, sequelize} = require('../../models/configs');
// const Userintrest = require('../models/users/userintrests');


const Createuser = async ( kakao_id1, kakao_name1, kakao_profile_image1, age1, gender1, introduction1, latitude1, longitude1) => {
    try {
        const data = await Users.findOne({where : {kakao_id : kakao_id1}})
        if (data) {
            // console.log(data, 'asdf')
            await Users.update({age : age1, gender : gender1, introduction : introduction1, latitude : latitude1, longitude : longitude1}, {where : {kakao_id : kakao_id1}})
            console.log('done')
            return ({state : 200, message : '수정 완료료 1'})
        } else {
            console.log('hhhhhhhhhhh')            
            const data = await Users.create({kakao_id : kakao_id1, kakao_name : kakao_name1, kakao_profile_image : kakao_profile_image1, age : age1, gender : gender1, introduction : introduction1, latitude : latitude1, longitude : longitude1})
            
            return ({state : 200, message : '수정 완료료'})
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

// Users.create({'a','a','a','a','a','a','a','a'})

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
    return ( 'delete')
}
const Updatecategory = async (id, content) => {
    console.log(id, content)
    try {
        await sequelize.query('ALTER TABLE userintrests AUTO_INCREMENT = 1')
        const data = await Userintrests.create({uid : id , category_name : content})
        console.log(data)
    } catch (error) {
        console.log(error)
    }
    return {state : 200, message : '획인'}
}


module.exports = {Createuser, Finduser, Updatecategory, Finduserintrest, Deleteuserintrest}