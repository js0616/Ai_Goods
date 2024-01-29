const express = require("express");
const router = express.Router();
const pool = require("../utils/db");
const multer = require("multer");
const axios = require("axios");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { isLoggedIn } = require("../middlewares");
const fs = require("fs");

// DELETE  /images/{make_img_number}        이미지 삭제하기
router.delete("/:make_img_number", isLoggedIn, (req, res) => {
  if (typeof req.user !== "undefined") {
    // 세션에 id가 없다면
    const sql1 = "SELECT user_id FROM TB_MAKE_IMG WHERE make_img_number = ?";
    pool.query(sql1, [req.params.make_img_number], (err, rows) => {
      if (rows[0].user_id != req.user.user_id) {
        // 세션 id와 이미지 소유자의 id와 다르다면
        return res.sendStatus(403);
      } else {
        // 같다면
        const sql2 = "DELETE FROM TB_MAKE_IMG WHERE make_img_number = ?";
        pool.query(sql2, [req.params.make_img_number], (err, rows) => {
          console.log("삭제 성공");
          res.end();
        });
      }
    });
  } else {
    res.sendStatus(401);
  }
});

// PATCH  /images/{make_img_number}         이미지 좋아요, 공개범위 설정
router.patch("/:make_img_number", isLoggedIn, (req, res) => {
  let sql =
    "UPDATE TB_MAKE_IMG SET img_like = img_like + 1 WHERE make_img_number = ?";
  if (Object.keys(req.body)[0] == "img_share") {
    sql =
      "UPDATE TB_MAKE_IMG SET img_share = ABS(img_share - 1) WHERE make_img_number = ?";
  }
  pool.query(sql, [req.params.make_img_number], (err, rows) => {
    res.end();
  });
});

// 이미지 생성 관련 부분
const flaskServerUrl = "http://127.0.0.1:5000";
// POST  /images/text2img       text2img 기능
router.post("/text2img", isLoggedIn, async (req, res) => {
  const prompt = req.body.prompt;
  const user_id = req.user.user_id;
  const negative_prompt = req.body.negative_prompt;
  const prior_num_inference_steps = parseInt(
    req.body.prior_num_inference_steps
  );
  const guidance_scale = parseFloat(req.body.guidance_scale);
  const samples = req.body.samples;

  try {
    const flaskResponse = await fetch(`${flaskServerUrl}/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        user_id,
        negative_prompt,
        prior_num_inference_steps,
        guidance_scale,
        samples,
      }),
    });

    const imageData = await flaskResponse.json();
    const generatedImages = imageData.generated_images;

    // "public" 부분을 제외하고 새로운 이미지 경로 생성
    const modifiedImages = generatedImages.map((image) => {
      const newPath = image.image_path.replace("public", "");
      return { ...image, image_path: newPath };
    });

    console.log(modifiedImages);
    res.render("text2img-success", {
      generatedImages: modifiedImages,
      prompt: prompt,
      negative_prompt: negative_prompt,
    });
  } catch (error) {
    console.error("Error while communicating with Flask server:", error);
    res.status(500).send("Error occurred while generating the image.");
  }
});
// POST  /images/save-data-text2img      text2img 저장 기능
router.post("/save-data-text2img", isLoggedIn, (req, res) => {
  const user_id = req.user.user_id;
  const prompt = req.body.prompt;
  const ne_prompt = req.body.negative_prompt;
  const imageUrl = req.body.imageUrl;
  console.log({ imageUrl, prompt, user_id, ne_prompt });
  const insertQuery = `INSERT INTO TB_MAKE_IMG (user_id, img_url, prompt,ne_prompt) VALUES (?, ?, ?,?)`;
  const values = [user_id, imageUrl, prompt, ne_prompt];

  pool.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("Error executing INSERT query:", err);
      return res
        .status(500)
        .redirect(
          `/text2img?message=${encodeURIComponent(
            "Error saving data in the database."
          )}`
        );
    }
    //
    return res
      .status(200)
      .redirect(
        `/text2img?message=${encodeURIComponent("Data saved in the database.")}`
      );
  });
});
// POST /images/img2img-success     img2img 기능
router.post(
  "/img2img-success",
  isLoggedIn,
  upload.single("file_img"),
  async (req, res) => {
    const image_file = req.file;
    const user_id = req.user.user_id;
    const i2i_prompt = req.body.i2i_prompt;
    const i2i_ne_prompt = req.body.i2i_ne_prompt;
    const samples = req.body.samples;
    console.log({ image_file, user_id, i2i_prompt, i2i_ne_prompt });

    try {
      const base64Image = image_file.buffer.toString("base64");
      // 이미지 파일 데이터를 Base64로 인코딩

      const flaskServerUrl = "http://127.0.0.1:5000";

      const postData = {
        i2i_image: base64Image,
        i2i_prompt: i2i_prompt,
        i2i_ne_prompt: i2i_ne_prompt,
        samples: samples,
      };

      const response = await axios.post(
        `${flaskServerUrl}/process-image`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      const i2iData = response.data;
      const processImages = i2iData.process_images;

      const process_modifiedImages = processImages.map((image) => {
        const newPath = image.image_path.replace("public", "");
        return { ...image, image_path: newPath };
      });
      console.log(process_modifiedImages);
      res.render("img2img-success", {
        process_modifiedImages: process_modifiedImages,
        i2i_prompt: i2i_prompt,
        i2i_ne_prompt: i2i_ne_prompt,
      });
    } catch (error) {
      console.error("Error while communicating with Flask server:", error);
      res.status(500).send("Error occurred while generating the image.");
    }
  }
);
// POST  /images/save-data-img2img      img2img 저장 기능
router.post("/save-data-img2img", isLoggedIn, (req, res) => {
  const user_id = req.user.user_id;
  const prompt = req.body.i2i_prompt;
  const imageUrl = req.body.imageUrl;
  const ne_prompt = req.body.i2i_ne_prompt;
  console.log({ imageUrl, prompt, user_id, ne_prompt });
  const insertQuery = `INSERT INTO TB_MAKE_IMG (user_id, img_url, prompt,ne_prompt) VALUES (?, ?, ?,?)`;
  const values = [user_id, imageUrl, prompt, ne_prompt];

  pool.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("Error executing INSERT query:", err);
      return res
        .status(500)
        .redirect(
          `/img2img?message=${encodeURIComponent(
            "Error saving data in the database."
          )}`
        );
    }
    //
    return res
      .status(200)
      .redirect(
        `/img2img?message=${encodeURIComponent("Data saved in the database.")}`
      );
  });
});

module.exports = router;
