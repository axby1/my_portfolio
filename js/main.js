;(function () {
	
	'use strict';

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	
	var fullHeight = function() {

		if ( !isMobile.any() ) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});
		}
	};

	// Parallax
	var parallax = function() {
		if ($(window).width() > 768) {
			$(window).stellar();
		}
	};

	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						},  k * 100, 'easeInOutExpo' );
					});
					
				}, 50);
				
			}

		} , { offset: '85%' } );
	};



	var goToTop = function() {

		$('.js-gotop').on('click', function(event){
			
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');
			
			return false;
		});

		$(window).scroll(function(){

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});
	
	};

	// Smooth scrolling for navigation
	var smoothScroll = function() {
		$('#mainNavbar a[href^="#"]').on('click', function(e) {
			var target = $(this.getAttribute('href'));
			if (target.length) {
				e.preventDefault();
				$('html, body').stop().animate({
					scrollTop: target.offset().top - 80
				}, 800, 'easeInOutExpo');
				
				// Close mobile menu if open
				$('.navbar-collapse').collapse('hide');
			}
		});
	};

	// Active section highlighting
	var activeSection = function() {
		var navLinks = $('#mainNavbar .nav-link');
		var sectionIds = ['#fh5co-header', '#fh5co-about', '#fh5co-resume', '#fh5co-skills', '#fh5co-work', '#fh5co-started'];

		var setActiveLink = function(targetId) {
			navLinks.removeClass('active');
			$('#mainNavbar a[href="' + targetId + '"]').addClass('active');
		};

		$(window).on('scroll', function() {
			var viewCenter = $(window).scrollTop() + ($(window).height() / 2);
			var matched = false;

			for (var i = 0; i < sectionIds.length; i++) {
				var id = sectionIds[i];
				var section = $(id);
				if (!section.length) continue;

				var top = section.offset().top;
				var bottom = top + section.outerHeight();

				if (viewCenter >= top && viewCenter < bottom) {
					setActiveLink(id);
					matched = true;
					break;
				}
			}

			// final fallback near bottom of page
			if (!matched) {
				var nearBottom = $(window).scrollTop() + $(window).height() >= $(document).height() - 50;
				if (nearBottom) setActiveLink(sectionIds[sectionIds.length - 1]);
			}
		});

		// highlight immediately on load
		setTimeout(function() {
			var currentHash = window.location.hash || '#fh5co-header';
			if (sectionIds.indexOf(currentHash) !== -1) {
				setActiveLink(currentHash);
			} else {
				setActiveLink('#fh5co-header');
			}
		}, 500);

		// also highlight on click for instant feedback
		navLinks.on('click', function() {
			var target = $(this).attr('href');
			setActiveLink(target);
		});
	};

	// Day/Night Mode Toggle
	var themeToggle = function() {
		var themeToggleBtn = $('#themeToggle');
		var themeIcon = $('#themeIcon');
		var body = $('body');
		
		// Check for saved theme preference or default to dark mode
		var currentTheme = localStorage.getItem('theme') || 'dark';
		
		// Update icon based on current theme (shows what clicking will switch TO)
		var updateIcon = function(isDark) {
			if (isDark) {
				themeIcon.removeClass('fa-moon').addClass('fa-sun');
			} else {
				themeIcon.removeClass('fa-sun').addClass('fa-moon');
			}
		};
		
		if (currentTheme === 'light') {
			body.removeClass('dark-mode');
			updateIcon(false);
		} else {
			body.addClass('dark-mode');
			updateIcon(true);
		}
		
		themeToggleBtn.on('click', function() {
			body.toggleClass('dark-mode');
			
			if (body.hasClass('dark-mode')) {
				localStorage.setItem('theme', 'dark');
				updateIcon(true);
			} else {
				localStorage.setItem('theme', 'light');
				updateIcon(false);
			}
		});
	};

	// Skills animation with GSAP
	var skillsAnimation = function() {
		if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
			gsap.registerPlugin(ScrollTrigger);
			
			gsap.utils.toArray('.skill-item').forEach((item, index) => {
				gsap.fromTo(item, 
					{
						opacity: 0,
						y: 50,
						scale: 0.8
					},
					{
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 0.6,
						delay: index * 0.1,
						ease: "back.out(1.7)",
						scrollTrigger: {
							trigger: item,
							start: "top 85%",
							toggleActions: "play none none none"
						}
					}
				);
			});
		} else {
			// Fallback for when GSAP is not loaded
			$('#fh5co-skills').waypoint(function(direction) {
				if (direction === 'down' && !$(this.element).hasClass('animated')) {
					$('.skill-item').each(function(index) {
						var $item = $(this);
						setTimeout(function() {
							$item.addClass('animate');
						}, index * 100);
					});
					$(this.element).addClass('animated');
				}
			}, { offset: '85%' });
		}
	};

	// Enhanced section animations
	var sectionAnimations = function() {
		if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
			gsap.utils.toArray('.animate-box').forEach((box) => {
				gsap.fromTo(box,
					{ opacity: 0, y: 30 },
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						ease: "power2.out",
						scrollTrigger: {
							trigger: box,
							start: "top 85%",
							toggleActions: "play none none none"
						}
					}
				);
			});
		}
	};

	// Loading page
	var loaderPage = function() {
		$(".fh5co-loader").fadeOut("slow");
	};

	
	$(function(){
		contentWayPoint();
		goToTop();
		loaderPage();
		fullHeight();
		parallax();
		smoothScroll();
		activeSection();
		themeToggle();
		
		// Wait for GSAP to load
		if (typeof gsap !== 'undefined') {
			skillsAnimation();
			sectionAnimations();
		} else {
			// Fallback if GSAP doesn't load
			setTimeout(function() {
				if (typeof gsap !== 'undefined') {
					skillsAnimation();
					sectionAnimations();
				}
			}, 1000);
		}
	});


}());