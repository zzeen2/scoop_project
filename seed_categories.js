const { Categorys, sequelize } = require("./models/configs");

const categoryData = {
    "스포츠": ["구기스포츠", "수상스포츠", "실내 피트니스", "아웃도어 스포츠", "격투 스포츠", "동계 스포츠", "기타 스포츠"],
    "독서": ["책/독서", "글쓰기"],
    "사교": ["파티 맛집", "여성", "남성", "세대"],
    "여행": ["캠핑", "국내여행", "해외여행", "낚시", "등산", "트래킹/산책"],
    "음악": ["악기연주", "보컬/노래", "작사/작곡", "장르", "합주/밴드"],
    "자기계발": ["시험/자격증", "스터디", "스피치", "기타"],
    "공연": ["뮤지컬", "오케스트라", "연극", "전시회", "페스티벌", "오페라", "문화재 탐방"],
    "공예": ["시각 예술", "입체 공예", "디자인/페이퍼", "공연 공예"],
    "언어": ["영어", "일본어", "중국어", "프랑스어", "스페인어", "러시아어", "독일어"],
    "댄스": ["방송/힙합", "발레", "재즈댄스", "밸리댄스", "현대무용"],
    "봉사": ["양로원", "보육원", "환경봉사", "사회봉사", "재능나눔", "유기동물보호"],
    "사진": ["영상제작", "필름카메라", "디지털카메라", "DSLR"],
    "요리": ["한식", "양식", "중식", "일식", "제과/제빵", "커피", "와인", "칵테일"],
    "자동차": ["바이크", "드라이브"],
    "반려동물": ["강아지", "고양이", "물고기", "파충류"],
    "금융": ["주식투자", "부동산투자", "금융상품"],
    "창업": ["스타트업", "프렌차이즈", "네트워킹"]
};

const seedCategories = async () => {
    try {
        await Categorys.sync(); 
        let index = 1
        for (const [main, subs] of Object.entries(categoryData)) {
            // 1. 대표 카테고리 추가
            const mainCategory = await Categorys.create({
                name: main,
                depth: 1,
                categorys_id_fk : index
            });
            // 2. 세부 카테고리 추가
            for (const sub of subs) {
                await Categorys.create({
                    name: sub,
                    depth: 2,
                    categorys_id_fk: mainCategory.id
                });
            }
            console.log(main,":", index)
            index++;
        }

        console.log("샘플 카테고리 삽입 완료");
        process.exit();
    } catch (err) {
        console.error("카테고리 삽입 중 오류", err);
        process.exit(1);
    }
};

seedCategories();
