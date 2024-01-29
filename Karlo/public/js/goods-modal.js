     //이미지 선택 모달
     //모달창 이미지 출력용 함수
     let data = [{url:'/generated/generated_img2text_20230808143832.png'},{},{},{},{},{},{url:'/generated/generated_img2text_20230808084521.png'},{},{},{},{},{},{url:'/generated/generated_img2text_20230807155535.png'},{},{}] // DB에서 가져올 데이터
     let totalImg = data.length; //총 이미지 수
     let imgNum = 6;    //한 페이지에 출력되는 이미지 수 
     let blockNum = 10; //한번에 출력될 수 있는 최대 블록 수
     let totalBlock = totalImg%6 == 0 ? tatalImg/6 : parseInt(totalImg/6)+1;  //블록의 총 수
     let currentBlock = 1; // 현재 블록의 위치
     
     function blockBtn(){
         for(let i=1;i<=totalBlock;i++){
             $('.block').append(`<button>${i}</button>`)
         }
     }
     function printImg(block){
         $('.img_con').empty();
         for(let i=1+6*(block-1);i<=6+6*(block-1);i++){
             $('.img_con').append(`<img src="${data[i-1].url}" alt="" onclick="imgSelect(this)">`)
         }
     }
     //모달창 이미지 출력
     blockBtn()
     $('#prev_block').on('click',()=>{
         if(currentBlock==1){
             return;
         }else{
             currentBlock -= 1
             printImg(currentBlock)
         }
     })
     $('#next_block').on('click',()=>{ 
         if(currentBlock==totalBlock){
             return;
         }else{
             currentBlock += 1
             printImg(currentBlock)
         }
     })
     //이미지 컨테이너로 불러오기
     function imgSelect(e){
         console.log($(e).attr('src'))
         $('#use_image').attr('src', $(e).attr('src'))
         $('.img_modal').addClass('hide')
     }
      //이미지 모달창 on/off
      $('#select_img').on('click',()=>{
        printImg(1)
        currentBlock=1
         $('.img_modal').removeClass('hide')
     })
     $('#close_img_modal').on('click',()=>{
         $('.img_modal').addClass('hide')
     })



     //주문 모달창 on/off
     $('#prd_order').on('click',()=>{
        $('.order_modal').removeClass('hide')
     })
     $('#close_order_modal').on('click',()=>{
        $('.order_modal').addClass('hide')
     })

     // 모달창 움직이기    
     $('.img_modal').draggable();
     $('.order_modal').draggable();
