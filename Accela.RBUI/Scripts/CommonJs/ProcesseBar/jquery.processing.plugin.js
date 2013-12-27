/**
 * progress-Dialog for jQuery
 * Written by vakin Jiang (mailto: chiang.www@gmail.com)
 * Date: 2010/7/30
 * @author vakin
 * @version 1.0
 * 
 * @example
 * $(document).progressDialog.showDialog();
 * 
 *  $.ajax({
	  .....
	  complete:function(data){
	    $(document).progressDialog.hideDialog();
	    //do something
	  }
	});
 **/
(function ($) {
    $.fn.progressDialog = function () {

    };
    var load, waterfall;

    $.fn.progressDialog.showDialog = function (text) {
        text = text || "Loading,Please wait..."
        createElement(text);
        setPosition();
        waterfall.appendTo("body");
        //$(window).bind('resize', function() {
        //setPosition();
        //});

        //waterfall.modal({ backdrop: "static"});

        load = new Html5Loading(waterfall.find("canvas:first")[0], { radius: 30, circleLineWidth: 10 });
        load.show();
    }

    $.fn.progressDialog.hideDialog = function (text) {
        //waterfall.modal('hide')
        load.hide();
        waterfall.remove();
    }

    function createElement(text) {
        if (!waterfall) {
            waterfall = $("<div style=\"z-index:1100;position: fixed;top: 0;right: 0;bottom: 0;left: 0;\"><div class=\"modal-dialog\" style=\"padding-top: calc(100%/6) !important;max-width:200px;\"><canvas width=\"200px\" height=\"200px\"></canvas></div></div>");
        }
    }

    function setPosition() {
        var leftOffset = ($(document).width() - width) / 2;
        var topOffset = ($(document).height() - $(window).scrollTop() - Height) / 2;
        $(loadDiv).css({
            "position": "absolute",
            "height": Height + "px",
            "width": width + "px",
            "left": leftOffset + "px",
            "top": topOffset + "px"
        });
    }

    var waterfall;
    var loadDiv;
    var width = 290;
    var Height = 60;
})(jQuery);


function Html5Loading(canvas, options) {
    this.canvas = canvas;
    if (options) {
        this.radius = options.radius || 12;
        this.circleLineWidth = options.circleLineWidth || 4;
        this.circleColor = options.circleColor || 'lightgray';
        this.moveArcColor = options.moveArcColor || 'gray';
    } else {
        this.radius = 12;
        this.circelLineWidth = 4;
        this.circleColor = 'lightgray';
        this.moveArcColor = 'gray';
    }
}
Html5Loading.prototype = {
    show: function () {
        var canvas = this.canvas;
        if (!canvas.getContext) return;
        if (canvas.__loading) return;
        canvas.__loading = this;
        var ctx = canvas.getContext('2d');
        var radius = this.radius;
        var me = this;
        var rotatorAngle = Math.PI * 1.5;
        var step = Math.PI / 6;
        canvas.loadingInterval = setInterval(function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var lineWidth = me.circleLineWidth;
            var center = { x: canvas.width / 2, y: canvas.height / 2 };
            ctx.beginPath();
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = me.circleColor;
            ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = me.moveArcColor;
            ctx.arc(center.x, center.y, radius, rotatorAngle, rotatorAngle + Math.PI * .45);
            ctx.stroke();
            rotatorAngle += step;

        }, 50);
    },
    hide: function () {
        var canvas = this.canvas;
        canvas.__loading = false;
        if (canvas.loadingInterval) {
            window.clearInterval(canvas.loadingInterval);
        }
        var ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
};