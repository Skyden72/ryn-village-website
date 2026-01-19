<?php
/**
 * Ryn Village Theme Functions
 *
 * @package RynVillage
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function rynvillage_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    
    // Register navigation menus
    register_nav_menus(array(
        'primary'   => __('Primary Menu', 'rynvillage'),
        'footer'    => __('Footer Menu', 'rynvillage'),
    ));
}
add_action('after_setup_theme', 'rynvillage_setup');

/**
 * Enqueue Scripts and Styles
 */
function rynvillage_scripts() {
    // Google Fonts
    wp_enqueue_style(
        'rynvillage-google-fonts',
        'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap',
        array(),
        null
    );
    
    // Main stylesheet
    wp_enqueue_style(
        'rynvillage-style',
        get_stylesheet_uri(),
        array(),
        wp_get_theme()->get('Version')
    );
    
    // Component styles
    wp_enqueue_style(
        'rynvillage-components',
        get_template_directory_uri() . '/assets/css/components.css',
        array('rynvillage-style'),
        wp_get_theme()->get('Version')
    );
    
    // Main JavaScript
    wp_enqueue_script(
        'rynvillage-main',
        get_template_directory_uri() . '/assets/js/main.js',
        array(),
        wp_get_theme()->get('Version'),
        true
    );
    
    // Animations (Intersection Observer based)
    wp_enqueue_script(
        'rynvillage-animations',
        get_template_directory_uri() . '/assets/js/animations.js',
        array(),
        wp_get_theme()->get('Version'),
        true
    );
}
add_action('wp_enqueue_scripts', 'rynvillage_scripts');

/**
 * Register Widget Areas
 */
function rynvillage_widgets_init() {
    register_sidebar(array(
        'name'          => __('Footer Widget 1', 'rynvillage'),
        'id'            => 'footer-1',
        'description'   => __('Footer widget area 1', 'rynvillage'),
        'before_widget' => '<div class="footer-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
    
    register_sidebar(array(
        'name'          => __('Footer Widget 2', 'rynvillage'),
        'id'            => 'footer-2',
        'description'   => __('Footer widget area 2', 'rynvillage'),
        'before_widget' => '<div class="footer-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
}
add_action('widgets_init', 'rynvillage_widgets_init');

/**
 * Custom Nav Walker for Primary Menu
 */
require_once get_template_directory() . '/inc/class-rynvillage-nav-walker.php';

/**
 * Theme Customizer
 */
require_once get_template_directory() . '/inc/customizer.php';

/**
 * Custom Post Types (Units)
 */
require_once get_template_directory() . '/inc/post-types.php';

/**
 * Helper Functions
 */
function rynvillage_get_hero_image() {
    $hero_image = get_theme_mod('rynvillage_hero_image');
    if ($hero_image) {
        return $hero_image;
    }
    return get_template_directory_uri() . '/assets/images/hero-default.jpg';
}
