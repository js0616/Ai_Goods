
const LoginBox = document.getElementById('LoginBox')
const LoginBtn = document.getElementById('LoginBtn')
const error = document.getElementById('error')

LoginBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const username = LoginBox.username.value;
    const password = LoginBox.password.value;
    
    LoginBox.submit();
    
});

// HTML에서 소셜 로그인 버튼을 클릭할 때 실행되는 함수
function handleSocialLogin(provider) {
    console.log("kakao...");
    // 소셜 로그인 URL로 리디렉션
    window.location.href = `/user/${provider}`;
}

// 각 소셜 로그인 버튼에 클릭 이벤트 리스너 추가
const kakaoBtn = document.getElementById('kakaoBtn');

kakaoBtn.addEventListener('click', (event) => {
    event.preventDefault();
    handleSocialLogin('kakao')});

// 모달
const btnID = document.getElementById('FindIdLink');
const btnPW = document.getElementById('FindPwLink')
const modal = document.getElementById('modalWrap');
const modal2 = document.getElementById('modalWrap2');
const closeBtn = document.getElementById('closeBtn');
const closeBtn2 = document.getElementById('closeBtn2');

btnID.onclick = function () {
    modal.style.display = 'block';
}
btnPW.onclick = function () {
    modal2.style.display = 'block';
}

closeBtn.onclick = function () {
    modal.style.display = 'none';
}
closeBtn2.onclick = function () {
    modal2.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if(event.target == modal2){
        modal2.style.display='none';
    }
}

// id찾기 번호 인증 api 연결
const mobileBtn = document.getElementById('mobileBtn')

mobileBtn.onclick = function(){

}
// pw찾기 이메일 인증 api연결
const resetPwBtn = document.getElementById('resetPwBtn')
resetPwBtn.onclick = function(){
    
}