



// const axios = require('axios');



// const Checkcookie = async () => {
//     const {data} = await axios.get('/checkcookie')
//     console.log(data)
//     if(data.state === 200) {
//         userul.classList.add('activelogin')
//     }
//     else {
//         userul.classList.remove('activelogin')
//     }
// }

// Checkcookie();


// console.log('sssssss')

console.log('dddddddddddddddddddddddd')
        
function formatWithOffset(date, offset = '+09:00') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offset}`;
    }
    const data = [];
    document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'timeGridWeek',
      selectable: true,
      editable: true,

      // Trigger when user selects a time slot
      select: function (info) {
        const title = prompt("Enter event title:");
        console.log(info.startStr)
        if (title) {
            data.push({title : title, start : info.startStr, end : info.endStr})
            const newEvent = {
                title: title,
                start: info.startStr,
                end: info.endStr,
            };
            console.log(data)
            
            calendar.addEvent(newEvent);
            
            // 🔄 Send to backend API
          fetch("/api/schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEvent),
          })
          .then(res => res.json())
          .then(data => console.log("Event scheduled:", data));
        }
      },
      eventClick: function(info) {
        if (confirm(`Delete event "${info.event.title}"?`)) {
            // Remove from calendar
            const Title = info.event.title;
            const formattedStart = formatWithOffset(info.event.start, '+09:00');
            console.log('Formatted Start:', formattedStart);
            const formattedEnd = formatWithOffset(info.event.end, '+09:00');
            info.event.remove();
            // data.filter(({eventTitle,eventStart,eventEnd}, index) => {
            //     data.splice(index, 1)
                console.log(Title, formattedStart, formattedEnd)
            // })
            data.forEach((el, index) => {
                if (el.title === Title && el.start === formattedStart && el.end === formattedEnd) {
                    data.splice(index, 1)
                    console.log(data, index)
                } 
            })
            // Also send delete request to backend if needed
            fetch(`/api/delete-event`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: info.event.id }) // You'll need to assign an id when adding events
            });
        }
    }
    });

    calendar.render();
});
    
    // await axios.post('/eventdata', {title : title, start : info.startStr, end : info.endStr})


if(data) {
    console.log(data)
}
imagediv2.onclick = (e) => {
    club_image2.click();
}
imagediv1.onclick = (e) => {
    club_image1.click();
}
imagediv3.onclick = (e) => {
    club_image3.click();
}

function openPostcode() {
    new daum.Postcode({
    oncomplete: function(data) {
        document.getElementById('addr').value = data.address;
    }
    }).open();
}