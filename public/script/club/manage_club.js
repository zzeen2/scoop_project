document.querySelector(".btn-ok").addEventListener("click", async () => {
    const name = document.getElementById("club_name").value.trim();
    const info = document.getElementById("club_information").value.trim();
    const limit = document.querySelector(".memeber-input").value.trim();
    const tags = Array.from(document.querySelectorAll(".tag"))
    .map(tag => tag.firstChild.textContent.trim());
    const image = document.querySelector(".image-upload")

    if (!name || !info || !limit) {
        alert("모든 필드를 입력해주세요.");
        return;
    }

    try {
        const res = await axios.put(`/clubs/detail/<%= club.club_id %>/edit`, {
            name,
            introduction: info,
            member_limit: limit,
            tags,
            image
        });
        console.log("resresres", res)
        if (res.status === 200) {
        alert("수정 완료!");
        const redirectURL = `/clubs/detail/${CLUB_ID}`
            setTimeout(() => {
                window.location.assign(redirectURL);
            }, 0)
            
        }
    } catch (err) {
        console.error("수정 오류", err);
        alert("수정 실패");
    }
});
