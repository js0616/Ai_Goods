// index.js
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan"); // morgan : 로그 관련 모듈
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");

dotenv.config();
const router = require("./router/router.js");
const userRouter = require("./router/user.js");
const imgRouter = require("./router/image.js");
const orderRouter = require("./router/order");
// const goodsRouter = require("./router/goods");
const passportConfig = require("./passport");
const exp = require("constants");

const app = express();
passportConfig();
app.set("view engine", "html");
app.set("port", process.env.PORT || 3000);
nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/generated", express.static(path.join(__dirname, "public/generated")));
app.use("/imgs", express.static(path.join(__dirname, "public/imgs")));
app.use("/upload", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 세션 설정
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.COOKIE_SECRET, // 세션 데이터 암호화에 사용되는 비밀 키
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // HTTPS를 사용하는 경우 true로 변경
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", router);
app.use("/user", userRouter);
app.use("/images", imgRouter)
app.use("/order", orderRouter);

// 오류 처리
app.use(function (request, response, next) {
  const error = new Error(
    `${request.method} ${request.url} 라우터가 존재하지 않음`
  );
  error.status = 404;
  next(error);
});
app.use(function (error, request, response, next) {
  response.locals.message = error.message;
  response.locals.error = error;
  response.status(error.status || 500);
  response.render("error");
});
Port = app.get("port");
app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});
