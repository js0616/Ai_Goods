// router/router.js
const express = require("express");
const pool = require("../utils/db.js");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const passport = require("passport");
const router = express.Router();
const {
  renderMain,
  renderLogin,
  renderSignup,
  renderUpdate,
  renderText2Img,
  renderImg2Img,
  renderMakeImg,
  renderProfile,
  renderProfileImage,
  renderProfileOrder,
  renderImageList,
  renderImage,
  renderGoodsList,
  renderGoods,
  renderOrderForm,
  renderReviewForm,
  renderMypageModi,
  renderMypageImg,
  renderMypageOrder,
  renderImageList2,
  
} = require("../controllers/page");

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

/* 메인, 로그인, 회원가입, 회원 수정 */
// GET /        index.html 렌더링
router.get("/", renderMain);
// GET /login   login.html 렌더링
router.get("/login", isNotLoggedIn, renderLogin);
// GET /signup  signup.html 렌더링
router.get("/Join", isNotLoggedIn, renderSignup);
// GET /update  user-update.html 렌더링
router.get("/update", isLoggedIn, renderUpdate);
// GET  /user/kakao      카카오 로그인 처리   
router.get("/user/kakao", passport.authenticate("kakao"));
// GET  /user/kakao/callback
router.get("/user/kakao/callback", (req, res, next) => { 
  res.locals.url = req.session.url.substring(req.session.url.indexOf("/", 7)) || "/"; 
  next();
  }, 
  passport.authenticate("kakao", {
    failureRedirect: "/?error=카카오 로그인 실패",
}), (req, res) => {
    res.redirect(res.locals.url);
});
router.get("/main", (req, res) => {
  res.render("main");
})



/* 프로필 */
// GET /user/{user_id}        profile.html 렌더링
router.get("/user/:user_id", isLoggedIn, renderProfile);
// GET /user/{user_id}/image  profile-image.html 렌더링
router.get("/user/:user_id/image", isLoggedIn, renderProfileImage);
// GET /user/{user_id}/order  profile-order.html 렌더링
router.get("/user/:user_id/order", isLoggedIn, renderProfileOrder);

// mypage 분해
router.get('/user/:user_id/mymodi', isLoggedIn, renderMypageModi);
router.get('/user/:user_id/myimage', isLoggedIn, renderMypageImg);
router.get('/user/:user_id/myorder', isLoggedIn, renderMypageOrder);

/* 이미지 */
// GET /images                      images.html 렌더링
router.get("/images",  renderImageList);
// GET /images                      images.html 렌더링
router.get("/scroll-images",  renderImageList2);
// GET /images/{make_img_number}    images.html 렌더링
router.get("/images/:make_img_number", renderImage);
// GET /text2img                    test2img.html 렌더링
router.get("/text2img", isLoggedIn, renderText2Img);
// GET /img2img                     img2img.html 렌더링
router.get("/img2img", isLoggedIn, renderImg2Img);

// GET /make_img
router.get('/make_img', renderMakeImg);

/* 굿즈 */
// GET /goods.html                     goods.html 렌더링
router.get("/goods", renderGoodsList);
// GET /goods/{product_number}         products-detail.html 렌더링
router.get("/goods/:product_number", renderGoods);

/* 주문 */
// GET /goods/{product_number}/write   order.html 렌더링
router.get("/goods/:product_number/write", isLoggedIn, renderOrderForm);


/* 리뷰 */
// GET /review/{product_number}/write  review.html 렌더링
router.get("/review/:product_number/write", isLoggedIn, renderReviewForm);

// POST /review     리뷰 작성 기능
router.post("/review", isLoggedIn, (req, res) => {
  const {
    product_number,
    rate,
    content,
    img_url
  } = req.body;
  const sql = "SELECT * FROM TB_ORDER WHERE user_id = ? and product_number = ?";
  pool.query(sql, [req.user.user_id, product_number], (err, rows) => {
    if(rows.length !== 0){
      const sql2 = "INSERT INTO TB_REVIEW (user_id, product_number, content, img_url, rate) VALUES (?, ?, ?, ?, ?)";
      pool.query(sql2, [req.user.user_id, product_number, content, img_url, rate], (err2, rows2) => {
        res.send(`<script>alert("리뷰 작성 성공");window.location.replace("/goods/${product_number}");</script>`);
      });
    }
  });
  console.log(req.body);
});

try {
  fs.readdirSync('uploads');
}catch(error){
  fs.mkdirSync('uploads');
}
const upload = multer({
  storage : multer.diskStorage({
    destination(req, file, cb){
      cb(null, 'uploads/');
    },
    filename(req, file, cb){
      const ext = path.extname(file.originalname);
      cb(null, 'review_img_' + Date.now() + ext);
    },
  }),
  limits : { fileSize : 5 * 1024 * 1024 },
});
const upload2 = multer({
  storage : multer.diskStorage({
    destination(req, file, cb){
      cb(null, 'public/generated');
    },
    filename(req, file, cb){
      const ext = path.extname(file.originalname);
      cb(null, 'design_img_' + Date.now() + ext);
    },
  }),
  limits : { fileSize : 5 * 1024 * 1024 },
});
// POST /review-img   후기 이미지 업로드 기능
router.post('/review-img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ img_url : `/upload/${req.file.filename}` });
});

// POST /design-img   후기 이미지 업로드 기능
router.post('/design-img', isLoggedIn, upload2.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ img_url : `/generated/${req.file.filename}` });
});


module.exports = router;
