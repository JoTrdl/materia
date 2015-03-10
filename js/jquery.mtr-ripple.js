(function($, window, document) {

  "use strict";

  var pluginName = 'mtrRipple';
  var isTouch = !!('ontouchstart' in window);
  var transitionEndEvent = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";
  
  var __bind = function(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  };
 
  // Plugin default options.
  var defaults = {

  };

  function Plugin( element, options ) {
    this.$el = $(element);

    this.options = $.extend({}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();

    return this;
  }

  var clearRipple = function() {
    var self = this;
    this.ripple
      .one(transitionEndEvent, function() {
        self.ripple.off().remove();
      })
      .addClass('out');
  };

  var onUp = function() {
    this.focus = false;
    //if(!this.animating) {
      clearRipple.apply(this);
    //}
  };

  var onAnimationDone = function(e) {
    this.animating = false;
    if(!this.focus) {
      clearRipple.apply(this);
    }
  };

  var getDistanceSize = function($target, pos) {
    var points = [
      {left: 0, top: 0},
      {left: $target.outerWidth(), top: 0},
      {left: 0, top: $target.outerHeight()},
      {left: $target.outerWidth(), top: $target.outerHeight()}
    ];

    var max = 0;
    for (var p in points) {
      var d = Math.sqrt(Math.pow(pos.left - points[p].left, 2) + Math.pow(pos.top - points[p].top, 2));

      max = Math.max(max, d);
    }
    max = Math.ceil(max);

    return max;
  };

  var animate = function(pos) {
    // Compute the size of circle
    var size;
    if (this.centered)
      size = Math.max(this.$target.width(), this.$target.height());
    else
      size = getDistanceSize(this.$target, pos) * 2;
    
    // bind for leaving
    this.$el.one("mouseup mouseleave touchend", __bind(onUp, this));

    this.animating = true;
    this.ripple.on(transitionEndEvent, __bind(onAnimationDone, this)).css({
      "width": size + "px",
      "height": size + "px",
      "margin-left": -size/2 + "px",
      "margin-top": -size/2 + "px"
    });
  };

  var onDown = function(e) {
    var disabled = this.$el.hasClass('disabled') || this.$el.attr('disabled') || this.$el.data('ripple-off') != undefined;
    if (disabled)
      return;

    this.$target = this.$el;
    this.centered = (this.$el.data("ripple-centered") != undefined);

    // Special for input radio & checkbox
    var type = this.$el.attr('type');
    if (type == 'radio' || type == 'checkbox') {
      this.$target = this.$el.parent();
      this.centered = true;
    }

    // Switch if target attr specified
    var target = this.$el.data('ripple-target');
    if (target && target != '') {
      this.$target = this.$el.parents(target);
      if (this.$target.length == 0) {
        this.$target = this.$el.next(target);
      }
    }

    this.$target.addClass('mtr-btn');
    if(!this.$target.find('.mtr-ripple-wrapper').length) {
      this.$target.prepend('<div class="mtr-ripple-wrapper"></div>');
    }
    this.wrapper = this.$target.find('.mtr-ripple-wrapper');
    this.wrapper.empty();

  
    // Determine point position
    var pos = { };
    if (this.centered) {
      pos = {
        left: this.wrapper.width()/2,
        top: this.wrapper.height()/2
      };
    }
    else {
      var offset = this.wrapper.offset();
      var evt = (isTouch) ? e.originalEvent.changedTouches[0] : e; // Adjust event is touch or not
      pos = {
        left: evt.pageX - offset.left,
        top: evt.pageY - offset.top
      };
    }

    if(!pos.left && !pos.top) { return; }

    var color = this.$el.data("ripple-color");
    var opacity = this.$el.data("ripple-opacity");
    if (!color) {
      var elementStyle = window.getComputedStyle(this.$el[0]);
      color = elementStyle.color;
    }

    this.ripple = $('<div class="mtr-ripple"></div>');
    this.ripple.css(pos);
    if (color) this.ripple.css('background-color', color);
    if (opacity) this.ripple.css('opacity', opacity);
    this.ripple.appendTo(this.wrapper);

    // Start animation
    this.focus = true;
    animate.apply(this, [pos]);
  };

  Plugin.prototype.init = function() {
    this.$el.on("mousedown touchstart", __bind(onDown, this));
  };

  $.fn[pluginName] = function (options, arg) {
    if (typeof(options) === 'string' && Plugin.prototype[options]) {
      return this.each(function() {
        var inst = $.data(this, "plugin_" + pluginName);
        inst && inst[options].apply(inst, [arg]);
      });
    } else {
      var live = options && options.live;
      if (live) {
        $(document).on("mousedown touchstart", this.selector, function(e) {
          if (!$.data(this, "plugin_" + pluginName)) {
            $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            $(this).trigger(e);
          }
        });
      }
      
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        }
      });
    }
  };
})(jQuery, window, document);