const { Clubs, Tags, Categorys } = require('../../models/configs');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

exports.getDetailCategories = async (req, res) => {
  const categoryName = decodeURIComponent(req.params.categoryName); 
  const { activity_type = 'all', keyword = '', subCategory } = req.query;
  let properties = null;

  const { login_access_token } = req.cookies;
  if (login_access_token) {
    try {
      const decoded = jwt.verify(login_access_token, process.env.TOKEN);
      properties = decoded.properties;
    } catch (err) {

    }
  }
  try {
    const categories = await Categorys.findAll({
      where: { depth: 2 },
      include: [{
        model: Categorys,
        as: 'Parent',
        where: { name: categoryName, depth: 1 } 
      }]
    });
    const subCategories = categories.map(c => c.name); 
    let where = { categorys_id_fk: { [Op.in]: categories.map(c => c.id) } }; 
    if (activity_type !== 'all') {
      where.activity_type = activity_type;
    }
    
    if (subCategory) {      
      const filteredCategory = categories.find(c => c.name === subCategory);
      if (filteredCategory) {
        where.categorys_id_fk = filteredCategory.id;
      }
    }
    
    const clubs = await Clubs.findAll({
      where,
      include: [Tags, Categorys]
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
    
    res.render('categories/detail_category', {
      categoryName,  
      subCategories, 
      activity_type, 
      keyword,       
      subCategory,   
      clubs: filteredClubs, 
      recommendedClubs, 
      data: properties
    });

  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};
exports.getAllCategories = async (req, res) => {
  const { keyword = '', activity_type = 'all' } = req.query;
  const { login_access_token } = req.cookies;
  let properties = null;

  if (login_access_token) {
    try {
      const decoded = jwt.verify(login_access_token, process.env.TOKEN);
      properties = decoded.properties;
    } catch (err) {

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
