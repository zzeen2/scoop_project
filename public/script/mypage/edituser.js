document.addEventListener('DOMContentLoaded', () => {
    Userdetailform.onsubmit = async (e) => {
        e.preventDefault();
        const {age : {value : agevalue}, 
        gender : {value : gendervalue},
        location : {value :locationvalue},
        content : {value : contentvalue}} = e.target;
        console.log({agevalue, gendervalue, locationvalue, contentvalue}, 'asdfffffffffffff')
        
        if(agevalue.trim() === '' || gendervalue.trim() === '' || locationvalue === '' || contentvalue === '') {
            Userdetailwrap.classList.add('popup');
            return
        }
        const {data} = await axios.post('/Edituser', {agevalue, gendervalue, locationvalue, contentvalue})
        console.log(data,'mypage')
        if(data.state === 200) {
            console.log(data.state)
            location.href = '/mypage'
        }
        else {
            location.href = '/error'
        }

    }
    
})
function openPostcode() {
    new daum.Postcode({
    oncomplete: function(data) {
        document.getElementById('addr').value = data.address;
    }
    }).open();
}
