const { Clubs, Tags, Categorys } = require('../../models/configs');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

// 세부 카테고리 목록 불러오기
exports.getDetailCategories = async (categoryName) => {
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
  const { keyword = '', activity_type = 'all' } = req.query;
  const { login_access_token } = req.cookies;
  let properties = null;

  if (login_access_token) {
    try {
      const decoded = jwt.verify(login_access_token, process.env.TOKEN);
      properties = decoded.properties;
    } catch (err) {
      console.error("JWT 파싱 실패:", err);
    }
  }

  let where = {};
  if (keyword) {
    where = {
      [Op.or]: [
        { name: { [Op.like]: `%${keyword}%` } },
        { local_station: { [Op.like]: `%${keyword}%` } },
        { '$Tags.tag$': { [Op.like]: `%${keyword}%` } }
      ]
    };
  }

  if (activity_type !== 'all') {
    where.activity_type = activity_type;
  }

  const clubs = await Clubs.findAll({
    where,
    include: [Tags]
  });

  const serializeClubs = (clubs) => {
    return clubs.map(club => {
      let wideArray = [];
      try {
        wideArray = JSON.parse(club.wide_regions);
      } catch (e) {
        wideArray = [];
      }

      return {
        ...club.toJSON(),
        wide_regions: wideArray
      };
    });
  };

  const serializedClubs = serializeClubs(clubs);

  const keywordLower = keyword.toLowerCase();
  const filteredClubs = serializedClubs.filter(club => {
    const wideMatch = club.wide_regions.some(region => region.includes(keywordLower));
    const nameMatch = club.name?.toLowerCase().includes(keywordLower);
    const localMatch = club.local_station?.toLowerCase().includes(keywordLower);
    const tagMatch = club.Tags?.some(tag => tag.tag?.toLowerCase().includes(keywordLower));

    return wideMatch || nameMatch || localMatch || tagMatch;
  });

  const recommendedClubs = filteredClubs.filter(club => club.allow_guest === "1");

  res.render('categories/all_category', {
    categoryName: null,
    clubs: filteredClubs,
    recommendedClubs,
    keyword,
    activity_type,
    data: properties
  });
};
