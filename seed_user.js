const { Users } = require("./models/configs");

const seedUsers = async () => {
  try {
    await Users.sync(); // users 테이블 생성 or 존재 시 유지

    await Users.bulkCreate([
      {
        uid: "admin1",
        kakao_id: "kakao_admin1",
        kakao_name: "관리자1",
        kakao_profile_image: "/public/images/admin1.png",
        age: 30,
        gender: "남성",
        introduction: 100,
        location: "서울특별시 중구"
      },
      {
        uid: "admin2",
        kakao_id: "kakao_admin2",
        kakao_name: "관리자2",
        kakao_profile_image: "/public/images/admin2.png",
        age: 28,
        gender: "여성",
        introduction: 80,
        location: "서울특별시 종로구"
      }
    ]);

    console.log("✅ 사용자 시드 데이터 삽입 완료");
    process.exit();
  } catch (err) {
    console.error("❌ 사용자 시드 데이터 삽입 중 오류", err);
    process.exit(1);
  }
};

seedUsers();
