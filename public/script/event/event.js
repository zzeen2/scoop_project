document.addEventListener("DOMContentLoaded", function () {

    const calendarEl = document.getElementById("calendar");
    let selectedRange = null;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ko',
        timeZone: 'local',
        selectable: true,
        select: function (info) {
            // 이전 선택 제거
            if (selectedRange) {
                selectedRange.remove();
            }

            // 선택 범위 표시
            selectedRange = calendar.addEvent({
                title: "선택됨",
                start: info.startStr,
                end: info.endStr,
                allDay: true,
                display: 'background',
                backgroundColor: '#ffd700'
            });

            // 시작,종료일 저장 > html에 숨겨진 필드
            document.getElementById('selected_start_date').value = info.startStr;
            document.getElementById('selected_end_date').value = info.endStr;
        }
    });

    calendar.render();

    // 등록 버튼 클릭 이벤트
    document.getElementById("ok_btn2").addEventListener("click", async function (e) {
        e.preventDefault();

        const eventName = document.getElementById("event_name1").value.trim();
        const eventInfo = document.getElementById("event_information").value.trim();
        const location = document.getElementById("addr").value.trim();
        const maxParticipants = document.querySelector(".memeber-input").value.trim();
        const guestAllow = document.querySelector("input[name='guest_allow']:checked").value;

        const startDate = document.getElementById("selected_start_date").value;
        const endDate = document.getElementById("selected_end_date").value;

        if (!startDate || !endDate) {
            alert("이벤트 날짜 범위를 선택해주세요.");
            return;
        }

        if (!eventName || !eventInfo || !location || !maxParticipants) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        const eventData = {
            name: eventName,
            description: eventInfo,
            location: location,
            max_participants: parseInt(maxParticipants),
            guest_allow: guestAllow === "yes" ? 1 : 0,
            start_date: startDate,
            end_date: endDate,
            club_id: CLUB_ID
        };

        console.log("event data", eventData);

        try {
            console.log('dfsdfas')
            console.log("CLUB_ID:", CLUB_ID);
            const response = await axios.post(`/clubs/detail/${CLUB_ID}/events`, eventData);
            console.log("리스폰스", response)
            alert("이벤트가 등록되었습니다!");
            console.log(" 리다이렉트", response.status);
            if (response.status === 200) {
                const redirectURL = `/clubs/detail/${CLUB_ID}`;
                console.log("이동할 주소:", redirectURL);

                setTimeout(() => {
                    window.location.assign(redirectURL);
                }, 0);
            }
        } catch (error) {
            console.error("이벤트 등록 오류:", error);
            alert("이벤트 등록 중 오류가 발생했습니다.");
        }
    });
});

function openPostcode() {
    new daum.Postcode({
    oncomplete: function(data) {
        document.getElementById('addr').value = data.address;
    }
    }).open();
}