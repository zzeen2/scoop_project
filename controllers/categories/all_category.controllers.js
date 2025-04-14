const { Clubs, Tags, Categorys, Locations } = require('../../models/configs');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken')

// 세부 카테고리 목록 불러오기
const getDetailCategories = async (categoryName) => {
    const categories = await Categorys.findAll({
        where: { depth: 2 },
        include: [{
            model: Categorys,
            as: 'Parent',
            where: { name: categoryName, depth: 1 }
        }]
    });
    return categories.map(c => c.name);
};

// 전체 동호회 페이지
exports.getAllCategories = async (req, res) => {
    const { keyword } = req.query;
    const {login_access_token} = req.cookies;
            const {id, properties} = await jwt.verify(login_access_token, process.env.TOKEN)

    let where = {};
    if (keyword) {
        where = {
            [Op.or]: [
                { name: { [Op.like]: `%${keyword}%` } },
                { '$Tags.tag$': { [Op.like]: `%${keyword}%` } }
            ]
        };
    }

    const clubs = await Clubs.findAll({
        where,
        include: [Tags]
    });

    

    const recommendedClubs = clubs.filter(club => club.allow_guest === "1");

    res.render('categories/all_category', {
        categoryName: null,
        clubs,
        recommendedClubs,
        keyword,
        data : properties
    });
};

// 세부 카테고리 페이지
exports.getDetailCategory = async (req, res) => {
    const rawCategory = req.params.categoryName;
    const categoryName = decodeURIComponent(rawCategory).trim();
    const {login_access_token} = req.cookies;
            const {id, properties} = await jwt.verify(login_access_token, process.env.TOKEN)

    const { subCategory, keyword } = req.query;

    // 디버깅용 로그
    console.log("디코딩된 카테고리명:", categoryName);

    // 대표 카테고리 찾기
    const mainCategory = await Categorys.findOne({ where: { name: categoryName, depth: 1 } });

    if (!mainCategory) {
        console.warn(`[WARN] '${categoryName}' 카테고리를 찾을 수 없습니다.`);
        return res.status(404).send('카테고리를 찾을 수 없습니다.');
    }

    // 하위 카테고리 가져오기
    const subCategoryRows = await Categorys.findAll({
        where: {
            depth: 2,
            categorys_id_fk: mainCategory.id
        }
    });

    const subCategoryIds = subCategoryRows.map(row => row.id);
    const subCategories = subCategoryRows.map(row => row.name);

    // 클럽 조건
    let where = {
        categorys_id_fk: { [Op.in]: subCategoryIds }
    };
    
    if (subCategory && subCategory !== '전체') {
    const selected = await Categorys.findOne({
        where: {
        name: subCategory,
        depth: 2,
        categorys_id_fk: mainCategory.id
        }
    });
    
    if (selected) {
        where.categorys_id_fk = selected.id;
    } else {
        where.categorys_id_fk = -1; // 없으면 일부러 빈 결과
    }
    }
    

    if (keyword) {
        where = {
            ...where,
            [Op.or]: [
                { name: { [Op.like]: `%${keyword}%` } },
                { '$Tags.tag$': { [Op.like]: `%${keyword}%` } }
            ]
        };
    }

    // 클럽 가져오기
    const clubs = await Clubs.findAll({
        where,
        include: [Tags]
    });

    const recommendedClubs = clubs.filter(club => club.allow_guest === "1");

    // 뷰 렌더링
    res.render('categories/detail_category', {
        categoryName,
        clubs,
        subCategories,
        selectedSubCategory: subCategory || '전체',
        recommendedClubs,
        keyword,
        data : properties
    });
};


