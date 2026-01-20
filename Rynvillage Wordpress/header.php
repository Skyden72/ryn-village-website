<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php bloginfo('description'); ?>">
    <link rel="icon" href="<?php echo get_template_directory_uri(); ?>/assets/images/favicon.png" type="image/png">
    <link rel="apple-touch-icon" href="<?php echo get_template_directory_uri(); ?>/assets/images/favicon.png">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>

    <!-- Navigation -->
    <nav id="main-nav" class="main-nav">
        <div class="container nav-container">
            <!-- Logo -->
            <a href="<?php echo home_url('/'); ?>" class="nav-logo">
                <?php if (has_custom_logo()): ?>
                    <?php the_custom_logo(); ?>
                <?php else: ?>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/logo.png"
                        alt="<?php bloginfo('name'); ?>" class="nav-logo-img">
                <?php endif; ?>
            </a>

            <!-- Desktop Menu -->
            <div class="nav-menu-desktop">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container' => false,
                    'menu_class' => 'nav-menu',
                    'fallback_cb' => false,
                    'walker' => new RynVillage_Nav_Walker(),
                ));
                ?>
                <a href="#contact" class="btn btn-primary nav-cta">Book A Viewing</a>
            </div>

            <!-- Mobile Menu Toggle -->
            <button class="nav-toggle" aria-label="Toggle Menu" aria-expanded="false">
                <span class="nav-toggle-icon"></span>
            </button>
        </div>

        <!-- Mobile Menu -->
        <div class="nav-menu-mobile" aria-hidden="true">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'container' => false,
                'menu_class' => 'nav-menu-mobile-list',
                'fallback_cb' => false,
            ));
            ?>
            <a href="#contact" class="btn btn-primary nav-cta-mobile">Book A Viewing</a>
        </div>
    </nav>

    <main id="content" class="site-content">