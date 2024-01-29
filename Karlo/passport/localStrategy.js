const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const pool = require("../utils/db");

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'user_id',
        passwordField: 'user_pw',
        passReqToCallback: false,
    }, (user_id, user_pw, done) => {
        const query = "SELECT * FROM TB_USER WHERE user_id = ?";
        pool.query(query, [user_id], (err, result) => {
            if (err || result.length === 0) {
                console.error("User not found:", err);
                done(null, false, { message: 'User not found' });
            } else {
                // 비밀번호 검증
                bcrypt.compare(user_pw, result[0].user_pw, (bcryptErr, bcryptResult) => {
                    if (bcryptErr || !bcryptResult) {
                        done(null, false, { message: 'Incorrect password' });
                    }else{
                        console.log("User logged in successfully!");
                        done(null, result[0]);
                    }
                });
            }
        });
    }));

};