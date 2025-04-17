

document.addEventListener('DOMContentLoaded', () => {
    try {
        const data = window.mypageData;
        console.log(data)
        const events = data.map(item => {
            return {
              title: item.participant_id,
              backgroundColor: '#ffa600',
              date: new Date(item.createdAt).toISOString().slice(0, 10)
            }
          })
          
          const calendarEl = document.getElementById('calendar')
          const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: events
          })
          
          calendar.render()
          
    } catch (error) {
        console.log('afffff')
        const calendarEl = document.getElementById('calendar')
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth'
            })
            calendar.render()
            }
    })
// document.addEventListener('DOMContentLoaded', () => {
//     const calendarEl = document.getElementById('calendar')
//     const calendar = new FullCalendar.Calendar(calendarEl, {
//     initialView: 'dayGridMonth'
//     })
//     calendar.render()
// })
document.addEventListener('DOMContentLoaded', () => {
    const Participantdata = document.querySelectorAll('.fc-event-title-container');
    if(Participantdata) {
        for (let i = 0; i < Participantdata.length; i++) {
            
            Participantdata[i].onclick = (e) => {
                participantwrap.classList.add('active1')
            }
        }
        Participantbtn.onclick = (e) => {
            participantwrap.classList.remove('active1')
        }
    }

})
function toggleLike() {
    const icon = document.getElementById('heartIcon');

    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid');
    }
    myclub.onclick = (e) => {
        const Content = document.querySelectorAll('.Contentul')
        const Content1 = document.querySelectorAll('.Contentul1')
    if(myclub.classList.contains('Active')) {
        
        return;
    }
    else {
        mycalendar.classList.remove('Active')
        calendardiv.classList.remove('Active')
        myactivities.classList.remove('Active')
        Content.forEach(el => {
            el.classList.add('Active')
            console.log(el.classList)
        });
        Content1.forEach(el => {
            el.classList.remove('Active')
            console.log(el.classList)
        });
        myclub.classList.add('Active')

    }
}

myactivities.onclick = (e) => {
    const Content = document.querySelectorAll('.Contentul')
    const Content1 = document.querySelectorAll('.Contentul1')
    
    if(myactivities.classList.contains('Active')) return;
    else {
        mycalendar.classList.remove('Active')
        calendardiv.classList.remove('Active')
        myclub.classList.remove('Active')
        Content.forEach(el => {
            el.classList.remove('Active')
            console.log(el.classList)
        });
        Content1.forEach(el => {
            el.classList.add('Active')
            console.log(el.classList)
        });
        myactivities.classList.add('Active')
    }
}

mycalendar.onclick = (e) => {
    const Content = document.querySelectorAll('.Contentul')
    const Content1 = document.querySelectorAll('.Contentul1')
    if(calendar.classList.contains('Active')) return;
    else {
        myactivities.classList.remove('Active')
        myclub.classList.remove('Active')
        Content.forEach(el => {
            el.classList.remove('Active')
        });
        Content1.forEach(el => {
            el.classList.remove('Active')
        });
        calendardiv.classList.add('Active')
        mycalendar.classList.add('Active')
    }
}