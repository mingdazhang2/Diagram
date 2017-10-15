/* jshint undef: true, unused: true, esversion: 6, asi: true */

// Resize iframe height to fit its content
function resizeIframe () {
  let iframe = document.getElementById('quiz')
  iframe.style.height = (iframe.contentWindow.document.body.offsetHeight + 20) + 'px'
}

let resizeHandler = function (event) {
    // Wait 500ms to allow iframe contents to be rendered
  setTimeout(function () {
    resizeIframe()
  }, 500)
}

// Resize iframe height when browser dimension is changed (including mobile rotation) to avoid hiding its content
window.addEventListener('resize', resizeHandler, false)
window.addEventListener('orientationchange', resizeHandler, false)
