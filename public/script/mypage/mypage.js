


document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar')
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      events: [
        {
            title : '참여',
            backgroundColor: '#9d2933',
            date: '2025-04-05'
        },{
            title : '참여',
            backgroundColor: '#9d2933',
            date: '2025-03-30'
        }
    ]
    })
    calendar.render()
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