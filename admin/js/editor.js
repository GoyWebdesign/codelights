/*console.log('loaded');*/
jQuery(document).ready(function ($) {
  'use strict';

  $('.widget-title-action').click(function (e) {
    var $parent = $(this).closest('div[id]');
    var parent_id = $parent.attr('id').match(/_cl_/);
    if (parent_id !== null) {
      var widget_id = parent_id['input'];
      var widget_class = $('#' + widget_id).attr('class');
      var $parent_sidebar = $(this).closest('[class^=sidebars-column]');
      if (widget_class == 'widget') {
        $parent_sidebar.css('max-width', '650px');
      } else if (widget_class == 'widget open') {
        $parent_sidebar.css('max-width', '');
      }
    }
  });

  $('.widget-control-close').click(function (e) {
    var $parent = $(this).closest('div[id]');
    var parent_id = $parent.attr('id').match(/_cl_/);
    if (parent_id !== null) {
      var widget_id = parent_id['input'];
      var widget_class = $('#' + widget_id).attr('class');
      var $parent_sidebar = $(this).closest('[class^=sidebars-column]');
      $parent_sidebar.css('max-width', '');
    }
  });
});