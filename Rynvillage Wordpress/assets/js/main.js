/**
 * Main JavaScript
 * Ryn Village WordPress Theme
 */

document.addEventListener('DOMContentLoaded', function () {
    // Navigation scroll effect
    initNavigation();

    // Units slider
    initUnitsSlider();

    // Smooth scroll for anchor links
    initSmoothScroll();
});

/**
 * Navigation
 */
function initNavigation() {
    const nav = document.getElementById('main-nav');
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.nav-menu-mobile');

    // Scroll effect
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile toggle
    if (toggle && mobileMenu) {
        toggle.addEventListener('click', function () {
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isOpen);
            mobileMenu.setAttribute('aria-hidden', isOpen);
            mobileMenu.classList.toggle('is-open');
            toggle.classList.toggle('is-active');
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                toggle.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                mobileMenu.classList.remove('is-open');
                toggle.classList.remove('is-active');
            });
        });
    }
}

/**
 * Units Slider
 */
function initUnitsSlider() {
    const slider = document.getElementById('unitsSlider');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const pagination = document.getElementById('unitsPagination');

    if (!slider) return;

    const slides = slider.querySelectorAll('.unit-slide');
    let currentIndex = 0;

    // Unit data
    const unitsData = [
        {
            id: '1A',
            name: '1 Bedroom Apartment',
            beds: 1,
            baths: 1,
            size: '55m²',
            description: 'Perfect for singles or couples seeking a cozy retirement home with lift access.',
            features: ['Lift Access', 'Open Plan Living', 'Modern Kitchen', 'Secure Entry']
        },
        {
            id: '2A',
            name: '2 Bedroom Apartment',
            beds: 2,
            baths: 2,
            size: '85m²',
            description: 'Spacious apartment with guest room and lift access for comfortable living.',
            features: ['Lift Access', 'Guest Bedroom', 'Balcony', 'Storage Room']
        },
        {
            id: '2B',
            name: '2 Bedroom Home',
            beds: 2,
            baths: 2,
            size: '95m²',
            description: 'Stand-alone home with private garden and single garage.',
            features: ['Private Garden', 'Single Garage', 'Covered Patio', 'Garden Shed']
        },
        {
            id: '3A',
            name: '3 Bedroom Home',
            beds: 3,
            baths: 2,
            size: '120m²',
            description: 'Premium home with spacious rooms, double garage, and entertainment area.',
            features: ['Double Garage', 'Study Nook', 'Large Garden', 'Entertainment Area']
        }
    ];

    function updateSlider(index) {
        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Update slider position
        slider.style.transform = `translateX(-${index * 100}%)`;

        // Update info
        const unit = unitsData[index];
        document.getElementById('unitName').textContent = unit.name;
        document.getElementById('unitBeds').textContent = `${unit.beds} Bed`;
        document.getElementById('unitBaths').textContent = `${unit.baths} Bath`;
        document.getElementById('unitSize').textContent = unit.size;
        document.getElementById('unitDescription').textContent = unit.description;

        // Update features
        const featuresEl = document.getElementById('unitFeatures');
        featuresEl.innerHTML = unit.features.map(f => `<span class="unit-feature">${f}</span>`).join('');

        // Update pagination
        if (pagination) {
            pagination.querySelectorAll('.pagination-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        currentIndex = index;
    }

    // Navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider(newIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            const newIndex = (currentIndex + 1) % slides.length;
            updateSlider(newIndex);
        });
    }

    // Pagination clicks
    if (pagination) {
        pagination.querySelectorAll('.pagination-dot').forEach((dot, i) => {
            dot.addEventListener('click', function () {
                updateSlider(i);
            });
        });
    }

    // Initialize
    updateSlider(0);
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navHeight = document.getElementById('main-nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
