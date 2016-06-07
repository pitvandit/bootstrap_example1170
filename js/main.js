
//Using an object literal for a jQuery feature
var website = {
    init: function( settings ) {
        website.config = {
            //bxslider: '.bxslider',
            //lazyload: 'img.lazy',
            imagefit: '.image-fit',
            sectionfit: '.section-fit, .fixed-fit',
            //fancy: '[rel="lightbox"]',
            //orphans: 'article p',
            //animate: '.animated',
            smoothscroll: '.navbar a, .subnav a, .smoothscroll'
        };
        //allow overriding the default config
        $.extend( website.config, settings );
        website.initNav();
        website.setup();

        setInterval( function() {
            /*website.initFitSection( website.config.sectionfit );
             website.initFitImage( website.config.imagefit );*/
        } , 1000 );
    },
    setup: function( obj ) {
        if( typeof obj == "undefined" ) obj = $('body');
        else obj = $(obj);

        //website.initBxSlider2( obj.find( website.config.bxslider ) );

        website.initFitSection( obj.find( website.config.sectionfit ) );
        website.initFitImage( obj.find( website.config.imagefit ) );

        //website.initLazyLoad( obj.find( website.config.lazyload ) );
        //website.initFancybox( obj.find( website.config.fancy ) );
        //website.initOrphans( obj.find( website.config.orphans ) );
        website.initSmoothScroll( obj.find( website.config.smoothscroll ) );
        //website.initAnimate( obj.find( website.config.animate ) );

    },
    resize: function() {
        website.initFitSection( website.config.sectionfit );
        website.initFitImage( website.config.imagefit );
    },

    //Init all lazy images based on .lazy class
    //Init NAV
    initNav: function( obj ) {

        if( $(".menu-holder").hasClass("init") )
            return;

        $(".menu-holder").addClass("init");

        $(".menu-open").click( function(){

            if ( $(".menu-holder").hasClass("active") ) {
                $(".menu-open").removeClass("active");
                $(".menu-holder").removeClass("active");
                $(".menu-holder").css("height", 0 );
                $(".menu-fade").fadeOut();
            } else {
                $(".menu-open").addClass("active");
                $(".menu-holder").addClass("active");
                $(".menu-holder").css("height", $(".menu-holder .menu-list").outerHeight() );
                $(".menu-fade").fadeIn();
            }

            $('header').mouseleave(function() {
                $(".menu-open").removeClass("active");
                $(".menu-holder").removeClass("active");
                $(".menu-holder").css("height", 0 );
                $(".menu-fade").fadeOut();
            });

            $('header .menu-holder .menu-list a').click(function() {
                $(".menu-open").removeClass("active");
                $(".menu-holder").removeClass("active");
                $(".menu-holder").css("height", 0 );
                $(".menu-fade").fadeOut();
            });


        });


        var didScroll;
        var lastScrollTop = 0;
        var delta = 20;
        var navbarHeight = $('header').outerHeight();

        $(window).scroll(function(event){
            didScroll = true;
        });

        setInterval(function() {
            if (didScroll) {
                hasScrolled();
                didScroll = false;
            }
        }, 250);

        function hasScrolled() {
            var st = $(this).scrollTop();

            // Make sure they scroll more than delta
            if(Math.abs(lastScrollTop - st) <= delta)
                return;

            // If they scrolled down and are past the navbar, add class .nav-up.
            // This is necessary so you never see what is "behind" the navbar.
            if (st > lastScrollTop && st > navbarHeight){
                // Scroll Down
                $('header').addClass('active');
            } else {
                // Scroll Up
                if(st + $(window).height() < $(document).height()) {
                    $('header').removeClass('active');
                }
            }

            lastScrollTop = st;
        }

    },


    //Init all bxsliders based on .bxslider class
    initBxSlider2: function( obj ) {

        $('.bxslider').bxSlider({
            mode: 'slide',
            captions: false
        });
    },

    //Init all bxsliders based on .bxslider class
    initBxSlider: function( obj ) {
        if( !$.isFunction( $.fn.bxSlider ) ) return;

        $(obj).each(function( id, el ) {
            if( !$(el).parent().hasClass('bx-viewport') ){
                console.log('bxslider');
                $(el).bxSlider( $.extend({
                    onSlideBefore: function( slideElement ){ $(slideElement).find('img').trigger("scroll"); },
                    onSlideAfter: function( slideElement ){ $(slideElement).find('img').trigger("scroll"); },
                    pagerCustom: '#bx-pager',
                    speed: 1000,
                    easing: 'easeInOutExpo',
                    useCSS: false
                }, $(el).data() ) );
            }
        });
    },




    //Init all lazy images based on .lazy class
    initLazyLoad: function( obj ) {
        if( !$.isFunction( $.fn.lazyload ) ) return;

        $(obj).show().lazyload({
            threshold : 200,
            failure_limit   : 10,
            effect : "fadeIn",
            skip_invisible : true
        });
        //$(obj).filter(":in-viewport").trigger('scroll');
    },

    //Init all fancy box galleries based on rel=lightbox-gallery
    initFancybox: function( obj ) {
        if( !$.isFunction( $.fn.fancybox ) ) return;

        $(obj).each(function( id, el ) {

            $( el ).fancybox( $.extend( {
                'transitionIn'	: 'elastic',
                'transitionOut'	: 'elastic',
                'titlePosition' : 'inside',
                'overlayColor' : '#fff',
                'overlayOpacity' : '0.9',
                'padding' : '2',
                'iframe' : {
                    scrolling : 'auto',
                    preload   : false
                }
            }, $(el).data() ) );

        });

        website.initFancyboxGallery();
    },

    //Init all fancy box galleries based on rel=lightbox-gallery
    initFancyboxGallery: function() {
        if( !$.isFunction( $.fn.fancybox ) ) return;

        var obj = '.fancybox';
        var galleries = {};
        $(obj).each(function( id, el ) {

            var rel = $(el).attr('rel');
            eval( 'galleries.'+rel+' = "'+rel+'"' );
        });

        $.each( galleries, function( id, el ) {

            el = $( '[rel='+el+']' );
            $( el ).fancybox( $.extend( {
                'transitionIn'	: 'elastic',
                'transitionOut'	: 'elastic',
                'titlePosition' : 'inside',
                'overlayColor' : '#fff',
                'overlayOpacity' : '0.9',
                'padding' : '2',
                'iframe' : {
                    scrolling : 'auto',
                    preload   : false
                }
            }, $(el).data() ) );

        });
    },

    //Init all fancy box galleries based on rel=lightbox-gallery
    initFitImage: function( obj ) {
        $(obj).each(function( id, el ) {
            website.fitImage( $(el), $(el).find('img') );
        });
    },

    //Init all section-fit
    initFitSection: function( obj ) {

        $(obj).each(function( id, el ) {

            if( $(window).width() < 600 && $(el).hasClass('no-mobilefit') ) {
                $(el).css("height", "auto" );
            }else{
                //toHeight = 'auto';

                var wHeight = $(window).height();
                var toHeight = wHeight;
                var headerHeight = $('header').height();
                var scrollMarginH = $(el).closest('section').find('.scroll-margin').actual('height');
                var percentHeight = $(el).data('percent-height');
                var percentHeightSm = $(el).data('percent-height-sm');
                var percentHeightXs = $(el).data('percent-height-xs');

                var pixelHeight = $(el).data('px-height');
                var pixelHeightSm = $(el).data('px-height-sm');
                var pixelHeightXs = $(el).data('px-height-xs');

                var offsetHeight = $(el).data('offset-height');

                var getHeight = function(h, ph) {
                    return parseInt( h * (ph/100) );
                };

                if( percentHeight ) {
                    toHeight = getHeight(wHeight,percentHeight);
                    headerHeight = getHeight(headerHeight, percentHeight);
                };
                if( $(window).width() < 979 && percentHeightSm ) {
                    toHeight = getHeight(wHeight,percentHeightSm);
                    headerHeight = getHeight(headerHeight,percentHeight);
                };
                if( $(window).width() < 768 && percentHeightXs ) {
                    toHeight = getHeight(wHeight,percentHeightXs);
                    headerHeight = getHeight(headerHeight, percentHeightXs);
                }

                if( pixelHeight ) {
                    toHeight = pixelHeight;
                    headerHeight = 0;
                };
                if( $(window).width() < 979 && pixelHeightSm ) {
                    toHeight = pixelHeightSm;
                    headerHeight = 0;
                };
                if( $(window).width() < 768 && pixelHeightXs ) {
                    toHeight = pixelHeightXs;
                    headerHeight = 0;
                }

                //offset height if needed
                if( offsetHeight ) {
                    toHeight = toHeight - offsetHeight
                };

                //if( $(window).height() < 450 ) toHeight = '450';
                //if( !$(el).hasClass('no-header') ) toHeight = toHeight-scrollMarginH;
//                if( $(window).width() < 600 && $(el).hasClass('no-mobilefit') ) toHeight = 'auto';

                //SET HEIGHT
                $(el).css("height", toHeight );
            }

        });
    },


    fitImage: function( imgFrame, imgObj ){

        $(imgFrame).css('position', 'relative' );
        $(imgFrame).css('overflow', 'hidden' );
        $(imgObj).css('position', 'absolute' );
        $(imgObj).css('max-width', 'none' );

        var frameW = $(imgFrame).actual( 'width' );
        var frameH = $(imgFrame).actual( 'height' );
        var imgW = $(imgObj).actual( 'width' );
        var imgH = $(imgObj).actual( 'height' );

        ratioW = frameW / imgW;
        ratioH = frameH / imgH;

        if ( ratioW > ratioH ) {
            $(imgObj).css("width", parseInt(frameW));
            $(imgObj).css("height", 'auto' );
        }
        else {
            $(imgObj).css("height", parseInt(frameH));
            $(imgObj).css("width", 'auto' );
        };

        imgW = $(imgObj).actual( 'width' );
        imgH = $(imgObj).actual( 'height' );

        $(imgObj).css("top", (frameH-imgH)/2);
        $(imgObj).css("left", (frameW-imgW)/2);

        $( imgObj ).load(function() { website.fitImage( imgFrame, imgObj ); });
    },

    initOrphans: function( obj ){
        $( obj ).each(function( id, el ) {
            content = $(el).html();
            if( content && content.length > 0) {
                replaced = content.replace(/(\s)([\S])[\s]+/g, "$1$2&nbsp;");
                $(el).html(replaced);
            }
        });
    },

    //Init smooth scroll plugin
    initSmoothScroll: function( obj ) {
        if( !$.isFunction( $.fn.smoothScroll ) ) return;

        $(obj).smoothScroll( { easing: 'easeInOutExpo', speed: 1000 } );
    },

    //Init  contact
    initEmails: function() {

        $('a[href^="mailto:"]').each(function( id, el ) {

            var email_encoded = $( el ).attr('href').replace('mailto:', '');
            var email = $.rot13( email_encoded );
            console.log( email_encoded + " -> " + email );

            $( el ).attr('href', $( el ).attr('href').replace( email_encoded , email) );
            $( el ).html( $( el ).html().replace( email_encoded , email) );

            if( $( el ).attr('data-original-title') )
                $( el ).attr('data-original-title', $( el ).attr('data-original-title').replace( email_encoded , email) );
        });
    },

    initAnimate: function( obj ) {

        $(obj).each(function( id, el ) {

            var type = $(el).data('animate-class');
            if( typeof type === "undefined" ) type = 'fadeIn';
            var delay = $(el).data('animate-delay');

            var event = $(el).data('animate-event');
            var eventType = $(el).data('animate-event-class');
            var event2 = $(el).data('animate-event2');
            var eventType2 = $(el).data('animate-event-class2');

            if( event ){
                $(el).bind( event, function() {
                    $(el).removeClass( type ).removeClass( eventType ).removeClass( eventType2 ).addClass( eventType );
                });
            }
            if( event2 ){
                $(el).bind( event2, function() {
                    console.log( event2 );
                    console.log( eventType2 );
                    $(el).removeClass( type ).removeClass( eventType ).removeClass( eventType2 ).addClass( eventType2 );
                });
            }

            if( delay ){
                $(el).css('opacity', 0);
                setTimeout( function(){
                    $(el).css('opacity', 1);
                    $(el).removeClass( type ).addClass( type);
                }, delay );
            }
            else{
                $(el).removeClass( type ).addClass( type);
            }
        });
    },


};

$( document ).ready( website.init );
$( document ).load( website.setup );
$( window ).resize( website.resize );
$( window ).scroll( website.scroll );