document.addEventListener("DOMContentLoaded", function () {

    const calendarEl = document.getElementById("calendar");
    let selectedRange = null;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ko',
        timeZone: 'local',
        selectable: true,
        select: function (info) {
            if (selectedRange) {
                selectedRange.remove();
            }
            selectedRange = calendar.addEvent({
                title: "선택됨",
                start: info.startStr,
                end: info.endStr,
                allDay: true,
                display: 'background',
                backgroundColor: '#ffd700'
            });
            document.getElementById('selected_start_date').value = info.startStr;
            document.getElementById('selected_end_date').value = info.endStr;
        }
    });

    calendar.render();

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
            Popupwraperrordate.classList.add('popup')
            return;
        }

        if (!eventName || !eventInfo || !location || !maxParticipants) {
            Popupwrap_empty.classList.add('popup')
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

        try {
            const response = await axios.post(`/clubs/detail/${CLUB_ID}/events`, eventData);
            Popupwrap.classList.add('popup')
            if (response.status === 200) {
                const redirectURL = `/clubs/detail/${CLUB_ID}`;
                console.log("이동할 주소:", redirectURL);
                ok.onclick = (e) => {
                    window.location.assign(redirectURL);
                }
            }
        } catch (error) {
            Popupwraperror.classList.add('popup')
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

document.addEventListener("DOMContentLoaded", function () {
    eventcancel_btn.onclick = (e) => {
        location.href = `/clubs/detail/${CLUB_ID}`
    }
})

document.getElementById('ok').addEventListener('click', function() {
    document.getElementById('Popupwrap').classList.remove('popup');

    const redirectURL = `/clubs/detail/${CLUB_ID}`;
    window.location.assign(redirectURL);
});

document.getElementById('errorOk').addEventListener('click', function() {
    document.getElementById('Popupwraperror').classList.remove('popup');
});

document.getElementById('dateErrorOk').addEventListener('click', function() {
    document.getElementById('Popupwraperrordate').classList.remove('popup');
});

document.getElementById('emptyOk').addEventListener('click', function() {
    document.getElementById('Popupwrap_empty').classList.remove('popup');
});

const popups = [
    { wrapId: 'Popupwrap', popupClass: 'Popup' },
    { wrapId: 'Popupwraperror', popupClass: 'Popuperror' },
    { wrapId: 'Popupwraperrordate', popupClass: 'Popuperrordate' },
    { wrapId: 'Popupwrap_empty', popupClass: 'Popup_empty' }
];

popups.forEach(popup => {
    const wrap = document.getElementById(popup.wrapId);
    if (wrap) {
        wrap.addEventListener('click', function(e) {
        
            if (!e.target.closest('.' + popup.popupClass)) {
                wrap.classList.remove('popup');
            }
        });
    }
});
