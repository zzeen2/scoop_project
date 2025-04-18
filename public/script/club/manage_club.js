document.querySelector(".btn-ok").addEventListener("click", async () => {
    const name = document.getElementById("club_name").value.trim();
    const info = document.getElementById("club_information").value.trim();
    const limit = document.querySelector(".memeber-input").value.trim();
    const tags = Array.from(document.querySelectorAll(".tag"))
    .map(tag => tag.firstChild.textContent.trim());
    const image = document.querySelector(".image-upload")

    if (!name || !info || !limit) {
        Popupwrap_empty.classList.add('popup')
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
        if (res.status === 200) {

        const redirectURL = `/clubs/detail/${CLUB_ID}`
            setTimeout(() => {
                window.location.assign(redirectURL);
            }, 0)
            
        }
    } catch (err) {
        Popupwraperror.classList.add('popup')
    }
});


