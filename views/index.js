



const axios = require('axios');



const Checkcookie = async () => {
    const {data} = await axios.get('/checkcookie')
    console.log(data)
    if(data.state === 200) {
        userul.classList.add('activelogin')
    }
    else {
        userul.classList.remove('activelogin')
    }
}

Checkcookie();


console.log('sssssss')