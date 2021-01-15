/* ********************************** */
/* Custom Scripts */
/* ********************************** */
(function ($) {
    "use strict";

    /*==========================================================================
        :: All Essential Functions
    ==========================================================================*/

    function inputAnimate() {
        if ($('.rs-form').length) {
            // Check if has value
            $('.rs-input').each(function () {
                if ($(this).val()) {
                    $(this).parent(".rs-form").addClass('animate');
                }
            })

            // Events
            $('.rs-input').focus(function () {
                $(this).parent(".rs-form").addClass('animate');
            });

            $('.rs-label').on('click', function () {
                $(this).siblings(".rs-input").focus();
            });

            $(".rs-input").focusout(function () {
                if ($(this).val() == '' || $(this).val() == null) {
                    $(this).parent(".rs-form").removeClass('animate');
                };
            });

            $(".rs-input").on('change keyup paste', function (e) {
                // alert($(this).val());
                if ($(this).val() == '' || $(this).val() == null) {
                    $(this).parent(".rs-form").addClass('error');
                } else {
                    $(this).parent(".rs-form").removeClass('error');
                    $(this).parent(".rs-form").addClass('animate');
                }
            });

            $('.type-toggle').on('click', function(){
                var input =  $(this).siblings('.rs-input');
                if(input.val()){
                    if(input.attr('type') == 'text'){
                       input.attr('type', 'password');
                       $(this).removeClass('mdi-eye-off');
                       $(this).addClass('mdi-eye');
                    }else{
                        input.attr('type', 'text');
                        $(this).removeClass('mdi-eye');
                        $(this).addClass('mdi-eye-off');
                    }
                }
            })
        }
    }

    function menuHide() {
        $('main').removeClass('overlay');
        $('.menu-toggler').removeClass('show');
        setTimeout(function () {
            $('.menu-toggler').removeClass('animate');
        }, 300);
        $('.site-header .menu-area').removeClass('show');
        $('body').css({
            'overflow-y': 'visible'
        })
    }

    function menuShow() {
        $('main').addClass('overlay');
        $('.menu-toggler').addClass('animate');
        setTimeout(function () {
            $('.menu-toggler').addClass('show');
        }, 400);
        $('.site-header .menu-area').addClass('show');
        $('body').css({
            'overflow-y': 'hidden'
        })
    }

    function menuToggler() {
        var btn = $('.menu-toggler');
        if (btn.length) {
            btn.on('click', function () {
                if (btn.hasClass('animate')) {
                    menuHide();
                } else {
                    menuShow();
                }

            })

            var specifiedElement = document.querySelector('.site-header');
            document.addEventListener('click', function (event) {
                if ($('.menu-area').hasClass('show')) {
                    var isClickInside = specifiedElement.contains(event.target);
                    if (!isClickInside) {
                        menuHide();
                    }
                }
            });

        }
    }

    function pageLoader() {
        if ($('.preloader').length) {
            $('.preloader').addClass('visible');
        }
    }

    function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }

    function validateEmail(field) {
        var el = field;
        var wrapper = el.parents('.rs-form');
        var value = el.val();
        var message = '';
        var error = true;
        if (value) {
            if (isEmail(value)) {
                error = false;
                removeError(wrapper);
            } else {
                message = 'Invalid Email Address';
            }
        } else {
            message = 'Email Address Required.';
        }
        if (error) {
            setError(wrapper, message);
            return false;
        } else {
            return true;
        }
    }

    function validateInput(field, message) {
        var el = field;
        var wrapper = el.parents('.rs-form');
        if ($(el).val()) {
            if (field === 'email') {
                return validateEmail();
            } else {
                removeError(wrapper);
                return true;
            }
        } else {
            setError(wrapper, message);
            return false;
        }
    }

    function setError(wrapper, message) {
        wrapper.addClass('error');
        wrapper.append('<span class="help-block"></span>')
        wrapper.find('.help-block').text(message);
    }

    function removeError(wrapper) {
        wrapper.removeClass('error');
    }

    function contactFormSubmit() {
        var form = $('.contact-form');
        form.on('submit', (e) => {
            // e.preventDefault();
            if (form.length) {
                var inquiry = form.find('#inquiry');
                var name = form.find('#name');
                var email = form.find('#email');
                var message = form.find('#message');

                if (
                    validateInput(inquiry, 'Required') &&
                    validateInput(name, 'Required') &&
                    validateEmail(email, 'Required') &&
                    validateInput(message, 'Required')
                ) {
                    return true;
                } else {
                    return false;
                }
            }
        })
    }

    /*==========================================================================
        WHEN DOCUMENT LOADING
    ==========================================================================*/
    $(window).on('load', function () {
        inputAnimate();
        
        // will load on end
        pageLoader();

    });

    /*==========================================================================
        WHEN WINDOW SCROLL
    ==========================================================================*/
    $(window).scroll(function () {
        //
    });

    /*==========================================================================
        WHEN WINDOW RESIZE
    ==========================================================================*/
    $(window).on("resize", function () {
        //
    });
    
})(window.jQuery);




