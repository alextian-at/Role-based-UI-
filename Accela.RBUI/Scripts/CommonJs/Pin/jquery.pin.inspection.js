(function ($) {
    "use strict";
    $.fn.inspectionPin = function (options) {
        var scrollY = 0, elements = [], disabled = false, $window = $(window);

        options = options || {};

        var recalculateLimits = function () {
            for (var i = 0, len = elements.length; i < len; i++) {
                var $this = elements[i];

                //if (options.minWidth && $window.width() <= options.minWidth) {
                //    if ($this.parent().is(".pin-wrapper")) { $this.unwrap(); }
                //    $this.css({ width: "", left: "", top: "", position: "" });
                //    if (options.activeClass) { $this.removeClass(options.activeClass); }
                //    disabled = true;
                //    continue;
                //} else {
                //    disabled = false;
                //}

                var $container = options.containerSelector ? $this.closest(options.containerSelector) : $(document.body);
                var offset = $this.offset();
                var containerOffset = $container.offset();
                var parentOffset = $this.offsetParent().offset();

                if (!$this.parent().is(".pin-wrapper")) {
                    //$this.wrap("<div class='pin-wrapper'>");
                }

                $this.data("pin", {
                    from: 0,
                    to: containerOffset.top + $container.height() - $this.outerHeight(),
                    end: containerOffset.top + $container.height(),
                    parentTop: parentOffset.top
                });

                //$this.css({width: $this.outerWidth()});
                //$this.parent().css("height", $this.outerHeight());
            }
        };
        var insert = false;
        var onScroll = function () {

            if ($("body").height() != height || $("body").width() != width) {
                height = $("body").height(), width = $("body").width();
                update();
            }

            if (!$(".pin-main")[0]) {
                $window.unbind("scroll", onScroll);
                $(document).unbind('DOMSubtreeModified');
                return;
            }

            if (disabled) { return; }
            scrollY = $window.scrollTop();
            for (var i = 0, len = elements.length; i < len; i++) {
                var $this = $(elements[i]),
                    data = $this.data("pin"),
                    from = data.from,
                    to = data.to;
                if (from + $this.outerHeight() > data.end) {
                    $this.css('position', '');
                    continue;
                }
                if (from < scrollY && to > scrollY) {
                    !($this.css("position") == "fixed") && $this.css({
                        left: 0,
                        top: 0
                    }).css("position", "fixed");
                    if (options.activeClass) { $this.addClass(options.activeClass); }
                } else if (scrollY >= to) {
                    $this.css({
                        left: "",
                        top: to - data.parentTop
                    }).css("position", "absolute");
                    if (options.activeClass) { $this.addClass(options.activeClass); }
                } else {
                    $this.css({ position: "", top: "", left: "" });
                    if (options.activeClass) { $this.removeClass(options.activeClass); }
                }

                if (scrollY + $this.height() >= $(".summary-title").offset().top + $(".summary-title").height()) {
                    if ($this.css("display") == "none") {                        
                        $this.show();
                    }
                } else {
                    if ($this.css("display") != "none")
                        $this.hide();
                }

                if (scrollY + $(".pin-top").height() >= $("#summary .summary-menu").offset().top) {
                    if (!insert) {
                        //$(".pin-bottom").addClass("bgcolor");
                        if ($(".pin-bottom").css("display") == "none") {
                            $(".pin-bottom").show();
                            insert = true;
                        }
                    }
                }
                if (scrollY + $this.height() < $("#summary .summary-menu").offset().top + $("#summary .summary-menu").height()) {
                    if ($(".pin-bottom").css("display") != "none") {
                        insert = false;
                        $(".pin-bottom").hide();
                    }
                    //$(".pin-bottom").animate({ backgroundColor: "none" }, 1500);
                }
            }
        };

        var update = function () { recalculateLimits(); onScroll(); };
        this.each(function () {
            var $this = $(this),
                data = $(this).data('pin') || {};

            if (data && data.update) { return; }
            elements.push($this);
            $("img", this).one("load", recalculateLimits);
            data.update = update;
            $(this).data('pin', data);
        });

        $window.bind("scroll", onScroll);
        recalculateLimits();
        $window.load(update);
        var height = $("body").height(), width = $("body").width();
        return this;
    };
})(jQuery);