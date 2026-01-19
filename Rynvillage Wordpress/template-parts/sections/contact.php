<!-- Contact Section -->
<section id="contact" class="section section-cream">
    <div class="container">
        <div class="section-header animate-on-scroll">
            <h2 class="section-title">Schedule A Private Showing</h2>
            <p class="section-subtitle">
                Take the first step towards your dream retirement. Contact us today.
            </p>
        </div>

        <div class="contact-grid">
            <!-- Contact Info Cards -->
            <div class="contact-info animate-on-scroll">
                <div class="contact-card">
                    <div class="contact-card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </div>
                    <div class="contact-card-content">
                        <h3>Visit Us</h3>
                        <p>Ryn Village Estate<br>South Africa</p>
                    </div>
                </div>

                <div class="contact-card">
                    <div class="contact-card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path
                                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                            </path>
                        </svg>
                    </div>
                    <div class="contact-card-content">
                        <h3>Call Us</h3>
                        <a href="tel:+27000000000">+27 (0) 00 000 0000</a>
                    </div>
                </div>

                <div class="contact-card">
                    <div class="contact-card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z">
                            </path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </div>
                    <div class="contact-card-content">
                        <h3>Email Us</h3>
                        <a href="mailto:info@rynvillage.co.za">info@rynvillage.co.za</a>
                    </div>
                </div>

                <div class="contact-card">
                    <div class="contact-card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div class="contact-card-content">
                        <h3>Opening Hours</h3>
                        <p>Mon - Fri: 8:00 AM - 5:00 PM<br>Sat: 9:00 AM - 1:00 PM</p>
                    </div>
                </div>
            </div>

            <!-- Contact Form -->
            <div class="contact-form-wrapper animate-on-scroll" data-delay="200">
                <?php echo do_shortcode('[contact-form-7 id="contact-form" title="Contact Form"]'); ?>

                <!-- Fallback form if CF7 not installed -->
                <form class="contact-form" id="contactForm" action="<?php echo admin_url('admin-post.php'); ?>"
                    method="POST">
                    <input type="hidden" name="action" value="rynvillage_contact">
                    <?php wp_nonce_field('rynvillage_contact', 'contact_nonce'); ?>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="firstName">First Name *</label>
                            <input type="text" id="firstName" name="first_name" required>
                        </div>
                        <div class="form-group">
                            <label for="surname">Surname *</label>
                            <input type="text" id="surname" name="surname" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="email">Email Address *</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone Number *</label>
                            <input type="tel" id="phone" name="phone" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="unit">Unit of Interest</label>
                        <select id="unit" name="unit">
                            <option value="">Select Unit of Interest</option>
                            <option value="1A">Unit 1A - 1 Bedroom Apartment</option>
                            <option value="2A">Unit 2A - 2 Bedroom Apartment</option>
                            <option value="2B">Unit 2B - 2 Bedroom Home</option>
                            <option value="2C">Unit 2C - 2 Bedroom Home</option>
                            <option value="2D">Unit 2D - 2 Bedroom Home</option>
                            <option value="3A">Unit 3A - 3 Bedroom Home</option>
                            <option value="3B">Unit 3B - 3 Bedroom Home</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" rows="4"></textarea>
                    </div>

                    <div class="form-group form-checkbox">
                        <input type="checkbox" id="marketing" name="marketing">
                        <label for="marketing">I want to receive marketing updates</label>
                    </div>

                    <button type="submit" class="btn btn-primary btn-full">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            style="width: 20px; height: 20px; margin-right: 8px;">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                        Submit Enquiry
                    </button>
                </form>
            </div>
        </div>
    </div>
</section>