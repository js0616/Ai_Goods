const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const pool = require("../utils/db");
const { v4 } = require("uuid");

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID : process.env.KAKAO_ID,
        callbackURL : "/user/kakao/callback",
    }, (accessToken, refreshToken, profile, done) => {
        const sql1 = `SELECT * FROM TB_USER WHERE user_id = ? or user_email = ?`;
        pool.query(sql1, [profile.id,profile._json.kakao_account.email], (err, rows) => {
            if(rows.length !== 0){
                done(null, rows[0]);
            }else{
                const user = {
                    user_id : profile.id,
                    user_pw : v4(),
                    user_nick : profile.displayName,
                    user_email : profile._json.kakao_account.email,
                    user_sex : profile._json.kakao_account.gender,
                    user_bitrh : profile._json.kakao_account.birthday,
                    user_class : 1,
                }
                const sql2 = "INSERT INTO TB_USER (user_id,user_pw,user_nick,user_email,user_sex,user_birth,user_class) VALUES (?,?,?,?,?,?,?)";
                pool.query(sql2, Object.values(user), (err, rows) => {
                    if(!err){
                        done(null, user);
                    }else{
                        console.log(err);
                        done(err);
                    }
                })
            }
        });

    }));

};