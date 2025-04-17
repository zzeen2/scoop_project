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

    async function searchKakaoKeyword(keyword) {
        try {
            const response = await fetch(`/clubs/create/search?query=${encodeURIComponent(keyword)}`);
            if (!response.ok) {
                return [];
            }

            const data = await response.json();
            return data.documents || [];
        } catch (error) {
            return [];
        }
    }

    subwayInput.addEventListener("input", async () => {
        const keyword = subwayInput.value.trim();
        if (keyword.length < 2) return;

        const results = await searchKakaoKeyword(keyword);
        const filtered = results.filter(place =>
            place.place_name.includes("역") || place.address_name.includes("역")
        );

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

    districtInput.addEventListener("input", async () => {
        const keyword = districtInput.value.trim();
        if (keyword.length < 1) return;
    
        const results = await searchKakaoKeyword(keyword);
        console.log("지역 검색 결과:", results);
    
        districtList.innerHTML = "";
    
        const seen = new Set(); 
    
        results.forEach(place => {
            const fullAddress = place.address_name;
            const parts = fullAddress.split(" ");
            if (parts.length < 2) return;
    
            const region = `${parts[0]} ${parts[1]}`;
    
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
    
        if (districtList.children.length === 0) {
            const li = document.createElement("li");
            li.textContent = "검색 결과가 없습니다.";
            li.style.color = "#999";
            li.style.cursor = "default";
            districtList.appendChild(li);
        }
    });
    

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


document.addEventListener("DOMContentLoaded", function () {
    const categorySelect = document.getElementById("club_category");
    const subCategoryBox = document.querySelector(".sub-category-cardBox");
    const selectedMain = document.querySelector(".selected-main-category");
    const selectedSub = document.querySelector(".selected-sub-category");

    const hiddenMainId = document.getElementById("main_category_id");
    const hiddenSubName = document.getElementById("sub_category_name");
    async function loadMainCategories() {
        try {
            const res = await fetch("/clubs/create/categories/main");
            const categories = await res.json();
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
    loadMainCategories();
});

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
    });    
})

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

ok_btn.onclick = async (e) => {
    e.preventDefault();
    const name = club_name.value.trim();
    const info = club_information.value.trim();
    const limit = document.querySelector(".memeber-input").value.trim();
    const mainId = main_category_id.value;
    const subName = sub_category_name.value;
    const subId = document.getElementById("sub_category_id").value;
    const rangeType = document.querySelector("input[name='range_type']:checked")?.value;
    const isLocal = rangeType === "local";
    const station = subway_search.value.trim();
    const selected = document.querySelectorAll(".selected-district");
    const selectedDistricts = Array.from(selected).map(span => span.textContent.replace(" ×", ""));
    
    if (!name || !info || !limit || !mainId || !subId || !rangeType ||
        (isLocal && !station) ||
        (!isLocal && selectedDistricts.length === 0)
    ) {
        Popupwrap_empty.classList.add('popup')
        return;
    }
    
    const form = new FormData();
    form.append("name", name);
    form.append("introduction", info);
    if (club_image.files[0]) {
        form.append("image", club_image.files[0]); 
    }
    form.append("member_limit", limit);
    form.append("main_category_id", mainId);
    form.append("sub_category_name", subName);
    form.append("sub_category_id", subId);
    form.append("activity_type", rangeType);
    
    if (isLocal) {
        form.append("local_station", station);
        form.append("wide_regions", "");
    } else {
        form.append("wide_regions", JSON.stringify(selectedDistricts));
        form.append("local_station", "");
    }
    
    const tags = Array.from(document.querySelectorAll(".tag")).map(tag =>
        tag.firstChild.textContent.trim()
    );
    form.append("tags", JSON.stringify(tags));
    
    try {
        const res = await axios.post("/clubs/create/", form, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        
        if (res.status === 200) {
            Popupwrap.classList.add('popup')
        }
    } catch (err) {
        console.error("동호회 생성 실패:", err);
        Popupwraperror.classList.add('popup')
    }
};

cancel_btn.onclick = (e) => {
    location.href = '/mypage'
}

