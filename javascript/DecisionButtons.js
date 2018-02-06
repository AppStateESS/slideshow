const makeActive = function() {
  let slideTimeout = setTimeout(function(){
    $('.controls').addClass('active')
    window.clearTimeout(slideTimeout)
  }, 3000)
}

makeActive()

Reveal.addEventListener('slidechanged', function(event){
  $('.controls').removeClass('active')
  makeActive();
})
