<?php
/**
 * Theme Customizer
 *
 * @package RynVillage
 */

function rynvillage_customize_register($wp_customize)
{

    // Hero Section
    $wp_customize->add_section('rynvillage_hero', array(
        'title' => __('Hero Section', 'rynvillage'),
        'priority' => 30,
    ));

    // Hero Background Image
    $wp_customize->add_setting('rynvillage_hero_image', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));

    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'rynvillage_hero_image', array(
        'label' => __('Hero Background Image', 'rynvillage'),
        'section' => 'rynvillage_hero',
        'settings' => 'rynvillage_hero_image',
    )));

    // Hero Title
    $wp_customize->add_setting('rynvillage_hero_title', array(
        'default' => 'Welcome to your dream retirement',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('rynvillage_hero_title', array(
        'label' => __('Hero Title', 'rynvillage'),
        'section' => 'rynvillage_hero',
        'type' => 'text',
    ));

    // Hero Subtitle
    $wp_customize->add_setting('rynvillage_hero_subtitle', array(
        'default' => 'Experience retirement in luxury without the luxury of high costs.',
        'sanitize_callback' => 'sanitize_textarea_field',
    ));

    $wp_customize->add_control('rynvillage_hero_subtitle', array(
        'label' => __('Hero Subtitle', 'rynvillage'),
        'section' => 'rynvillage_hero',
        'type' => 'textarea',
    ));

    // Contact Section
    $wp_customize->add_section('rynvillage_contact', array(
        'title' => __('Contact Information', 'rynvillage'),
        'priority' => 35,
    ));

    // Phone Number
    $wp_customize->add_setting('rynvillage_phone', array(
        'default' => '+27 (0) 00 000 0000',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('rynvillage_phone', array(
        'label' => __('Phone Number', 'rynvillage'),
        'section' => 'rynvillage_contact',
        'type' => 'text',
    ));

    // Email Address
    $wp_customize->add_setting('rynvillage_email', array(
        'default' => 'info@rynvillage.co.za',
        'sanitize_callback' => 'sanitize_email',
    ));

    $wp_customize->add_control('rynvillage_email', array(
        'label' => __('Email Address', 'rynvillage'),
        'section' => 'rynvillage_contact',
        'type' => 'email',
    ));

    // Address
    $wp_customize->add_setting('rynvillage_address', array(
        'default' => 'Ryn Village Estate, South Africa',
        'sanitize_callback' => 'sanitize_textarea_field',
    ));

    $wp_customize->add_control('rynvillage_address', array(
        'label' => __('Address', 'rynvillage'),
        'section' => 'rynvillage_contact',
        'type' => 'textarea',
    ));

    // Social Media
    $wp_customize->add_section('rynvillage_social', array(
        'title' => __('Social Media', 'rynvillage'),
        'priority' => 40,
    ));

    // Facebook
    $wp_customize->add_setting('rynvillage_facebook', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));

    $wp_customize->add_control('rynvillage_facebook', array(
        'label' => __('Facebook URL', 'rynvillage'),
        'section' => 'rynvillage_social',
        'type' => 'url',
    ));

    // Instagram
    $wp_customize->add_setting('rynvillage_instagram', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));

    $wp_customize->add_control('rynvillage_instagram', array(
        'label' => __('Instagram URL', 'rynvillage'),
        'section' => 'rynvillage_social',
        'type' => 'url',
    ));
}
add_action('customize_register', 'rynvillage_customize_register');
