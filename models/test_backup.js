    // sample-data.js
    // 모든 테이블 샘플 데이터 삽입

    const db = require('./configs');
    const { v4: uuidv4 } = require('uuid'); // npm install uuid 필요

    function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
    function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ===================== 카테고리 삽입 =====================
    async function insertCategoryData() {
    console.log("📁 카테고리 삽입 중...");
    const categoryData = {
    "스포츠": ["구기스포츠", "수상스포츠", "실내 피트니스", "아웃도어 스포츠", "격투 스포츠", "동계 스포츠", "기타 스포츠"],
    "독서": ["책/독서", "글쓰기"],
    "사교/인맥": ["파티 맛집", "여성", "남성", "세대"],
    "여행/아웃도어": ["캠핑", "국내여행", "해외여행", "낚시", "등산", "트래킹/산책"],
    "음악": ["악기연주", "보컬/노래", "작사/작곡", "장르", "합주/밴드"],
    "자기계발": ["시험/자격증", "스터디", "스피치", "기타"],
    "문화/공연/축제": ["뮤지컬", "오케스트라", "연극", "전시회", "페스티벌", "오페라", "문화재 탐방"],
    "공예": ["시각 예술", "입체 공예", "디자인/페이퍼", "공연 공예"],
    "언어": ["영어", "일본어", "중국어", "프랑스어", "스페인어", "러시아어", "독일어"],
    "댄스": ["방송/힙합", "발레", "재즈댄스", "밸리댄스", "현대무용"],
    "봉사": ["양로원", "보육원", "환경봉사", "사회봉사", "재능나눔", "유기동물보호"],
    "사진/영상": ["영상제작", "필름카메라", "디지털카메라", "DSLR"],
    "요리/제조": ["한식", "양식", "중식", "일식", "제과/제빵", "커피", "와인", "칵테일"],
    "자동차": ["바이크", "드라이브"],
    "반려동물": ["강아지", "고양이", "물고기", "파충류"],
    "투자/금융": ["주식투자", "부동산투자", "금융상품"],
    "창업/사업": ["스타트업", "프렌차이즈", "네트워킹"]
    };

    const mainCategories = [];
    let categoryId = 1;

    for (const mainCategory in categoryData) {
    await db.Categorys.create({ id: categoryId, depth: 1, name: mainCategory });
    mainCategories.push({ id: categoryId, name: mainCategory });
    categoryId++;
    }

    for (let i = 0; i < mainCategories.length; i++) {
    const mainCategory = mainCategories[i];
    const subcategories = categoryData[mainCategory.name];
    for (const subcategory of subcategories) {
    await db.Categorys.create({
    id: categoryId,
    depth: 2,
    name: subcategory,
    categorys_id_fk: mainCategory.id
    });
    categoryId++;
    }
    }

    console.log("✅ 카테고리 삽입 완료");
    return mainCategories;
    }

    // ===================== 사용자 삽입 =====================
    async function insertUserData() {
    console.log("👤 사용자 삽입 중...");
    const users = [
    {
    uid: "user1", kakao_id: "kakao1", kakao_name: "김민준", kakao_profile_image: "https://example.com/profile1.jpg",
    age: 25, gender: "남성", introduction: 1, location: "서울 강남구"
    },
    {
    uid: "user2", kakao_id: "kakao2", kakao_name: "이서연", kakao_profile_image: "https://example.com/profile2.jpg",
    age: 28, gender: "여성", introduction: 2, location: "서울 중구"
    },
    {
    uid: "user3", kakao_id: "kakao3", kakao_name: "박지훈", kakao_profile_image: "https://example.com/profile3.jpg",
    age: 32, gender: "남성", introduction: 3, location: "서울 마포구"
    },
    {
    uid: "user4", kakao_id: "kakao4", kakao_name: "최수아", kakao_profile_image: "https://example.com/profile4.jpg",
    age: 27, gender: "여성", introduction: 4, location: "서울 송파구"
    },
    {
    uid: "user5", kakao_id: "kakao5", kakao_name: "정현우", kakao_profile_image: "https://example.com/profile5.jpg",
    age: 30, gender: "남성", introduction: 5, location: "서울 강서구"
    }
    ];
    for (const user of users) await db.Users.create(user);
    console.log("✅ 사용자 삽입 완료");
    return users;
    }

// ===================== 사용자 관심사 삽입 =====================
async function insertUserIntrestData() {
    console.log("✨ 사용자 관심사 삽입 중...");
    const interests = [
      { uid: "user1", keyword_category_name: "스포츠", user_id_fk: "user1" },
      { uid: "user1", keyword_category_name: "음악", user_id_fk: "user1" },
      { uid: "user2", keyword_category_name: "요리/제조", user_id_fk: "user2" },
      { uid: "user2", keyword_category_name: "독서", user_id_fk: "user2" },
      { uid: "user3", keyword_category_name: "여행/아웃도어", user_id_fk: "user3" },
      { uid: "user3", keyword_category_name: "자동차", user_id_fk: "user3" },
      { uid: "user4", keyword_category_name: "댄스", user_id_fk: "user4" },
      { uid: "user4", keyword_category_name: "공예", user_id_fk: "user4" },
      { uid: "user5", keyword_category_name: "투자/금융", user_id_fk: "user5" },
      { uid: "user5", keyword_category_name: "창업/사업", user_id_fk: "user5" }
    ];
    for (const i of interests) await db.Userintrests.create(i);
    console.log("✅ 관심사 삽입 완료");
  }
  
  // ===================== 포인트 삽입 =====================
  async function insertPointData() {
    console.log("💰 포인트 삽입 중...");
    const points = [
      { point: 100, user_id_fk: "user1" },
      { point: 250, user_id_fk: "user2" },
      { point: 320, user_id_fk: "user3" },
      { point: 180, user_id_fk: "user4" },
      { point: 420, user_id_fk: "user5" }
    ];
    for (const p of points) await db.Points.create(p);
    console.log("✅ 포인트 삽입 완료");
  }
  
  // ===================== 클럽 삽입 =====================
  async function insertClubData() {
    console.log("🏕️ 클럽 삽입 중...");
    const clubs = [
      {
        club_id: 1,
        name: "서울 등산 모임",
        introduction: "서울 근교의 산을 함께 등산하는 모임입니다.",
        image: "https://example.com/club1.jpg",
        creator_id: "user1",
        member_limit: 20,
        club_category_name: "여행/아웃도어",
        allow_guest: "Y",
        view_count: 120,
        categorys_id_fk: 5
      },
      {
        club_id: 2,
        name: "독서 토론 클럽",
        introduction: "매주 한 권의 책을 읽고 토론하는 모임입니다.",
        image: "https://example.com/club2.jpg",
        creator_id: "user2",
        member_limit: 15,
        club_category_name: "독서",
        allow_guest: "N",
        view_count: 85,
        categorys_id_fk: 2
      },
      {
        club_id: 3,
        name: "주말 축구 클럽",
        introduction: "주말마다 만나서 축구를 즐기는 모임입니다.",
        image: "https://example.com/club3.jpg",
        creator_id: "user3",
        member_limit: 22,
        club_category_name: "스포츠",
        allow_guest: "Y",
        view_count: 210,
        categorys_id_fk: 1
      },
      {
        club_id: 4,
        name: "K-POP 댄스 클럽",
        introduction: "K-POP 댄스를 함께 배우고 연습하는 모임입니다.",
        image: "https://example.com/club4.jpg",
        creator_id: "user4",
        member_limit: 18,
        club_category_name: "댄스",
        allow_guest: "Y",
        view_count: 175,
        categorys_id_fk: 10
      },
      {
        club_id: 5,
        name: "투자 스터디 그룹",
        introduction: "함께 투자 전략을 연구하고 공유하는 모임입니다.",
        image: "https://example.com/club5.jpg",
        creator_id: "user5",
        member_limit: 12,
        club_category_name: "투자/금융",
        allow_guest: "N",
        view_count: 95,
        categorys_id_fk: 16
      }
    ];
    for (const c of clubs) await db.Clubs.create(c);
    console.log("✅ 클럽 삽입 완료");
  }
  
  // ===================== 태그 삽입 =====================
  async function insertTagData() {
    console.log("🏷️ 태그 삽입 중...");
    const tags = [
      { tag: "등산", club_id_fk: 1 },
      { tag: "야외활동", club_id_fk: 1 },
      { tag: "트레킹", club_id_fk: 1 },
      { tag: "독서", club_id_fk: 2 },
      { tag: "토론", club_id_fk: 2 },
      { tag: "문학", club_id_fk: 2 },
      { tag: "축구", club_id_fk: 3 },
      { tag: "운동", club_id_fk: 3 },
      { tag: "팀스포츠", club_id_fk: 3 },
      { tag: "댄스", club_id_fk: 4 },
      { tag: "케이팝", club_id_fk: 4 },
      { tag: "안무", club_id_fk: 4 },
      { tag: "투자", club_id_fk: 5 },
      { tag: "주식", club_id_fk: 5 },
      { tag: "재테크", club_id_fk: 5 }
    ];
    for (const t of tags) await db.Tags.create(t);
    console.log("✅ 태그 삽입 완료");
  }
  
  // ===================== 멤버 삽입 =====================
  async function insertMemberData() {
    console.log("🧑‍🤝‍🧑 멤버 삽입 중...");
    const members = [
      { member_uid: "member1", signup_date: "2025-01-15", club_id_fk: 1 },
      { member_uid: "member2", signup_date: "2025-01-18", club_id_fk: 1 },
      { member_uid: "member3", signup_date: "2025-01-20", club_id_fk: 1 },
      { member_uid: "member4", signup_date: "2025-01-10", club_id_fk: 2 },
      { member_uid: "member5", signup_date: "2025-01-12", club_id_fk: 2 },
      { member_uid: "member6", signup_date: "2025-01-05", club_id_fk: 3 },
      { member_uid: "member7", signup_date: "2025-01-08", club_id_fk: 3 },
      { member_uid: "member8", signup_date: "2025-01-25", club_id_fk: 4 },
      { member_uid: "member9", signup_date: "2025-01-28", club_id_fk: 4 },
      { member_uid: "member10", signup_date: "2025-01-30", club_id_fk: 5 }
    ];
    for (const m of members) await db.Members.create(m);
    console.log("✅ 멤버 삽입 완료");
  }
  
  // ===================== 위치 삽입 =====================
  async function insertLocationData() {
    console.log("📍 위치 삽입 중...");
    const locations = [
      { club_id: 1, point: "37.5665,126.9780", poligon: "37.566,126.978,37.567,126.979,37.568,126.980", club_id_fk: 1 },
      { club_id: 2, point: "37.5512,126.9882", poligon: "37.551,126.988,37.552,126.989,37.553,126.990", club_id_fk: 2 },
      { club_id: 3, point: "37.5788,126.8940", poligon: "37.578,126.894,37.579,126.895,37.580,126.896", club_id_fk: 3 },
      { club_id: 4, point: "37.5445,127.0565", poligon: "37.544,127.056,37.545,127.057,37.546,127.058", club_id_fk: 4 },
      { club_id: 5, point: "37.5096,127.0550", poligon: "37.509,127.055,37.510,127.056,37.511,127.057", club_id_fk: 5 }
    ];
    for (const l of locations) await db.Locations.create(l);
    console.log("✅ 위치 삽입 완료");
  }
// ===================== 이벤트 삽입 =====================
async function insertEventData() {
    console.log("📅 이벤트 삽입 중...");
    const events = [
      {
        id: "event1",
        club_id: "club1",
        title: "북한산 등산",
        content: "북한산 등산 모임입니다.",
        start_date: Math.floor(new Date("2025-04-15").getTime() / 1000),
        end_date: Math.floor(new Date("2025-04-15").getTime() / 1000) + 28800,
        location: "북한산 국립공원 입구",
        guest_allow: 1,
        max_participants: 15,
        club_id_fk: 1
      },
      {
        id: "event2",
        club_id: "club2",
        title: "4월 독서 토론",
        content: "4월 선정 도서 토론",
        start_date: Math.floor(new Date("2025-04-20").getTime() / 1000),
        end_date: Math.floor(new Date("2025-04-20").getTime() / 1000) + 7200,
        location: "강남 카페",
        guest_allow: 0,
        max_participants: 12,
        club_id_fk: 2
      },
      {
        id: "event3",
        club_id: "club3",
        title: "주말 축구 경기",
        content: "월간 친선 경기",
        start_date: Math.floor(new Date("2025-04-22").getTime() / 1000),
        end_date: Math.floor(new Date("2025-04-22").getTime() / 1000) + 10800,
        location: "월드컵 공원 축구장",
        guest_allow: 1,
        max_participants: 22,
        club_id_fk: 3
      },
      {
        id: "event4",
        club_id: "club4",
        title: "신곡 안무 연습",
        content: "신곡 안무 연습 모임",
        start_date: Math.floor(new Date("2025-04-25").getTime() / 1000),
        end_date: Math.floor(new Date("2025-04-25").getTime() / 1000) + 14400,
        location: "강남 댄스 스튜디오",
        guest_allow: 1,
        max_participants: 16,
        club_id_fk: 4
      },
      {
        id: "event5",
        club_id: "club5",
        title: "월간 투자 세미나",
        content: "월간 투자 전략 공유",
        start_date: Math.floor(new Date("2025-04-28").getTime() / 1000),
        end_date: Math.floor(new Date("2025-04-28").getTime() / 1000) + 10800,
        location: "강남 비즈니스 센터",
        guest_allow: 0,
        max_participants: 10,
        club_id_fk: 5
      }
    ];
    for (const event of events) await db.Events.create(event);
    console.log("✅ 이벤트 삽입 완료");
  }
  
  // ===================== 참가자 삽입 =====================
  async function insertParticipantData() {
    console.log("🙋 참가자 삽입 중...");
    const participants = [
      { participant_id: "participant1", participants_id_fk: "event1" },
      { participant_id: "participant2", participants_id_fk: "event1" },
      { participant_id: "participant3", participants_id_fk: "event1" },
      { participant_id: "participant4", participants_id_fk: "event2" },
      { participant_id: "participant5", participants_id_fk: "event2" },
      { participant_id: "participant6", participants_id_fk: "event3" },
      { participant_id: "participant7", participants_id_fk: "event3" },
      { participant_id: "participant8", participants_id_fk: "event4" },
      { participant_id: "participant9", participants_id_fk: "event4" },
      { participant_id: "participant10", participants_id_fk: "event5" }
    ];
    for (const p of participants) await db.Participants.create(p);
    console.log("✅ 참가자 삽입 완료");
  }
  
  // ===================== 인증 삽입 =====================
  async function insertVerificationData() {
    console.log("📸 인증 삽입 중...");
    const verifications = [
      { proof_id: "proof1", image: "https://example.com/verification1.jpg", verifications_id_fk: "event1" },
      { proof_id: "proof2", image: "https://example.com/verification2.jpg", verifications_id_fk: "event2" },
      { proof_id: "proof3", image: "https://example.com/verification3.jpg", verifications_id_fk: "event3" },
      { proof_id: "proof4", image: "https://example.com/verification4.jpg", verifications_id_fk: "event4" },
      { proof_id: "proof5", image: "https://example.com/verification5.jpg", verifications_id_fk: "event5" }
    ];
    for (const v of verifications) await db.Verifications.create(v);
    console.log("✅ 인증 삽입 완료");
  }
  
  // ===================== 좋아요 삽입 =====================
  async function insertHeartData() {
    console.log("❤️ 좋아요 삽입 중...");
    const hearts = [
      { like_id: 1, user_id_fk: "user1", club_id_fk: 1 },
      { like_id: 2, user_id_fk: "user2", club_id_fk: 2 },
      { like_id: 3, user_id_fk: "user3", club_id_fk: 3 },
      { like_id: 4, user_id_fk: "user4", club_id_fk: 4 },
      { like_id: 5, user_id_fk: "user5", club_id_fk: 5 }
    ];
    for (const h of hearts) await db.Hearts.create(h);
    console.log("✅ 좋아요 삽입 완료");
  }
  
  // ===================== 리뷰 삽입 =====================
  async function insertReviewData() {
    console.log("📝 리뷰 삽입 중...");
    const reviews = [
      {
        id: "review1",
        content: "북한산 등산 모임이 너무 좋았습니다. 다음에도 꼭 참여하고 싶어요!",
        star: 5,
        user_id_fk: "user1",
        club_id_fk: 1
      },
      {
        id: "review2",
        content: "독서 토론이 유익했습니다. 다양한 의견을 들을 수 있어서 좋았어요.",
        star: 4,
        user_id_fk: "user2",
        club_id_fk: 2
      },
      {
        id: "review3",
        content: "축구 모임이 즐거웠습니다. 다들 친절하고 실력도 좋았어요.",
        star: 5,
        user_id_fk: "user3",
        club_id_fk: 3
      },
      {
        id: "review4",
        content: "댄스 연습이 재미있었어요. 안무를 잘 가르쳐주셔서 쉽게 배울 수 있었습니다.",
        star: 4,
        user_id_fk: "user4",
        club_id_fk: 4
      },
      {
        id: "review5",
        content: "투자 세미나가 매우 유익했습니다. 실질적인 전략을 배울 수 있어서 좋았어요.",
        star: 5,
        user_id_fk: "user5",
        club_id_fk: 5
      }
    ];
    for (const r of reviews) await db.Reviews.create(r);
    console.log("✅ 리뷰 삽입 완료");
  }
// ===================== 전체 실행 함수 =====================
async function insertAllData() {
  try {
    await db.sequelize.authenticate();
    console.log("✅ 데이터베이스 연결 성공!");

    // 🔁 외래키 제약을 고려한 삭제 순서 (자식 → 부모)
    console.log("🧹 기존 데이터 초기화 중...");
    await db.Verifications.destroy({ where: {} });
    await db.Participants.destroy({ where: {} });
    await db.Hearts.destroy({ where: {} });
    await db.Reviews.destroy({ where: {} });
    await db.Tags.destroy({ where: {} });
    await db.Events.destroy({ where: {} });
    await db.Locations.destroy({ where: {} });
    await db.Members.destroy({ where: {} });
    await db.Clubs.destroy({ where: {} });
    await db.Points.destroy({ where: {} });
    await db.Userintrests.destroy({ where: {} });
    await db.Users.destroy({ where: {} });
    await db.Categorys.destroy({ where: {} });
    console.log("✅ 모든 테이블 초기화 완료");

    // ✨ 데이터 삽입 순서
    await insertCategoryData();
    await insertUserData();
    await insertUserIntrestData();
    await insertPointData();
    await insertClubData();
    await insertTagData();
    await insertMemberData();
    await insertLocationData();
    await insertEventData();
    await insertParticipantData();
    await insertVerificationData();
    await insertHeartData();
    await insertReviewData();

    console.log("🎉 모든 샘플 데이터가 성공적으로 삽입되었습니다!");
  } catch (error) {
    console.error("❌ 샘플 데이터 삽입 중 오류 발생:", error);
  } finally {
    await db.sequelize.close();
    console.log("🔌 데이터베이스 연결이 종료되었습니다.");
  }
}

insertAllData();
