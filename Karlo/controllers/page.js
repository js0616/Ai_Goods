const pool = require("../utils/db");

exports.renderMain = (req, res) => {
    res.render("index");
};

exports.renderLogin = (req, res) => {
    req.session.url = req.get('referer');
    res.render("login");
};

exports.renderSignup = (req, res) => {
    res.render("Join");
};

exports.renderUpdate = (req, res) => {
    const user_id = req.user.user_id;
    const sql = "select * from TB_USER where user_id = ?";
    pool.query(sql, [user_id], function (err, rows) {
        if (!err) {
            return res.render("user-update", { user: rows[0] })
        }
    });
};

exports.renderProfile = (req, res) => {
    const user_id = req.user.user_id
    pool.query("SELECT * FROM TB_USER WHERE user_id = ?", user_id, (err, rows) => {
        pool.query("SELECT * FROM TB_MAKE_IMG WHERE user_id = ?", user_id, (err2, rows2) => {
            pool.query("SELECT O.*, P.product_name FROM TB_ORDER O JOIN TB_PRODUCT P ON (O.product_number = P.product_number) WHERE user_id = ?", user_id, (err3, rows3) => {
                res.render("mypage", { user : rows[0], images : rows2, orders : rows3, today: new Date()});
            })
        })
    })
};

exports.renderMypageModi = (req,res) =>{
    const user_id = req.user.user_id
    pool.query("SELECT * FROM TB_USER WHERE user_id = ?", user_id, (err, rows) => {
        res.render('mypage_modi', {user : rows[0]})
    })
}

exports.renderMypageImg = (req,res) => {
    const user_id = req.user.user_id
        pool.query("SELECT * FROM TB_MAKE_IMG WHERE user_id = ?", user_id, (err2, rows2) => {
            res.render('mypage_img', {images :rows2})
    })
}

exports.renderMypageOrder = (req,res) => {
    const user_id = req.user.user_id
    pool.query("SELECT O.*, P.product_name FROM TB_ORDER O JOIN TB_PRODUCT P ON (O.product_number = P.product_number) WHERE user_id = ?", user_id, (err3, rows3) => {
        res.render("mypage_order", { orders : rows3, today: new Date()});
    })
}



exports.renderProfileImage = (req, res) => {
    pool.query("SELECT * FROM TB_MAKE_IMG WHERE user_id = ?", req.user.user_id, (err, rows) => {
        res.render("profile-image", { images: rows });
    });
};
exports.renderProfileOrder = (req, res) => {
    pool.query("SELECT * FROM TB_ORDER WHERE user_id = ?", req.user.user_id, (err, rows) => {
        res.render("profile-order", { orders: rows, today: new Date() });
    });
};
// 회원 관련 기능 끝

exports.renderText2Img = (req, res) => {
    res.render("text2img");
};

exports.renderImg2Img = (req, res) => {
    res.render("img2img");
};

exports.renderMakeImg = (req,res) =>{
    res.render('make_img');
}

exports.renderImageList = (req, res) => {
    let page = parseInt(req.query.page) || 1;                           // 회원이 요청한 페이지 (값이 없으면 1);
    if(page < 0 || Object.is(parseInt(req.query.page), NaN)){
        return res.redirect(`/images?page=1&order=${req.query.order}`);                                                     // 페이지 값이 0이하면 1
    }
    const sql1 = "SELECT COUNT(*) cnt FROM TB_MAKE_IMG WHERE img_share = 1";
    pool.query(sql1, (err, rows) => {
        const cnt = rows[0].cnt;                                                                // 사진 총 개수
        const limit = 20;                                                                        // 페이지에 나와야 하는 사진의 수
        const offset = (page-1) * limit > cnt ? cnt-limit : (page-1) * limit;                   // 페이지의 인덱스(-1) * limit
        let totalPage = cnt % limit > 0 ? parseInt(cnt / limit) + 1 : parseInt(cnt / limit);    // 총 페이지 수
        if(cnt <= limit){           // 총 개수가 페이지에 나와야하는 개수보다 적다면 총 페이지는 1 
            totalPage = 1;
        }
        if(page > totalPage){      // 요청받은 페이지가 총 페이지보다 크면 총 페이지로 재할당
            return res.redirect(`/images?page=${totalPage}&order=${req.query.order}`);
        }
        let start = page-2;         // 첫 인덱스    (현재 페이지의 양 옆 +-2)
        let end = page+3;           // 마지막 인덱스
        if(start <= 0){             // 첫 인데스가 3이하라면(시작 1, 마지막 5)
            start = 1;
            end = 6;
        }
        if(end > totalPage){        // 마지막 인덱스가 총 페이지의 (시작:총페이지의-4, 마지막:총페이지)
            start = totalPage - 4;
        end = totalPage + 1;
    }
        let order = req.query.order || 0;   // 정렬방식 할당 (값이 없으면 0)
        let sql2 = "";                      
        if (order == 0){    // 정렬방식 0 : 좋아요 순
            sql2 = "SELECT * FROM TB_MAKE_IMG WHERE img_share = 1 ORDER BY img_like DESC, date DESC LIMIT ? OFFSET ?";
        }else if(order == 1){   // 정렬방식 1 : 최신 순
            sql2 = "SELECT * FROM TB_MAKE_IMG WHERE img_share = 1 ORDER BY date DESC LIMIT ? OFFSET ?";
        }else{  // 0,1 둘 다 아닐 경우 값이 없는 상태로 다시 redirect
            return res.redirect(`/images?page=${page}`);
        }
        pool.query(sql2, [limit, offset], (err, rows) => {
            res.render("make_img", { images: rows, page : page, start : start, end : end, order : order});
        });
    })
};

exports.renderImageList2 = (req, res) => {
    let page = parseInt(req.query.page) || 1;                           // 회원이 요청한 페이지 (값이 없으면 1);
    if(page < 0 || Object.is(parseInt(req.query.page), NaN)){
        return res.redirect(`/scroll-images?page=1&order=${req.query.order}`);                                                     // 페이지 값이 0이하면 1
    }
    const sql1 = "SELECT COUNT(*) cnt FROM TB_MAKE_IMG WHERE img_share = 1";
    pool.query(sql1, (err, rows) => {
        const cnt = rows[0].cnt;                                                                // 사진 총 개수
        const limit = 20;                                                                        // 페이지에 나와야 하는 사진의 수
        const offset = (page-1) * limit > cnt ? cnt-limit : (page-1) * limit;                   // 페이지의 인덱스(-1) * limit
        let totalPage = cnt % limit > 0 ? parseInt(cnt / limit) + 1 : parseInt(cnt / limit);    // 총 페이지 수
        if(cnt <= limit){           // 총 개수가 페이지에 나와야하는 개수보다 적다면 총 페이지는 1 
            totalPage = 1;
        }
        if(page > totalPage){      // 요청받은 페이지가 총 페이지보다 크면 총 페이지로 재할당
            return res.redirect(`/scroll-images?page=${totalPage}&order=${req.query.order}`);
        }
        let start = page-2;         // 첫 인덱스    (현재 페이지의 양 옆 +-2)
        let end = page+3;           // 마지막 인덱스
        if(start <= 0){             // 첫 인데스가 3이하라면(시작 1, 마지막 5)
            start = 1;
            end = 6;
        }
        if(end > totalPage){        // 마지막 인덱스가 총 페이지의 (시작:총페이지의-4, 마지막:총페이지)
            start = totalPage - 4;
        end = totalPage + 1;
    }
        let order = req.query.order || 0;   // 정렬방식 할당 (값이 없으면 0)
        let sql2 = "";                      
        if (order == 0){    // 정렬방식 0 : 좋아요 순
            sql2 = "SELECT * FROM TB_MAKE_IMG WHERE img_share = 1 ORDER BY img_like DESC, date DESC LIMIT ? OFFSET ?";
        }else if(order == 1){   // 정렬방식 1 : 최신 순
            sql2 = "SELECT * FROM TB_MAKE_IMG WHERE img_share = 1 ORDER BY date DESC LIMIT ? OFFSET ?";
        }else{  // 0,1 둘 다 아닐 경우 값이 없는 상태로 다시 redirect
            return res.redirect(`/scroll-images?page=${page}`);
        }
        pool.query(sql2, [limit, offset], (err, rows) => {
            //res.render("make_img", { images: rows, page : page, start : start, end : end, order : order});
            res.json(rows);
        });
    })
};

exports.renderImage = (req, res) => {
    const sql = "SELECT * FROM TB_MAKE_IMG WHERE img_share = 1 AND make_img_number = ?";
    pool.query(sql, [req.params.make_img_number], (err, rows) => {
        res.render("images", { images: rows });
    });

};
// 이미지 관련 기능 끝



exports.renderGoodsList = (req, res) => {
    pool.query("SELECT * FROM TB_PRODUCT", (err, rows) => {
        // 모든 상품에서 따로 상품 타입 배열 생성
        let types = [...new Set(rows.map(product => product.product_type.replace(" ", "")))];
        let result = {};
        // 상품 타입 배열 순회하면서 해당 타입별 상품을 따로 배열에 담음
        types.forEach(data => result[data] = rows.filter(product => product.product_type.replace(" ", "") == data.replace(" ", "")));
        console.log(result);
        res.render("goods", { products: result, types : types });
    });
};

exports.renderGoods = (req, res) => {
    const product_number = req.params.product_number;
    const sql = "SELECT * FROM TB_PRODUCT WHERE product_number = ?";
    pool.query(sql, product_number, (err, rows) => {
        const sql2 = "SELECT * FROM TB_REVIEW WHERE product_number = ?";
        pool.query(sql2, product_number, (err2, rows2) => {
            return res.render("goods_detail", { product: rows[0], reviews : rows2 });
        })
    });
}

exports.renderOrderForm = (req, res) => {
    const sql = "SELECT * FROM TB_MAKE_IMG WHERE user_id = ?";
    pool.query(sql, req.user.user_id, (err, rows) => {
        const sql2 = "SELECT * FROM TB_PRODUCT WHERE product_number = ?";
        pool.query(sql2, req.params.product_number, (err2, rows2) => {
            let imgArr = [];
            rows.map(row => imgArr.push(row.img_url));
            res.render("buy_goods", { imgs: imgArr, product: rows2[0] });
        })
    });
};

exports.renderReviewForm = (req, res) => {
    res.render("review", { product_number: req.params.product_number });
};