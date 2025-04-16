// 취소버튼 클릭 이벤트

/** 카카오 api로직
    사용자 입력
    ↓
    브라우저 → GET /clubs/search?query=강남역
    ↓
    서버 (add_club.routers.js)
        → Kakao에 요청 (axios로)
    ↓
    Kakao 응답 받아서 클라이언트로 전달
 */

// 지역 선택
document.addEventListener("DOMContentLoaded", function () {
    const rangeRadios = document.getElementsByName("range_type");
    const localSection = document.getElementById("local-range-section");
    const wideSection = document.getElementById("wide-range-section");

    const subwayInput = document.getElementById("subway_search");
    const subwayList = document.getElementById("subway-suggestions");

    const districtInput = document.getElementById("district-search");
    const districtList = document.getElementById("district-suggestions");
    const selectedContainer = document.getElementById("selected-districts");

    let selectedDistricts = [];

    // 라디오 버튼 선택 시 보여줄 섹션 변경
    rangeRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.value === "local") {
                localSection.style.display = "block";
                wideSection.style.display = "none";
            } else {
                localSection.style.display = "none";
                wideSection.style.display = "block";
            }
        });
    });

    // Kakao 검색 함수
    async function searchKakaoKeyword(keyword) {
        try {
            const response = await fetch(`/clubs/create/search?query=${encodeURIComponent(keyword)}`);
            if (!response.ok) {
                console.error("❌ 서버에서 Kakao API 호출 실패:", response.status);
                return [];
            }

            const data = await response.json();
            return data.documents || [];
        } catch (error) {
            console.error("❌ fetch 에러:", error);
            return [];
        }
    }

    // 지하철 검색 자동완성
    subwayInput.addEventListener("input", async () => {
        const keyword = subwayInput.value.trim();
        console.log("입력값:", keyword);
        if (keyword.length < 2) return;

        const results = await searchKakaoKeyword(keyword);
        console.log(" API 결과:", results);

        const filtered = results.filter(place =>
            place.place_name.includes("역") || place.address_name.includes("역")
        );
        console.log("필터된 지하철역:", filtered);

        subwayList.innerHTML = "";
        filtered.forEach(place => {
            const li = document.createElement("li");
            li.textContent = place.place_name;
            li.addEventListener("click", () => {
                subwayInput.value = place.place_name;
                subwayList.innerHTML = "";
            });
            subwayList.appendChild(li);
        });
    });

    // 시/군/구 검색 자동완성
    districtInput.addEventListener("input", async () => {
        const keyword = districtInput.value.trim();
        if (keyword.length < 1) return;
    
        const results = await searchKakaoKeyword(keyword);
        console.log("지역 검색 결과:", results);
    
        districtList.innerHTML = "";
    
        const seen = new Set(); // 중복 방지용
    
        results.forEach(place => {
            const fullAddress = place.address_name;
    
            // 주소에서 앞 2단계(시/도 + 시/군/구) 추출: 공백 기준 앞에서 두 개만
            const parts = fullAddress.split(" ");
            if (parts.length < 2) return;
    
            const region = `${parts[0]} ${parts[1]}`; // ex: 서울 강남구, 경기 남양주시
    
            if (seen.has(region) || selectedDistricts.includes(region)) return;
            seen.add(region);
    
            const li = document.createElement("li");
            li.textContent = region;
            li.addEventListener("click", () => {
                if (selectedDistricts.length >= 3) {
                    alert("최대 3개의 지역만 선택 가능합니다.");
                    return;
                }
                selectedDistricts.push(region);
                updateSelectedDistricts();
                districtInput.value = "";
                districtList.innerHTML = "";
            });
            districtList.appendChild(li);
        });
    
        // 검색 결과 없을 때 안내 메시지
        if (districtList.children.length === 0) {
            const li = document.createElement("li");
            li.textContent = "검색 결과가 없습니다.";
            li.style.color = "#999";
            li.style.cursor = "default";
            districtList.appendChild(li);
        }
    });
    


    // 선택된 시/군/구 리스트 렌더링
    function updateSelectedDistricts() {
        selectedContainer.innerHTML = "";
        selectedDistricts.forEach((district, idx) => {
            const span = document.createElement("span");
            span.className = "selected-district";
            span.innerHTML = `${district} <span class="remove-btn" data-idx="${idx}">×</span>`;
            selectedContainer.appendChild(span);
        });

        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.target.dataset.idx;
                selectedDistricts.splice(idx, 1);
                updateSelectedDistricts();
            });
        });
    }
});


// 카테고리 선택 -- 리뷰 필요
document.addEventListener("DOMContentLoaded", function () {
    // --- 카테고리 요소 선택
    const categorySelect = document.getElementById("club_category");
    const subCategoryBox = document.querySelector(".sub-category-cardBox");
    const selectedMain = document.querySelector(".selected-main-category");
    const selectedSub = document.querySelector(".selected-sub-category");

    const hiddenMainId = document.getElementById("main_category_id");
    const hiddenSubName = document.getElementById("sub_category_name");

    // --- 대표 카테고리 로딩
    async function loadMainCategories() {
        try {
            const res = await fetch("/clubs/create/categories/main");
            const categories = await res.json();
            
            console.log("res", res);
            console.log("categories", categories)

            categorySelect.innerHTML = `<option value="">대표 카테고리를 선택하세요</option>`;
            categories.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.id;
                option.textContent = cat.name;
                categorySelect.appendChild(option);
            });
        } catch (err) {
            console.error("대표 카테고리 로딩 실패:", err);
        }
    }

    // --- 세부 카테고리 로딩
    async function loadSubCategories(mainId) {
        try {
            const res = await fetch(`/clubs/create/categories/sub/${mainId}`);
            const subCategories = await res.json();

            subCategoryBox.innerHTML = "";
            selectedSub.textContent = "";
            hiddenSubName.value = "";

            subCategories.forEach(sub => {
                const span = document.createElement("span");
                span.className = "sub-category-card";
                span.textContent = sub.name;

                span.addEventListener("click", () => {
                    document.querySelectorAll(".sub-category-card").forEach(el => {
                        el.classList.remove("selected");
                    });
            
                    span.classList.add("selected");
            
                    selectedSub.textContent = sub.name;
                    document.getElementById("sub_category_name").value = sub.name;
                    document.getElementById("sub_category_id").value = sub.id
                });

                subCategoryBox.appendChild(span);
            });
        } catch (err) {
            console.error("세부 카테고리 로딩 실패:", err);
        }
    }

    // --- 대표 카테고리 선택 시 처리
    categorySelect.addEventListener("change", (e) => {
        const selectedOption = categorySelect.options[categorySelect.selectedIndex];
        const selectedId = selectedOption.value;
        const selectedName = selectedOption.textContent;

        selectedMain.textContent = selectedName;
        hiddenMainId.value = selectedId;

        if (selectedId) {
            loadSubCategories(selectedId);
        } else {
            subCategoryBox.innerHTML = "";
            selectedSub.textContent = "";
            hiddenMainId.value = "";
            hiddenSubName.value = "";
        }
    });

    // 초기 실행
    loadMainCategories();
});


// 태그 생성
document.addEventListener("DOMContentLoaded", ()=> {
    const tagInput = document.getElementById("club_tags");
    const tagContainer = tagInput.parentElement;

    tagInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setTimeout(() => {
                const tagText = tagInput.value.trim();
                if (!tagText) return;
    
                const existingTags = tagContainer.querySelectorAll(".tag");
                const duplicate = Array.from(existingTags).some(tag =>
                    tag.firstChild.textContent.trim() === tagText
                );
                if (duplicate) {
                    tagInput.value = "";
                    return;
                }
    
                const tag = document.createElement("span");
                tag.className = "tag";
                tag.innerHTML = `${tagText} <span class="tag-remove">×</span>`;
    
                tag.querySelector(".tag-remove").addEventListener("click", () => {
                    tag.remove();
                });
    
                tagContainer.insertBefore(tag, tagInput);
                tagInput.value = "";
            }, 0); 
        }
        //console.log(tagContainer);
    });    
})

// 이미지 업로드
document.addEventListener("DOMContentLoaded", () => {
    const club_image = document.getElementById("club_image");
    const imageUploadBox = document.querySelector(".image-upload");
    const icon = document.querySelector(".upload-icon");
    const upload_info = document.querySelector(".upload-info");

    imageUploadBox.addEventListener("click", () => {
        club_image.click();
    });

    club_image.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const existingImg = imageUploadBox.querySelector("img");
            if (existingImg) existingImg.remove();

            const previewImg = document.createElement("img");
            previewImg.src = event.target.result;
            previewImg.alt = "동호회 이미지 미리보기";
            previewImg.style.width = "80%";
            previewImg.style.aspectRatio = "4 / 3";
            previewImg.style.objectFit = "cover";
            previewImg.style.borderRadius = "8px";

            icon.style.display = "none";
            upload_info.style.display = "none";

            imageUploadBox.appendChild(previewImg);
        };
        reader.readAsDataURL(file);
    });
});


// 데이터 보내기
ok_btn.onclick = async (e) => {
    console.log("선택된 sub_category_id:", document.getElementById("sub_category_id").value);

    e.preventDefault();
    console.log("dd");
    const form = new FormData();

    form.append("name", club_name.value.trim());
    form.append("introduction", club_information.value.trim());
    form.append("image", club_image.files[0]);
    form.append("member_limit", document.querySelector(".memeber-input").value);
    form.append("main_category_id", main_category_id.value);
    form.append("sub_category_name", sub_category_name.value);
    form.append("sub_category_id", document.getElementById("sub_category_id").value);

    // 활동범위
    const rangeType = document.querySelector("input[name='range_type']:checked").value;
    form.append("activity_type", rangeType);

    if (rangeType === "local") { // 지역범위 선택하면
        form.append("local_station", subway_search.value.trim());
        form.append("wide_regions", ""); // 광역범위는 빈문자열로 보내기
    } else { // 광역범위 선택하면
        const selected = document.querySelectorAll(".selected-district");
        const wideRegions = Array.from(selected).map(span => span.textContent.replace(" ×", ""));
        form.append("wide_regions", JSON.stringify(wideRegions));
        form.append("local_station", "");// 지역범위는 빈문자열로 보내기
    }
    

    // 태그들
    const tags = Array.from(document.querySelectorAll(".tag")).map(tag => tag.firstChild.textContent.trim());
    form.append("tags", JSON.stringify(tags));
    console.log("태그확인 : ",tags  )

    try {
        if (!name || !info || !limit || !mainId || !subId || !rangeType ||
            (isLocal && !station) ||
            (!isLocal && selectedDistricts.length === 0)
        ) {
            alert("모든 필드를 입력해주세요.");
            return;
        }
    
        const res = await axios.post("/clubs/create/", form, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (res.status === 200) {
            alert("동호회가 성공적으로 생성되었습니다!");
            location.href = "/";
        }
    } catch (err) {
        console.error("동호회 생성 실패:", err);
        alert("동호회 생성 중 오류가 발생했습니다.");
    }
}
