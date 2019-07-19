function closeActiveElement() {
    $('#fixed_overlay').removeClass('active');
    $('html').removeClass('no_scroll');
    $('body').removeClass('no_scroll');
    bodyScrollLock.clearAllBodyScrollLocks();
};


function scrollLock(selector) {
    return bodyScrollLock.disableBodyScroll(document.querySelector(selector));
}; // iOS blocking body scroll function.