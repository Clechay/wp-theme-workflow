<?php
/*---update-jquery-to-2.x---*/
if( !is_admin()){
  wp_deregister_script('jquery');
  wp_register_script('jquery', (get_stylesheet_directory_uri() . "/js/jquery.js"), false, '1.9.1');
  wp_enqueue_script('jquery');
}
/*---make-menu-ul-more-bootstrap-like---*/
function c_scripts_enqueue() {
    wp_enqueue_script( 'bootstrap', get_stylesheet_directory_uri() . '/js/bootstrap.js', array( 'jquery' ) );
    wp_enqueue_script( 'app', get_stylesheet_directory_uri() . '/js/app.js', array( 'jquery' ) );
}
add_action( 'wp_enqueue_scripts', 'c_scripts_enqueue' );
class Custom_Walker_Nav_Menu extends Walker_Nav_Menu {
  function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
      $output .= sprintf( "\n<li class='nav-item'><a class='nav-link' href='%s'%s>%s</a></li>\n",
          $item->url,
          ( $item->object_id === get_the_ID() ) ? ' class="current"' : '',
          $item->title
      );
  }
}
?>