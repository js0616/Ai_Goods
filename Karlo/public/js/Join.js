const form = document.getElementById('form');
const username = document.getElementById('name');
const email = document.getElementById('user_email');
const password = document.getElementById('password');
const password2 = document.getElementById('passwordCheck');

form.addEventListener('submit', e => {
    e.preventDefault();

    if(validateInputs()){
        form.submit();
    }
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    if (usernameValue === '') {
        setError(username, '이름을 입력해 주세요.');
        return false;
    } else {
        setSuccess(username);
    }

    if (emailValue === '') {
        setError(email, '이메일을 입력해 주세요.');
        return false;

    } else if (!isValidEmail(emailValue)) {
        setError(email, '다른 이메일을 입력해 주세요.');
        return false;

    } else {
        setSuccess(email);
    }

    if (passwordValue === '') {
        setError(password, '비밀번호를 입력해 주세요.');
        return false;

    } else if (passwordValue.length < 8) {
        setError(password, '8자 이상 입력해 주세요.');
        return false;

    } else {
        setSuccess(password);
    }

    if (password2Value === '') {
        setError(password2, '비밀번호를 다시 입력해 주세요.');
        return false;

    } else if (password2Value !== passwordValue) {
        setError(password2, '비밀번호가 일치하지 않습니다.');
        return false;
    } else {
        setSuccess(password2);
    }

    return true;
};


// 우편 - 주소

function address(){
    new daum.Postcode({
        oncomplete: function(data) {
            $('#zonecode').val(data.zonecode)
            $('#address').val(data.address)
        }
    }).open();
}
$('#zonecode').on('click',()=>{
    address()
    $('#address_detail').focus()
})
$('#address').on('click',()=>{
    address()
    $('#address_detail').focus()
})
