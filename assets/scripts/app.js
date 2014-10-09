
			var isLoaded            = false,
			    isMobile            = false,
          $fullsize           = jQuery('#fullsize'),
          $fullsizetimer      = jQuery('#fullsizeTimer'),
          $superbgimage       = jQuery('#superbgimage'),
          $superbgimageplayer = jQuery('#superbgimageplayer'),
          $fsg_playbutton     = jQuery('#fsg_playbutton'),
			    $showtitle          = jQuery('#showtitle'),
			    $branding           = jQuery('#branding'),
			    $scanlines          = jQuery('#scanlines');

			if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod'){
				var isMobile = true;
			}
			jQuery(function($){

				// Options for SuperBGImage
				jQuery.fn.superbgimage.options = {
					transition: 1,
					vertical_center: 1,
					slideshow:  1,
					speed: 'normal', // animation speed
					randomimage: 0,
					inlineMode: 0,
					preload: 0,
					slide_interval: 7000, // invervall of animation
										onClick: false, // function-callback click image
					onHide: superbgimage_hide, // function-callback hide image
										onShow: superbgimage_show // function-callback show image
				};

				function checkTitleLeftMargin($div1, $div2){
          var x1 = $div1.offset().left;
          var y1 = $div1.offset().top;
          var h1 = $div1.outerHeight(true);
          var w1 = $div1.outerWidth(true);
          var b1 = y1 + h1;
          var r1 = x1 + w1;
          var x2 = $div2.offset().left;
          var y2 = $div2.offset().top;
          var h2 = $div2.outerHeight(true);
          var w2 = $div2.outerWidth(true);
          var b2 = y2 + h2;
          var r2 = x2 + w2;

          if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
          return true;
				}

				// Show thumnails if option is activated
				jQuery('#fullsize a' + "[rel='" + jQuery.superbg_imgActual + "']").livequery(function(){

						var dataUrl = jQuery(this).attr('data-url');
						window.videoUrl = jQuery.parseJSON( dataUrl );

						if( window.videoUrl.type != "selfhosted" || window.videoUrl.type != "youtube_embed" || window.videoUrl.type != "vimeo_embed" ){
							jQuery('#fullsize a' + "[rel='" + jQuery.superbg_imgActual + "']").expire();
						}

					});

					// function callback on clicking image, show next slide
					function superbgimage_click(img) {
						$fullsize.nextSlide();
						$fullsizetimer.startTimer( 7000 );
					}

					function superbgimage_hide(img) {

            // if page has video no-pointer-class remove it
            if( jQuery('#primary').hasClass('no-pointer-events') ) {
              jQuery('#primary').removeClass('no-pointer-events');
            }

            // hide the play button if visible
            if( !Modernizr.csstransitions ){
              $fsg_playbutton.fadeOut(250);
        		}else{
        		  if( !$fsg_playbutton.hasClass('fsg-playbutton-hide') ) {
          		  $fsg_playbutton.addClass('fsg-playbutton-hide');
          		}
        		}

            // add zIndex class
						jQuery('#main, #page').addClass('zIndex').unbind('click');

						$fsg_playbutton.add( jQuery('#main')).add(jQuery('#page') ).unbind('click touchstart touchend');
						$fullsizetimer.stopTimer();

																		// hide/show title
						jQuery('#showtitle').removeClass('showtitle-visible');
						

					}

					// function callback on showing image
					// get title and display it
					function superbgimage_show(img) {

        		// hide active superbgimage	and show the player iframe
            if( !Modernizr.csstransitions ){
              jQuery('#superbgimage').stop(false, true).fadeIn(250);
        		}else{
        		  jQuery('#superbgimage').removeClass('opacity-hide');
        		}

            // hide the previous loaded video containers
						jQuery('#superbgimageplayer, #superbgplayer').removeClass().addClass('video-hide');

            // remove all the video players from the respective containers
            jQuery('#youtubeplayer, #vimeoplayer, #selfhostedplayer').removeClass().addClass('video-hide').html('');

						jQuery('#main, #page').addClass('zIndex').unbind('click');

						var dataUrl = "";
						window.videoUrl = {};

						// Show scanlines only if not in fullscreen mode
						if( jQuery('#expander').hasClass('slide-up') ){
							if(isMobile === false){

							  if( !Modernizr.csstransitions ){
							    $scanlines.show().stop(false, true).animate({opacity: 1}, 450);
								}else{
  								$scanlines.removeClass('opacity-hide');
								}

							}
						}

						jQuery('#fullsize a' + "[rel='" + jQuery.superbg_imgActual + "']").livequery(function(){

							dataUrl = jQuery(this).attr('data-url');
							window.videoUrl = jQuery.parseJSON(dataUrl);

							// change the background color of the body
							if(window.videoUrl.backgroundcolor != ""){
								jQuery('#superbgimage, #superbgimageplayer ').css({backgroundColor: window.videoUrl.backgroundcolor });
							}

							// add alt tag and ken burns to current fullsize gallery image
							jQuery('#superbgimage img.activeslide')
								.attr('alt', window.videoUrl.excerpt);

							if( window.videoUrl.type == "selfhosted" || window.videoUrl.type == "youtube_embed" || window.videoUrl.type == "vimeo_embed" ){

																jQuery('#fullsize').stopSlideShow();
								
                // resize the superbgimage container
                $superbgimage.superbgResize();

                // block UI to make the thumbnails unclickable until video is loaded
                jQuery.blockUI.defaults.css = {};
                jQuery.blockUI({
                  message: $('#my-loading'),
                  overlayCSS:  {
                    backgroundColor: 'transparent',
                    opacity: .5,
                    cursor: 'wait'
                  }
                });

								$.getScript("http://themes.doitmax.de/wordpress/invictus/wp-content/themes/invictus_3.3.1/js/post-video.js", function(data, textStatus, jqxhr){
									jQuery('#superbgimageplayer, #superbgplayer').removeClass('video-hide');
								})

							}else{

                // hide the play button if visible
                if( !Modernizr.csstransitions ){
                  $fsg_playbutton.fadeOut(250);
            		}else{
            		  if( !$fsg_playbutton.hasClass('fsg-playbutton-hide') ) {
              		  $fsg_playbutton.addClass('fsg-playbutton-hide');
              		}
            		}

                // get back the scanlines
								if( jQuery('#expander').hasClass('slide-up') && isMobile === false ){

  							  if( !Modernizr.csstransitions ){
  							    $scanlines.show().stop(false, true).animate({opacity: 1}, 450);
  								}else{
    								$scanlines.removeClass('opacity-hide');
  								}

								}

								if( jQuery.fn.superbgimage.options.slideshow == 1 ){
									jQuery.fn.superbgimage.options.slide_interval = 7000;
									$fullsizetimer.startTimer( 7000 );
									$fullsize.startSlideShow();
								}

							}

							
  							// change title and show
  							jQuery('#showtitle span.imagetitle a').html( jQuery('#thumbnails a' + "[rel='" + img + "'] img").attr('title') );

                if( $showtitle.size() && $branding.size() ){
                  var collision = checkTitleLeftMargin( $showtitle, $branding );
                  if( collision ) {
                    if( !$showtitle.hasClass('showtitle-left-margin') ) $showtitle.addClass('showtitle-left-margin');
                  }else{
                    if( $showtitle.hasClass('showtitle-left-margin') ) $showtitle.removeClass('showtitle-left-margin');
                  }
                }

  							    							jQuery(window).smartresize(function() {

                    if( $showtitle.size() && $branding.size() ){
                      var collision = checkTitleLeftMargin( $showtitle, $branding );
                      if( collision ) {
                        if( !$showtitle.hasClass('showtitle-left-margin') ) $showtitle.addClass('showtitle-left-margin');
                      }else{
                        if( $showtitle.hasClass('showtitle-left-margin') ) $showtitle.removeClass('showtitle-left-margin');
                      }
                    }

                  })
  							
  							  							if(window.videoUrl.excerpt != ""){
  								jQuery('#showtitle span.imagecaption')
  									.html( window.videoUrl.excerpt ).removeClass('hidden');
  							}else{
  								jQuery('#showtitle span.imagecaption').addClass('hidden');
  							}
  							
                /* change full size gallery title links
                 *
                 * @desc  Shows lightbox videos in a full size gallery
                 * @since Invictus 3.0
                 *
                 */

                if( !jQuery('#responsiveTitle').hasClass('hidden') ){
                  jQuery('#responsiveTitle').addClass('hidden');
                }else{
                  jQuery('#responsiveTitle').removeClass('hidden');
                }

  							if( window.videoUrl.lightbox_video == "true" && window.videoUrl.lightbox_link != "" ) {
                  // change the link on the title and more link for showing a lightbox
                  jQuery('#showtitle div a, #responsiveTitle a').attr({'href': window.videoUrl.lightbox_link, 'target': "", 'data-rel': 'prettyPhoto' });
                }else{
                  // change the title href link or add a lightbox link
    							jQuery('#showtitle div a, #responsiveTitle a').attr({ 'href': window.videoUrl.permalink, 'target' : window.videoUrl.target }).removeAttr('data-rel').unbind('click');
                }

  							jQuery('#showtitle .imagecount').html(img + '/' + jQuery.superbg_imgIndex);

                // check if more link should be shown
                if(window.videoUrl.more != 'true'){
                  jQuery('#showtitle .more').hide();
                }else{
                  jQuery('#showtitle .more').show();
                }

  							if(jQuery(window).width() >= 481){
  								jQuery('#showtitle').addClass('showtitle-visible');
  							}else{
    							jQuery('#showtitle').removeClass('showtitle-visible');
  							}

  						
						})

					}

					// stop slideshow
					jQuery('#fullsizeStop').livequery('click',function() {

						jQuery.fn.superbgimage.options.slideshow = 0;
						$fullsizetimer.stopTimer();
						jQuery('#fullsize').stopSlideShow();

						// show/hide controls
						jQuery(this).parent().toggleClass('fullsize-playing');
						// jQuery('#thumbnails a.fullsize-start').show();

						return false;

					});

					// start slideshow
					jQuery('#fullsizeStart:not(.disabled)').livequery('click', function() {

						jQuery.fn.superbgimage.options.slideshow = 1;

						// show/hide controls
						//  jQuery('#thumbnails a.fullsize-stop').show();
						jQuery(this).parent().toggleClass('fullsize-playing');

						jQuery.fn.superbgimage.options.slide_interval = 7000;
						$fullsizetimer.startTimer( 7000 );
						$fullsize.startSlideShow();

						return false;

					});

				jQuery('body').addClass('fullsize-gallery');

			});
