/* global $ */
const menuLeft = $('#slide-side-menu')
const showLeftPush = $('#show-left-push')
const body = $('body')
const menuIcon = $('#menu-icon')
let openStatus = false

showLeftPush.click(function () {
  slide(!openStatus)
})

const slide = function (status) {
  if (status) {
    body.addClass('application-toright')
    menuLeft.addClass('side-menu-open')
    menuIcon.removeClass('fa-bars')
    menuIcon.addClass('fa-times')
  } else {
    body.removeClass('application-toright')
    menuLeft.removeClass('side-menu-open')
    menuIcon.addClass('fa-bars')
    menuIcon.removeClass('fa-times')
  }
  openStatus = status
}
