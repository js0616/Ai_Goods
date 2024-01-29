
// 이미지 드래그 , 크기조절
$(function() {
    $('#wrapper').draggable();
    $('#use_image').resizable();
});

// 이미지 회전
let clickX = 0;
let moveX = 0;   
let lastX = 0;

$('#rot_btn').on('mousedown', (e)=> {
    let isClick = true;

    clickX = e.screenX;

    window.addEventListener('mousemove',(e)=> {
        if(isClick){                    
            
            const nowX = e.screenX;
            moveX = lastX + clickX - nowX;

            $('#wrapper').css({
                'transform': `rotate(${(moveX)/2}deg)`
            })
        }
    })

    window.addEventListener('mouseup', (e)=> {
        if(isClick){
            isClick=false
        }
    })
})


// 이미지 클릭시 보이고 
$('#use_image').on('click', ()=>{
    $('#img-space').css({'overflow':'visible'})
    $('#use_image').css({'opacity':'0.7'})
    $('#rot_btn').removeClass('hide')
})

// 배경 클릭시 빈 공간에 들어감
$('body').on('click', ()=>{
    $('#img-space').css({'overflow':'hidden'})
    $('#use_image').css({'opacity':'1'})
    $('#rot_btn').addClass('hide')
})




$(function(){
    $("#capBtn").on("click", function(){
        // 캡쳐할 영역을 html2canvas로 캡쳐하여 canvas로 변환
        html2canvas(document.querySelector("#back-img")).then(canvas => {
                saveImg(canvas.toDataURL('image/png'),"capture-test.png");
            });
    });

    // 캡쳐된 파일을 저장하는 함수
    function saveImg(uri, filename) { 
        var link = document.createElement('a'); 
        if (typeof link.download === 'string') { 
        link.href = uri; 
        link.download = filename; 
        document.body.appendChild(link); 
        link.click(); 
        document.body.removeChild(link); 
        } else { 
        window.open(uri); 
        } 
    }
    });
