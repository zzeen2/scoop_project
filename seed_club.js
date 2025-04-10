const { Clubs, Categorys, Users, Tags, Locations } = require("./models/configs");
const { v4: uuidv4 } = require("uuid");

const dummyClubs = [
  {
    name: "풋살러브",
    introduction: "즐겁게 풋살하는 모임입니다!",
    image: "/public/images/축구.png",
    member_limit: 20,
    club_category_name: "구기스포츠",
    allow_guest: true,
    view_count: 100,
    creator_id: "admin1",
    tags: ["풋살", "운동", "축구"],
    location: {
      point: "37.5665,126.9780",
      poligon: "서울시청 앞 잔디밭"
    }
  },
  {
    name: "비오는날 독서회",
    introduction: "따뜻한 커피와 책 한 권 어떠세요?",
    image: "/public/images/락밴드.png",
    member_limit: 15,
    club_category_name: "책/독서",
    allow_guest: false,
    view_count: 58,
    creator_id: "admin2",
    tags: ["감성", "북토크"],
    location: {
      point: "37.5728,126.9769",
      poligon: "광화문 교보문고"
    }
  }
];

const seedClubs = async () => {
  try {
    // 💥 기존 데이터만 제거 (테이블은 유지)
    await Tags.destroy({ where: {} });
    await Locations.destroy({ where: {} });
    await Clubs.destroy({ where: {} });

    for (const club of dummyClubs) {
      const category = await Categorys.findOne({ where: { name: club.club_category_name } });
      const creator = await Users.findOne({ where: { uid: club.creator_id } });

      if (!category || !creator) {
        console.log(`❌ 카테고리 또는 사용자 누락: ${club.club_category_name}, ${club.creator_id}`);
        continue;
      }

      const club_id = uuidv4().slice(0, 20);

      await Clubs.create({
        club_id,
        name: club.name,
        introduction: club.introduction,
        image: club.image,
        member_limit: club.member_limit,
        club_category_name: club.club_category_name,
        allow_guest: club.allow_guest,
        view_count: club.view_count,
        creator_id: club.creator_id,
        UserUid: creator.uid,
        categorys_id_fk: category.id,
      });

      // ✅ 태그 추가
      for (const tag of club.tags) {
        await Tags.create({
          tag,
          club_id_fk: club_id,
        });
      }

      // ✅ 위치 추가
      await Locations.create({
        club_id,
        point: club.location.point,
        poligon: club.location.poligon,
        club_id_fk: club_id,
      });
    }

    console.log("🎉 클럽 + 태그 + 위치 시드 데이터 삽입 완료");
    process.exit();
  } catch (err) {
    console.error("💥 시딩 중 에러 발생", err);
    process.exit(1);
  }
};

seedClubs();
