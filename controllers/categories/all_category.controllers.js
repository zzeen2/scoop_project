const { Clubs, Tags, Categorys, Locations } = require('../../models/configs');
const { Op } = require('sequelize');

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
        keyword
    });
};

// 세부 카테고리 페이지
exports.getDetailCategory = async (req, res) => {
    const { categoryName } = req.params;
    const { subCategory, keyword } = req.query;

    // 상위 카테고리 찾기
    const mainCategory = await Categorys.findOne({ where: { name: categoryName, depth: 1 } });
    if (!mainCategory) return res.status(404).send('카테고리를 찾을 수 없습니다.');

    const subCategories = await getDetailCategories(categoryName);
    console.log(mainCategory)
    // 하위 카테고리 목록 불러오기 (id들)
    const subCategoryRows = await Categorys.findAll({
        where: {
            depth: 2,
            categorys_id_fk: mainCategory.id
        }
    });

    const subCategoryIds = subCategoryRows.map(row => row.categorys_id_fk);
    console.log(subCategoryIds)
    let where = {
        categorys_id_fk: {
            [Op.in]: subCategoryIds
        }
    };

    if (subCategory && subCategory !== '전체') {
        where.club_category_name = subCategory;
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

    const clubs = await Clubs.findAll({
        where
    });
    console.log(clubs)

    const recommendedClubs = clubs.filter(club => club.allow_guest === "1");

    res.render('categories/detail_category', {
        categoryName,
        clubs,
        subCategories,
        selectedSubCategory: subCategory || '전체',
        recommendedClubs,
        keyword
    });
};
