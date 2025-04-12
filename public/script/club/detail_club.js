// 찜하기버튼
const btn_like = document.querySelector(".btn_like");

btn_like.onclick = async () => {
    const clubId = btn_like.dataset.clubid;

    try {
        const res = await axios.post(`/clubs/detail/${clubId}/heart`);

        if (res.status !== 200) {
            alert("로그인이 필요합니다.");
            return;
        }

        const result = res.data;

        if (result.liked) {
            btn_like.classList.add("on");
        } else {
            btn_like.classList.remove("on");
        }

    } catch (error) {
        console.log("찜하기 오류 발생:", error);
        alert("서버 오류가 발생했습니다.");
    }
};


