<?php
/**
 * Custom Post Types
 *
 * @package RynVillage
 */

/**
 * Register Units Custom Post Type
 */
function rynvillage_register_units_post_type()
{
    $labels = array(
        'name' => __('Units', 'rynvillage'),
        'singular_name' => __('Unit', 'rynvillage'),
        'menu_name' => __('Units', 'rynvillage'),
        'add_new' => __('Add New', 'rynvillage'),
        'add_new_item' => __('Add New Unit', 'rynvillage'),
        'edit_item' => __('Edit Unit', 'rynvillage'),
        'new_item' => __('New Unit', 'rynvillage'),
        'view_item' => __('View Unit', 'rynvillage'),
        'search_items' => __('Search Units', 'rynvillage'),
        'not_found' => __('No units found', 'rynvillage'),
        'not_found_in_trash' => __('No units found in trash', 'rynvillage'),
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'query_var' => true,
        'rewrite' => array('slug' => 'units'),
        'capability_type' => 'post',
        'has_archive' => true,
        'hierarchical' => false,
        'menu_position' => 5,
        'menu_icon' => 'dashicons-building',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'show_in_rest' => true,
    );

    register_post_type('unit', $args);
}
add_action('init', 'rynvillage_register_units_post_type');

/**
 * Register Unit Meta Fields
 */
function rynvillage_register_unit_meta()
{
    register_post_meta('unit', 'unit_id', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ));

    register_post_meta('unit', 'bedrooms', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'integer',
    ));

    register_post_meta('unit', 'bathrooms', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'integer',
    ));

    register_post_meta('unit', 'size', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ));

    register_post_meta('unit', 'price_range', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ));

    register_post_meta('unit', 'features', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ));

    register_post_meta('unit', 'floor_plan_image', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ));
}
add_action('init', 'rynvillage_register_unit_meta');

/**
 * Add Meta Boxes for Unit Details
 */
function rynvillage_add_unit_meta_boxes()
{
    add_meta_box(
        'unit_details',
        __('Unit Details', 'rynvillage'),
        'rynvillage_unit_details_callback',
        'unit',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'rynvillage_add_unit_meta_boxes');

/**
 * Unit Details Meta Box Callback
 */
function rynvillage_unit_details_callback($post)
{
    wp_nonce_field('rynvillage_unit_details', 'unit_details_nonce');

    $unit_id = get_post_meta($post->ID, 'unit_id', true);
    $bedrooms = get_post_meta($post->ID, 'bedrooms', true);
    $bathrooms = get_post_meta($post->ID, 'bathrooms', true);
    $size = get_post_meta($post->ID, 'size', true);
    $price_range = get_post_meta($post->ID, 'price_range', true);
    $features = get_post_meta($post->ID, 'features', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="unit_id">
                    <?php _e('Unit ID', 'rynvillage'); ?>
                </label></th>
            <td><input type="text" id="unit_id" name="unit_id" value="<?php echo esc_attr($unit_id); ?>"
                    class="regular-text"></td>
        </tr>
        <tr>
            <th><label for="bedrooms">
                    <?php _e('Bedrooms', 'rynvillage'); ?>
                </label></th>
            <td><input type="number" id="bedrooms" name="bedrooms" value="<?php echo esc_attr($bedrooms); ?>"
                    class="small-text"></td>
        </tr>
        <tr>
            <th><label for="bathrooms">
                    <?php _e('Bathrooms', 'rynvillage'); ?>
                </label></th>
            <td><input type="number" id="bathrooms" name="bathrooms" value="<?php echo esc_attr($bathrooms); ?>"
                    class="small-text"></td>
        </tr>
        <tr>
            <th><label for="size">
                    <?php _e('Size (e.g., 55m²)', 'rynvillage'); ?>
                </label></th>
            <td><input type="text" id="size" name="size" value="<?php echo esc_attr($size); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th><label for="price_range">
                    <?php _e('Price Range', 'rynvillage'); ?>
                </label></th>
            <td><input type="text" id="price_range" name="price_range" value="<?php echo esc_attr($price_range); ?>"
                    class="regular-text"></td>
        </tr>
        <tr>
            <th><label for="features">
                    <?php _e('Features (comma-separated)', 'rynvillage'); ?>
                </label></th>
            <td><textarea id="features" name="features" class="large-text"
                    rows="3"><?php echo esc_textarea($features); ?></textarea></td>
        </tr>
    </table>
    <?php
}

/**
 * Save Unit Meta
 */
function rynvillage_save_unit_meta($post_id)
{
    if (!isset($_POST['unit_details_nonce']) || !wp_verify_nonce($_POST['unit_details_nonce'], 'rynvillage_unit_details')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $fields = array('unit_id', 'bedrooms', 'bathrooms', 'size', 'price_range', 'features');

    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
        }
    }
}
add_action('save_post_unit', 'rynvillage_save_unit_meta');
