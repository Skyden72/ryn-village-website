<!-- Units Section -->
<section id="units" class="section section-dark">
    <div class="container">
        <div class="section-header section-header-light animate-on-scroll">
            <h2 class="section-title">Available Units</h2>
            <p class="section-subtitle">
                Premium-quality homes and apartments meeting exceptionally high standards.
            </p>
        </div>

        <div class="units-showcase">
            <!-- Unit Image Slider -->
            <div class="units-slider animate-on-scroll">
                <div class="units-slider-track" id="unitsSlider">
                    <!-- Unit 1A -->
                    <div class="unit-slide" data-unit="1A">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/unit-1a.jpg"
                            alt="1 Bedroom Apartment">
                        <div class="unit-badge">Unit 1A</div>
                    </div>
                    <!-- Unit 2A -->
                    <div class="unit-slide" data-unit="2A">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/unit-2a.jpg"
                            alt="2 Bedroom Apartment">
                        <div class="unit-badge">Unit 2A</div>
                    </div>
                    <!-- Unit 2B -->
                    <div class="unit-slide" data-unit="2B">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/unit-2b.jpg"
                            alt="2 Bedroom Home">
                        <div class="unit-badge">Unit 2B</div>
                    </div>
                    <!-- Unit 3A -->
                    <div class="unit-slide" data-unit="3A">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/unit-3a.jpg"
                            alt="3 Bedroom Home">
                        <div class="unit-badge">Unit 3A</div>
                    </div>
                </div>

                <!-- Navigation -->
                <button class="slider-nav slider-prev" aria-label="Previous">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <button class="slider-nav slider-next" aria-label="Next">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>

            <!-- Unit Info -->
            <div class="units-info animate-on-scroll" data-delay="200">
                <h3 class="unit-name" id="unitName">1 Bedroom Apartment</h3>

                <div class="unit-stats">
                    <div class="unit-stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M2 4v16"></path>
                            <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
                            <path d="M2 17h20"></path>
                            <path d="M6 8v9"></path>
                        </svg>
                        <span id="unitBeds">1 Bed</span>
                    </div>
                    <div class="unit-stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 6l6 0"></path>
                            <path d="M4 12l16 0"></path>
                            <path d="M4 12l0 6a2 2 0 0 0 2 2l12 0a2 2 0 0 0 2-2l0-6"></path>
                            <path d="M3 12l0-4a2 2 0 0 1 2-2l1 0l0 6"></path>
                            <path d="M21 12l0-4a2 2 0 0 0-2-2l-1 0l0 6"></path>
                        </svg>
                        <span id="unitBaths">1 Bath</span>
                    </div>
                    <div class="unit-stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <polyline points="9 21 3 21 3 15"></polyline>
                            <line x1="21" y1="3" x2="14" y2="10"></line>
                            <line x1="3" y1="21" x2="10" y2="14"></line>
                        </svg>
                        <span id="unitSize">55m²</span>
                    </div>
                </div>

                <p class="unit-description" id="unitDescription">
                    Perfect for singles or couples seeking a cozy retirement home with lift access.
                </p>

                <div class="unit-features" id="unitFeatures">
                    <span class="unit-feature">Lift Access</span>
                    <span class="unit-feature">Open Plan Living</span>
                    <span class="unit-feature">Modern Kitchen</span>
                    <span class="unit-feature">Secure Entry</span>
                </div>

                <div class="unit-buttons">
                    <a href="#contact" class="btn btn-primary">Enquire About This Unit</a>
                    <button class="btn btn-outline-light" data-action="view-floorplan">View Floor Plan</button>
                </div>

                <!-- Pagination Dots -->
                <div class="units-pagination" id="unitsPagination">
                    <button class="pagination-dot active" data-index="0"></button>
                    <button class="pagination-dot" data-index="1"></button>
                    <button class="pagination-dot" data-index="2"></button>
                    <button class="pagination-dot" data-index="3"></button>
                </div>
            </div>
        </div>
    </div>
</section>