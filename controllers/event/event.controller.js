const { Events } = require ('../../models/configs');
const { v4: uuidv4 } = require('uuid'); 
const jwt = require("jsonwebtoken")

console.log("넘어왔어")
const createEvent = async (req,res) => {
    try {
        const token = req.cookies.login_access_token;
        const decoded = jwt.verify(token, process.env.TOKEN);
        const userId = decoded.id;
        const {
            name, description, location, max_participants, guest_allow, start_date, end_date
        } = req.body;

        const clubId = req.params.clubId;

        if(!name || !description || !location || !max_participants || !guest_allow ||!start_date || !end_date){
            return res.json ({state : 400, message : "이벤트를 추가하기 위해 모든 필드를 입력해야합니다."})
        }

        const newEvent = await Events.create({
            id: uuidv4().slice(0, 20),
            title: name,
            content: description,
            location,
            club_id: clubId,
            guest_allow,
            max_participants,
            start_date: new Date(start_date).getTime(),
            end_date: new Date(end_date).getTime(),
            user_id_fk : userId,
            club_id_fk: clubId
        })
        return res.json ({state : 200, message : "이벤트 등록 완료", event : newEvent})
    } catch (error) {
        console.log("이벤트 생성 오류", error)
        return res.json({state : 400, message : "이벤트 생성 서버 오류"})
    }
}

module.exports = {createEvent};