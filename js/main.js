'use strict'
$(document).ready(function($) {
    $( "#datapicker" ).datepicker();
    // chechbox customiza
    $('.cont-form__item-ckeckbox').prop('indeterminate', true);

    // button to up scroll 
    $('.button-up').click(function() {$('body,html').animate({scrollTop:0},1000);});

    // ledftbar menu toggler
    $('.htop .logo').on('click', 'a', function(event) {
        event.preventDefault();
        /* Act on the event */
        $('.leftbar').toggleClass('small');
        $('.leftbar a[data-toggle="tooltip"], .leftbar div[data-toggle="tooltip"]').tooltip()
    });
    //  leftbar toggle avtive navigation
    var url = window.location.href; 
     $(".leftbar-nav li a").each(function() {
        if(url == (this.href)) { 
          $(this).closest("li").addClass("active");
        }
    });
    // dream filter buttons 
    $('.dream-filter-btns').on('click', 'button', function() {
        var tabIndex = $(this).index();
        var tabClosest = $(this).closest('.my-dreams').find('.card.dreams');
        var tabBody = tabClosest.find('.dream-table');

        $(this).removeClass('bg-none').siblings('button').addClass('bg-none');
        tabBody.eq(tabIndex).fadeIn(300).siblings('.dream-table').fadeOut(300);
        return false;
      });

    $('.dream-filter-btns button:eq(0)').click();


    // filter and Add active class to the current button (highlight it)
    var btnContainer = $(".filter-bnts");
    var filterBtns = btnContainer.find(".filter-bt");
    filterBtns.click(function(event) {
        /* Act on the event */
        $(this).addClass('active');
        $(this).siblings('button').removeClass('active');

        if (this.id == 'f-all') {
            $('.filter-gropus > div.event-bl').fadeIn(450);
        } else {
            var $el = $('.' + this.id).fadeIn(450);
            $('.filter-gropus > div.event-bl').not($el).hide();
        }
    });
    filterBtns.eq(0).click();

    // chat tleft bar toggler 

    $('.toggle-chat-left').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        $(this).find('i').toggleClass('fa-times');
        $('.chat-wrapper__left').toggleClass('active').stop();
    });
    $('.chat-main, .chat-form').mousedown(function(event) {
        /* Act on the event */
        $('.toggle-chat-left').find('i').removeClass('fa-times');
        $('.chat-wrapper__left').removeClass('active');
    });

    // btn for like and pin 

    $('.post-btn button').click(function(event) {
        $(this).toggleClass('clicked');
    });

    //  script for windows wodth max-width 767
    var max767px = window.matchMedia('all and (max-width: 767px)');
    if (max767px.matches) {
        $('.htop .logo a').click();
    }
});