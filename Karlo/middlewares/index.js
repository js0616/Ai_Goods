exports.isLoggedIn = (request, response, next) => {
    
    if(request.isAuthenticated()){
        next();
    }else{
        response.status(404).send(`<script>alert('로그인 필요');window.location.replace('/login');</script>`);
    }
};
exports.isNotLoggedIn = (request, response, next) => {
    if(!request.isAuthenticated()){
        next();
    }else{
        const message = encodeURIComponent("로그인한 상태입니다.");
        response.redirect(`/?message=${message}`);
    }
};