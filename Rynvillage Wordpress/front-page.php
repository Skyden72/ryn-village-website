<?php
/**
 * Front Page Template
 *
 * @package RynVillage
 */

get_header();
?>

<!-- Hero Section -->
<?php get_template_part('template-parts/sections/hero'); ?>

<!-- Amenities Section -->
<?php get_template_part('template-parts/sections/amenities'); ?>

<!-- Units Section -->
<?php get_template_part('template-parts/sections/units'); ?>

<!-- Life Rights Section -->
<?php get_template_part('template-parts/sections/life-rights'); ?>

<!-- Contact Section -->
<?php get_template_part('template-parts/sections/contact'); ?>

<?php
get_footer();
