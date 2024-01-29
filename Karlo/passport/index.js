const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const pool = require("../utils/db");

module.exports = () => {
    passport.serializeUser((user, done) => {
        console.log("serializeUser..........");
        done(null, user.user_id);
    });

    passport.deserializeUser((user_id, done) => {
        const sql = "SELECT * FROM TB_USER WHERE user_id = ?";
        pool.query(sql, user_id, (err, rows) => {
            if(!err){
                done(null, rows[0]);
            }else{
                done(err);
            }
        });
    });



    local();
    kakao();
};