(function($) {

  var pluginName = 'mtrPanel';
  var isTouch = !!('ontouchstart' in window);
  var events = {
    'up' : (isTouch) ? 'touchend' : 'mouseup',
    'move' : (isTouch) ? 'touchmove' : 'mousemove',
    'down': (isTouch) ? 'touchstart' : 'mousedown',
    'tap': (isTouch) ? 'touchend' : 'click',
  };
  var transitionEndEvent = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";
  
  var __bind = function(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  };
 
  // Plugin default options.
  var defaults = {
    'swipe-threshold' : 75
  };

  function Plugin( element, options ) {
    this.$el = $(element);

    this.options = $.extend({}, defaults, options) ;
    this._name = pluginName;

    this.init();

    return this;
  }

  var openPanel = function(e) {
    e.preventDefault();

    this.overlay.addClass('visible');
    this.$el.addClass('animated visible');

    var self = this;
    this.$el.one(transitionEndEvent, function(e) {
      self.$el.removeClass('animated');
    });
  };

  var closePanel = function(e) {
    e && e.preventDefault();

    translate.apply(this, [null]);
    this.overlay.removeClass('visible');
    this.$el.addClass('animated').removeClass('visible');
  };

  var translate = function(trans) {
    var translate = (trans) ? 'translateX(-' + trans + 'px)' : '';
    this.$el.css({
      '-webkit-transform': translate,
      '-moz-transform': translate,
      '-ms-transform': translate,
      'transform': translate
    });
  };

  var startTouch = function(e) {
    var touch = (isTouch) ? e.originalEvent.changedTouches[0] : e;
    this.initX = touch.pageX;
    this.body.on(events.move, __bind(moveTouch, this));
  };
  var moveTouch = function(e) {
   var touch = (isTouch) ? e.originalEvent.changedTouches[0] : e;
    var x = touch.pageX;
    var trans = this.initX - x;
    translate.apply(this, [trans]);
  };
  var endTouch = function(e) {
    var touch = (isTouch) ? e.originalEvent.changedTouches[0] : e;
    var dist = this.initX - touch.pageX;
    if (dist >= this.options['swipe-threshold'])
      closePanel.apply(this, arguments);
    else {
      this.$el.addClass('animated');
      translate.apply(this, [0]);
    }
    this.body.off(events.move);
  };

  Plugin.prototype.init = function() {
    this.body = $('body');

    this.body.prepend('<div class="navbar-panel-overlay"></div>');
    this.overlay = this.body.find('.navbar-panel-overlay');

    if (!this.options.toggle)
      return console.err('Options [toggle] not present. It is a mandatory option.');

    $(this.options.toggle).on(events.tap, __bind(openPanel, this));
    this.overlay.on(events.tap, __bind(closePanel, this));

    this.panelWidth = this.$el.width();

    this.$el.on(events.down, __bind(startTouch, this));
    this.$el.on(events.up, __bind(endTouch, this));
  };

  Plugin.prototype.close = function(callback) {
    if (this.$el.hasClass('visible')) {
      closePanel.apply(this, [null, callback]);
    }
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
})(jQuery);