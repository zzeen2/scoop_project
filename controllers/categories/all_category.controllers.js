const { Clubs, Tags, Categorys } = require('../../models/configs');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

exports.getDetailCategories = async (req, res) => {
  const categoryName = decodeURIComponent(req.params.categoryName); // URL에서 categoryName 가져오기
  const { activity_type = 'all', keyword = '', subCategory } = req.query; // keyword에 기본값 추가
  let properties = null;

  const { login_access_token } = req.cookies;
  if (login_access_token) {
    try {
      const decoded = jwt.verify(login_access_token, process.env.TOKEN);
      properties = decoded.properties;
    } catch (err) {
      console.error("JWT 파싱 실패:", err);
    }
  }

  try {
    // 부모 카테고리 이름에 해당하는 세부 카테고리들 가져오기
    const categories = await Categorys.findAll({
      where: { depth: 2 },
      include: [{
        model: Categorys,
        as: 'Parent',
        where: { name: categoryName, depth: 1 } // 부모 카테고리 이름에 해당하는 세부 카테고리
      }]
    });

    const subCategories = categories.map(c => c.name); // 세부 카테고리 이름만 추출

    // 동호회 목록 가져오기
    let where = { categorys_id_fk: { [Op.in]: categories.map(c => c.id) } }; // 세부 카테고리와 연관된 동호회만 가져오기

    // 활동 타입 필터링 추가
    if (activity_type !== 'all') {
      where.activity_type = activity_type;
    }

    // subCategory 파라미터 처리 수정
    if (subCategory) {
      // 카테고리 ID 찾기
      const filteredCategory = categories.find(c => c.name === subCategory);
      if (filteredCategory) {
        // 기존 카테고리 ID 필터를 교체
        where.categorys_id_fk = filteredCategory.id;
      }
    }

    // 동호회 정보 가져오기
    const clubs = await Clubs.findAll({
      where,
      include: [Tags, Categorys]
    });

    // wide_regions를 배열로 변환
    const serializeClubs = (clubs) => {
      return clubs.map(club => {
        let wideArray = [];
        
        try {
          wideArray = JSON.parse(club.wide_regions); // 문자열을 배열로 변환
        } catch (e) {
          wideArray = club.wide_regions ? [club.wide_regions] : [];
        }

        return {
          ...club.toJSON(),
          wide_regions: wideArray
        };
      });
    };

    const serializedClubs = serializeClubs(clubs);

    // keyword로 동호회 필터링 - 안전하게 처리
    let filteredClubs = serializedClubs;
    
    if (keyword && keyword.trim() !== '') {
      const keywordLower = keyword.toLowerCase();
      filteredClubs = serializedClubs.filter(club => {
        const wideMatch = Array.isArray(club.wide_regions) && 
                         club.wide_regions.some(region => region && region.toLowerCase().includes(keywordLower));
        const nameMatch = club.name && club.name.toLowerCase().includes(keywordLower);
        const localMatch = club.local_station && club.local_station.toLowerCase().includes(keywordLower);
        const tagMatch = club.Tags && 
                         club.Tags.some(tag => tag.tag && tag.tag.toLowerCase().includes(keywordLower));

        return wideMatch || nameMatch || localMatch || tagMatch;
      });
    }

    const recommendedClubs = filteredClubs.filter(club => club.allow_guest === "1");

    // 세부 카테고리 페이지 렌더링
    res.render('categories/detail_category', {
      categoryName,  // 부모 카테고리 이름을 템플릿으로 전달
      subCategories, // 세부 카테고리 목록을 템플릿으로 전달
      activity_type, // activity_type을 템플릿으로 전달
      keyword,       // 검색어를 템플릿으로 전달
      subCategory,   // 선택된 서브 카테고리 전달
      clubs: filteredClubs, // 필터링된 동호회 목록
      recommendedClubs, // 게스트 참여 가능한 동호회 추천
      data: properties
    });

  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send('Internal Server Error');
  }
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
        wideArray = club.wide_regions ? [club.wide_regions] : [];
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
