

document.addEventListener('DOMContentLoaded', () => {
    const data = window.mypageData;
    console.log(data,'asdfasdf')

    console.log(data[0].createdAt)
    for (let i = 0; i < data.length; i++) {
        const eventdate = new Date(data[i].createdAt).toISOString().slice(0, 10);
        console.log (data, eventdate)
      
            const calendarEl = document.getElementById('calendar')
            const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: [
                {
                    title : data[i].participant_id,
                    backgroundColor: '#9d2933',
                    date: eventdate
                }
            ]
            })
            calendar.render()
     
    }
})
document.addEventListener('DOMContentLoaded', () => {
    const Participantdata = document.querySelector('.fc-event-title');
    Participantdata.onclick = (e) => {
        participantwrap.classList.add('active1')
    }
    Participantbtn.onclick = (e) => {
        participantwrap.classList.remove('active1')
    }
})

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