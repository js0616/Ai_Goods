const bcrypt = require("bcrypt");
const passport = require("passport");
const pool = require("../utils/db");

// 회원가입
exports.signup = (req, res) => {
    const {
        user_id,
        user_pw,
        user_nick,
        user_phone,
        user_addr,
        user_addr_de,
        user_post,
        user_email,
        user_sex,
        user_age,
        user_birth,
    } = req.body;

    // 비밀번호 해싱
    const saltRounds = 10;
    bcrypt.hash(user_pw, saltRounds, (err, hash) => {
        if (err) {
            console.error("Error while hashing password:", err);
            return res.redirect("/join"); // 실패시 signup 페이지로 이동
        }

        // 데이터베이스에 회원 정보 저장
        const query =
            "INSERT INTO TB_USER (user_id, user_pw, user_nick,user_phone,user_addr,user_addr_de, user_post,user_email,user_sex,user_age,user_birth) VALUES (?, ?, ?,?,?,?,?,?,?,?,?)";
        pool.query(
            query,
            [
                user_id,
                hash,
                user_nick,
                user_phone,
                user_addr,
                user_addr_de,
                user_post,
                user_email,
                user_sex,
                user_age,
                user_birth,
            ],
            (err, result) => {
                if (err) {
                    console.error("Error while signing up:", err);
                    return res.redirect("/signup"); // 실패시 signup 페이지로 이동
                }
                console.log("User signed up successfully!");
                return res.redirect("/login"); // 성공시 login 페이지로 이동
            }
        );
    });
};// 회원가입 끝

// 로그인
exports.login = (req, res, next) => {
    const url = req.session.url.substring(req.session.url.indexOf("/", 7)) || "/";
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.log(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/login?error=${info.message}`);
        }
        return req.login(user, () => {
            return res.redirect(url);
        })
    })(req, res, next);
};// 로그인 끝

// 로그아웃
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Error while destroying session:", err);
            return res.sendStatus(500);
        }
        console.log("User logged out successfully!");
        return res.sendStatus(200);
    });
}; // 로그아웃 끝

// 회원 정보 수정
exports.update = (req, res) => {
    let query = 
    "UPDATE TB_USER SET user_phone=?, user_post=?, user_addr=?, user_addr_de=?, user_age=?, user_birth=? WHERE user_id = ?";
    const {
        user_phone,
        user_post,
        user_addr,
        user_addr_de,
        user_age,
        user_birth,
    } = req.body;
    let data = [
        user_phone,
        user_post,
        user_addr,
        user_addr_de,
        user_age,
        user_birth,
    ]
    if(req.user.user_class == 0){
        const {
            user_pw,
            user_email,
            user_nick,
        } = req.body;
        query = "UPDATE TB_USER SET user_pw=?, user_nick=?,user_email=?,user_phone=?,user_post=?,user_addr=?, user_addr_de=?, user_age=?,user_birth=? WHERE user_id = ?";
        data.unshift(user_pw, user_nick, user_email);
    }
    data.push(req.user.user_id);
    const saltRounds = 10;

    bcrypt.hash(typeof(req.body.user_pw) === 'undefined' ? '0' : req.body.user_pw, saltRounds, (err, hash) => {
        if (err) {
            console.error("Error while hashing password:", err);
            return res.redirect(`/user/${req.user.user_id}`); // 실패시 signup 페이지로 이동
        }
        // 데이터베이스에 회원 정보 저장
        if((typeof(req.body.user_pw) !== 'undefined')){
            data[0] = hash;
        }
        pool.query(
            query,
            data,
            (err, rows) => {
                return res.send(`<script>alert('수정 성공');window.location.replace('/user/${req.user.user_id}/mymodi');</script>`);
            });
    });
};// 회원 정보 수정 끝

// 회원 탈퇴 (카카오 api 연결 끊기도 해야하는데 어려워서 미구현..)
exports.signout = (req, res) => {
    if(req.params.user_id == req.user.user_id){                 // 세션에 저장된 id와 맞는지
        const sql = "DELETE from TB_USER where user_id = ?";
        pool.query(sql, [req.params.user_id], (err, rows) => {  // db 삭제
            req.logout((err) => {                               // 로그아웃
                if (err) {
                    console.error("Error while destroying session:", err);
                    return res.sendStatus(500);
                }
                return res.sendStatus(200);
            });
        });
    }else{
        return res.sendStatus(403);
    }
}; // 회원 탈퇴 끝