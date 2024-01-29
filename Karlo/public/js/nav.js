//내비바 활성화, 비활성화
$('#nav_image').on('mouseover',function(){
    $(this).children('.hide').css('display','block')
})
$('.nav_sub').on('mouseout',function(){
    $(this).css('display','none')
})