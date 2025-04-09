const {Clubs} = require("../../models/configs");
const {Categorys} = require("../../models/configs")

// 정보 입력 저장 
const createController = {
    async create () {

    }
}

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

module.exports = {getMainCategories, getSubCategories }