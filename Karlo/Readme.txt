"KaKao Karlo API 이용한 이미지 생성 기능 설명"


현재 구현 되어 있는 기능은 TEXT TO IMAGE 로 1024x1024 사이즈의 이미지 1개를 prompt 를 통해 생성 할 수 있습니다.



[파일 디렉토리 구성 설명]
controllers : 페이지 이동하는 모듈, 데이터 로직 모듈이 저장되어 있는 폴더
|-image.js : 이미지 관련 기능을 하는 모듈을 모아놓은 js파일
|-page.js : 페이지 렌더링 기능을 하는 모듈을 모아놓은 js파일
|-order.js : 주문 관련 기능을 하는 모듈을 모아놓은 js파일
|-user.js : 사용자 관련 기능을 하는 모듈을 모아놓은 js파일
middlewares : 로그인했는지 검사하는 모듈이 저장되어 있는 폴더
models : DB와 서버가 통신할 때 사용되는 객체 모듈이 저장되어 있는 폴더
node_modules : node.js 구성 모듈이 저장되어 있는 폴더
passport : 로컬 및 소셜 로그인을 통해 세션을 부여와 관리하는 모듈이 저장되어 있는 폴더
|-localStrategy.js : 로컬 로그인시 실행되는 js파일
|-kakaoStrategy.js : 카카오 로그인시 실행되는 js파일
public : 이미지 파일과 html 페이지 파일 렌더링에 필요한 파일이 저장되는 폴더
|-css: css 파일이 저장되는 로컬폴더
|-generated : 생성된 이미지가 저장되는 로컬폴더
|-imgs: 로고, 기본 이미지가 저장되는 로컬폴더
|-js : view에서 필요한 js 파일이 저장되는 로컬폴더
router : 미들웨어 기능을 하는 js파일이 들어있는 폴더
|-router.js: 페이지 이동 및 기능 , 데이터 베이스 저장에 관련된 기능적 코드들이 들어있는 js파일
|-image.js : 이미지 관련 기능이 들어있는 js파일
|-order.js : 주문 관련 기능이 들어있는 js파일
|-user.js : 회원 관련 기능이 들어있는 js파일
uploads : 리뷰 작성 시 업로드되는 이미지 파일이 저장되는 폴더
utils
|-db.js : 기본적인 연결 설정에 관한 js파일, (데이터베이스 주소, 데이터베이스 이름, 데이터베이스 연결계정 이름, 암호 )
views : 사용자에게 보여질 html 파일들이 저장되어 있는 폴더
.env : 서버에서 사용되는 환경변수를 모아놓은 파일
app.js : node.js 서버를 실행시키는 파일 (http://localhost:3000)
app.py : flask 서버를 실행시키는 파일 (http://127.0.0.1:5000)
package-lock.json
package.json
config.py : api 키 값이 저장된 파일 (절대 수정 금지!)
Readme.txt



[테스트를 위한 실행순서 설명]
1. node.js 서버 실행 : 페이지 이동 및 데이터베이스 저장, 플라스크서버와의 연결 등을 노드 서버로 처리하고 있습니다. ( 실행 명령어 : nodemon app.js)(실행 디렉토리: AiGoods\Karlo> nodemon app.js)

2. 노드 서버가 실행되면 http://localhost:3000 링크가 터미널 콘솔에 보일텐데 "ctrl + 링크클릭"을 하면 index.html 페이지가 실행됩니다.(로그인 페이지)

3. flask 서버 실행: karlo 모델을 실행시키기 위한 서버, 실행명령어(python app.py) 통해 실행시킵니다. 따로 링크를 http://127.0.0.1:5000 를 클릭할 필요는 없고 실행만 시켜주시면 됩니다.
(실행 디렉토리: AiGoods\Karlo> python app.py)

4. 로그인 페이지에서 signup 링크를 클릭하고 회원가입으로 이동해서 계정을 생성한후 회원가입을 성공하면 로그인페이지로 이동합니다.
5. 로그인 페이지에서 가입한 계정을 통해 로그인을 하면 home.html 로 이동됩니다. prompt에 명령어를 입력하고 Execute 를 클릭합니다. 로컬폴더에 생성된 이미지가 저장이 됩니다.
여기서 prompt에 명령어를 입력하는 예시는 "연꽃, 반고흐 스타일" 이라고 하시면 연꽃에 대한 사진을 반고흐 스타일로 생성해 줍니다. 다만 스타일을 따로 지정해 주지 않아도 됩니다(필수 사항이 아님)

6. 이미지 생성이 성공하면 /execute-command 페이지에서 다음과 같은 예시의 결과값이 나타납니다.
{
    "file_path": "public/images/generated_image_20230802225027.png",
    "image_url": "https://mk.kakaocdn.net/dna/karlo/image/2023-08-02/22/fc586330-384d-412e-b6a7-36ea9404585e.webp?credential=smxRqiqUEJBVgohptvfXS5JoYeFv4Xxa&expires=1690984847&signature=3Hb7W5cOTVYh%2BbAf6m%2BSDnLREhs%3D"
}
터미널 콘솔에는 다음과 같은 예시값이 나타납니다
{
  user_id: 'test',
  command: '연꽃, 모네 스타일',
  image_filename: 'public/images/generated_image_20230802225027.png'
}


[데이터 베이스 연결]
db.js 파일의 코드를 수정한다.

const dbConfig = {
  host: '', //데이터베이스 호스트네임
  port:, //데이터베이스 포트번호
  user: '', //데이터베이스 계정이름
  password: '', //데이터베이스 계정암호
  database: '',  //데이터베이스 이름
};


