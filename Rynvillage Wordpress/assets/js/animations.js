/**
 * Scroll Animations
 * Using Intersection Observer for performant scroll-triggered animations
 */

document.addEventListener('DOMContentLoaded', function () {
    initScrollAnimations();
});

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.delay || 0;

                setTimeout(() => {
                    el.classList.add('is-visible');
                }, parseInt(delay));

                // Unobserve after animation
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Parallax effect for hero
 */
function initParallax() {
    const hero = document.querySelector('.hero-section');
    const heroImage = document.querySelector('.hero-image');

    if (!hero || !heroImage) return;

    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            const scale = 1 + (scrolled * 0.0002);
            const opacity = 1 - (scrolled / heroHeight);

            heroImage.style.transform = `scale(${scale})`;

            const content = document.querySelector('.hero-content');
            if (content) {
                content.style.opacity = opacity;
                content.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }
    });
}

// Initialize parallax
document.addEventListener('DOMContentLoaded', initParallax);
