const express = require("express");
const pool = require("../utils/db.js");
const { isLoggedIn } = require("../middlewares");
const router = express.Router();

// POST /order  주문 등록 기능
router.post("/", isLoggedIn, (req, res) => {
    console.log("..................");
    const {
        product_number,
        design_url,
        count,
        price,
        addr,
        addr_de,
        addr_post,
        addree,
        phone,
    } = req.body;
    const sql = "INSERT INTO TB_ORDER (user_id, product_number, design_url, count, price, addr, addr_de, addr_post, addree, phone, order_status, date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
    pool.query(
        sql,
        [
            req.user.user_id,
            product_number,
            design_url,
            count,
            price,
            addr,
            addr_de,
            addr_post,
            addree,
            phone,
            "주문확인",
            new Date(),
        ],
        (err, rows) => {
            console.log(err);
            res.send(`<script>alert("주문성공");window.location.href("user/${req.user.user_id}/order");</script>`)
        });
});

router.patch("/:order_number",isLoggedIn, (req, res) => {
    const sql = "UPDATE TB_ORDER SET order_status = ? where order_number = ?";
    pool.query(sql, [req.body.order_status, req.params.order_number], (err, rows) => {
        res.end();
    });

})

module.exports = router;