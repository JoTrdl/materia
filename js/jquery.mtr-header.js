(function($, window, document) {

  "use strict";

  var pluginName = 'mtrHeader';
 
  var __bind = function(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  };

  var __debounce = function(fn, me) {

    var timeout;

    return function() {
      var args = arguments;
      function delayed () {
          fn.apply(me, args);
          timeout = null;
      };

      if (timeout)
        clearTimeout(timeout);

      timeout = setTimeout(delayed, 100);
    };
  };
 
  // Plugin default options.
  var defaults = {
    threshold: 55
  };

  function Plugin(element, options) {
    this.$el = $(element);

    this.options = $.extend({}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();

    return this;
  }

  var onResize = function() {
    this.height = this.$el.height();
  };

  var onScroll = function() {
    var scrolltop = this.$body.scrollTop();

    var delta = this.height - scrolltop;
    if (delta < this.options.threshold) {
      this.$el.addClass('fixed');
      this.placeholder.show();
    }
    else {
      this.$el.removeClass('fixed');
      this.placeholder.hide();
    }
  };

  Plugin.prototype.init = function() {
    this.$body = $('body');

    this.placeholder = this.$body.find('.header-placeholder');
    if (!this.placeholder.length) {
      this.$el.before('<div class="header-placeholder" style="display:none"></div>');
      this.placeholder = this.$body.find('.header-placeholder');
    }

    this.height = this.$el.height();
    this.placeholder.css({
      'height': this.height
    });

    $(window).on('scroll', __bind(onScroll, this)).on('resize', __debounce(onResize, this));
  };

  $.fn[pluginName] = function (options, arg) {
    if (typeof(options) === 'string' && Plugin.prototype[options]) {
      return this.each(function() {
        var inst = $.data(this, "plugin_" + pluginName);
        inst && inst[options].apply(inst, [arg]);
      });
    } else {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        }
      });
    }
  };
})(jQuery, window, document);