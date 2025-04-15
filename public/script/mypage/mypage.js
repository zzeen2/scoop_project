


const eventdate = new Date(participantdate.createdAt).toISOString().slice(0, 10);
for (let i = 0; i < participantdate.length; i++) {
    document.addEventListener('DOMContentLoaded', function() {
        const calendarEl = document.getElementById('calendar')
        const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: [
            {
                title : participantdate.participants_id_fk,
                backgroundColor: '#9d2933',
                date: 'eventdate'
            }
        ]
        })
        calendar.render()
    })
}


myclub.onclick = (e) => {
    const Content = document.querySelectorAll('.Contentul')
    const Content1 = document.querySelectorAll('.Contentul1')
    if(myclub.classList.contains('Active')) {
        
        return;
    }
    else {
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