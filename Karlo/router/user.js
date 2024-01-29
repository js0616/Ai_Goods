const express = require("express");
const pool = require("../utils/db.js");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const router = express.Router();
const { signup, login, logout, update, signout } = require("../controllers/user");


// POST /user/signup    회원가입 처리    
router.post("/signup", isNotLoggedIn, signup);

// POST /user/login     로그인 처리      
router.post("/login", isNotLoggedIn, login);

// POST /user/logout    로그아웃 처리    
router.post("/logout", isLoggedIn, logout);

// POST /user/update    회원 수정 처리
router.post("/update", isLoggedIn, update);

// DELETE /user/signout/{user_id}      회원 탈퇴 처리
router.delete("/signout/:user_id", isLoggedIn, signout);

module.exports = router;