$(function() {
    if($( "#wpadminbar" ).length){
      $('#enlonger_hook').height($(window).height()-$('.footer-light').position().top-$('.footer-light').innerHeight()+$( "#wpadminbar" ).innerHeight())
    }
    else{
      $('#enlonger_hook').height($(window).height()-$('.footer-light').position().top-$('.footer-light').innerHeight())
    }
});