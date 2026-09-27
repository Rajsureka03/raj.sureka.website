// --- JQUERY DEPENDENCIES ---
// Smooth scroll 
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });
    
    // Navbar toggle 
    $('#nav-toggle').click(function(){
        $(this).toggleClass('is-active');
        $('ul.nav').toggleClass('show');
    });
});



// --- CUSTOM CAROUSEL FUNCTION (Pure JS) ---

// Global map to store references to active carousels
const activeCarousels = {};

/**
 * Initializes a custom carousel based on Flowbite-style data attributes.
 * * @param {string} carouselSelector The unique ID of the main carousel container.
 * @param {string} activeColorClass The CSS class for the active indicator (DEFAULT: 'bg-black').
 * @param {string} inactiveColorClass The CSS class for the inactive indicator (DEFAULT: 'bg-gray-600').
 */
function initializeCarousel(carouselSelector, activeColorClass = 'bg-black', inactiveColorClass = 'bg-gray-600') {
    const carousel = document.querySelector(carouselSelector);
    if (!carousel) return;

    // Use attribute selectors to match the HTML structure
    const slides = carousel.querySelectorAll('[data-carousel-item]'); 
    const indicators = carousel.querySelectorAll('[data-carousel-indicators] button');
    const totalSlides = slides.length;
    let currentSlideIndex = 0;

    function goToSlide(index) {
        // Index wrapping logic
        if (index >= totalSlides) {
            index = 0;
        } else if (index < 0) {
            index = totalSlides - 1;
        }

        // Hide all slides
        slides.forEach(slide => slide.classList.add('hidden'));
        
        // Indicator Reset Logic: Reset all indicators to the inactive state
        indicators.forEach(indicator => {
            // FIX: Aggressively remove common conflicting background colors like white
            indicator.classList.remove('bg-white'); 
            indicator.classList.remove('bg-light'); 
            
            // Apply inactive color
            indicator.classList.remove(activeColorClass); // Remove active color
            indicator.classList.add(inactiveColorClass); // Add inactive color
            indicator.removeAttribute('aria-current');
        });

        // Show the target slide and set indicator to active
        if (indicators[index]) {
            slides[index].classList.remove('hidden');
            
            // Indicator Activation Logic: Set the target indicator to the active state
            indicators[index].classList.remove(inactiveColorClass); // Remove inactive color
            indicators[index].classList.add(activeColorClass); // Add active color
            
            indicators[index].setAttribute('aria-current', 'true');
        } else {
             // Fallback: If no indicator exists for this index, just show the slide
             slides[index].classList.remove('hidden');
        }

        currentSlideIndex = index;
    }

    // Arrow Navigation Handlers
    const prevButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToSlide(currentSlideIndex - 1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToSlide(currentSlideIndex + 1);
        });
    }

    // Indicator (Dot) Navigation Handlers
    indicators.forEach((indicator, index) => { 
        indicator.addEventListener('click', () => {
            goToSlide(index); 
        });
    });

    // Store a reference to the goToSlide function for external use
    activeCarousels[carouselSelector] = {
        element: carousel,
        goToSlide: goToSlide
    };

    // Initialize the first slide state (This runs goToSlide(0) and sets the first dot/slide active)
    goToSlide(0);
}


// --- EXTERNAL BUTTON FUNCTIONALITY (Custom Implementation) ---

/**
 * Custom function to handle the 'delivery by ace' button click.
 */
function handleAceDeliveryButtonClick() {
    // 1. Get the external button element (Assuming an ID: ace-delivery-button)
    const externalButton = document.getElementById('ace-delivery-button'); 

    if (externalButton) {
        externalButton.addEventListener('click', () => {
            // Target the specific carousel ID
            const carouselRef = activeCarousels['#scotts-ace-carousel'];
            
            if (carouselRef && typeof carouselRef.goToSlide === 'function') {
                // Index 1 corresponds to the second slide (delivery-by-ace.jpg)
                carouselRef.goToSlide(1); 
                
                // Optional: Smoothly scroll to the carousel after switching
                carouselRef.element.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
            } else {
                console.error("Ace methodology carousel not initialized or goToSlide not available. Check the button ID and carousel ID '#scotts-ace-carousel'.");
            }
        });
    }
}


// --- INITIALIZATION CALL (Runs after all HTML is loaded) ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Default Carousel: Requested scheme (Dark Gray Active, Light Gray Inactive)
    initializeCarousel('#default-carousel'); 
    
    // 2. Scotts ACE Carousel: Blue scheme
    // Active: bg-blue-600, Inactive: bg-blue-300
    initializeCarousel('#scotts-ace-carousel', 'bg-blue-600', 'bg-blue-300'); 

    // 3. Methodology Carousel: Red scheme
    // Active: bg-red-700, Inactive: bg-red-400
    initializeCarousel('#methodology-carousel', 'bg-red-700', 'bg-red-400');

    // 4. Other Carousels: Use the default (Black Active, Dark Gray Inactive)
    initializeCarousel('#scotts-oto-carousel'); 
    initializeCarousel('#wireframe-carousel'); 
    initializeCarousel('#black-carousel'); 


    // Add the external button handler (if applicable)
    handleAceDeliveryButtonClick();
});

document.addEventListener('DOMContentLoaded', () => {
        const sidebarNav = document.getElementById('sidebar-nav');
        const navToggle = document.getElementById('nav-toggle');
        const toggleIcon = document.getElementById('toggle-icon');
        const navTexts = document.querySelectorAll('.nav-text');
        const sections = document.querySelectorAll('details[id], section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        // Toggle collapsed state on button click
        let isCollapsed = false;

        navToggle.addEventListener('click', () => {
            isCollapsed = !isCollapsed;

            if (isCollapsed) {
                // Shrink navbar width and hide text labels
                sidebarNav.classList.remove('w-52');
                sidebarNav.classList.add('w-14');
                toggleIcon.classList.add('rotate-180');
                navTexts.forEach(el => el.classList.add('hidden'));
            } else {
                // Restore navbar width and show text labels
                sidebarNav.classList.remove('w-14');
                sidebarNav.classList.add('w-52');
                toggleIcon.classList.remove('rotate-180');
                navTexts.forEach(el => el.classList.remove('hidden'));
            }
        });

        // Track scroll position to update active indicator
        window.addEventListener('scroll', () => {
            let currentSectionId = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                const dot = link.querySelector('.link-dot');
                link.classList.remove('bg-gray-900', 'text-white', 'shadow-sm');
                if (dot) dot.classList.remove('bg-accent-rose', 'scale-125');

                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('bg-gray-900', 'text-white', 'shadow-sm');
                    if (dot) dot.classList.add('bg-accent-rose', 'scale-125');
                }
            });
        });
    });
    
    