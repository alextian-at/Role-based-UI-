/**
author: Nicol Xiang
create date:
event handler:
        OpenModal:
                params: It is a json object,included "name(required)","title", "width" three properties
        CloseModal:
                params: it is a json object,included "name(required)","result","closedCallBack(Function)" three properties;
                        When "Modal Window" closed, "closedCallBack" Function will be the implementation of
tigger event:        

**/

"use strict";
RBUIApp.directive("accelaModal", ["$rootScope", '$compile', "$document", function ($rootScope, $compile, $document) {
    return {
        link: function (scope, element, attrs) {
            var title = "Modal Window";
            var width = "600px";
            var container = $("<div class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\" ><div class=\"modal-dialog\" style=\"padding-top:calc(8%) !important;width:auto;max-width:" + width + "\"><div class=\"modal-content\"><div class=\"modal-body\">");

            element.wrapAll(container);
            var modal = element.parents(".modal:first");
            $("<div class=\"modal-header\">" +
                "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>" +
                "<h4 class=\"modal-title\" id=\"myModalLabel\">" + title + "</h4></div>").insertBefore(modal.find(".modal-body:first"));
            //$compile(modal.html())(scope);

            //console.log(modal[0]);
            scope.$on("OpenModal", function (event, options) {
                if (options.name == attrs.accelaModal) {
                    if (options.title)
                        modal.find(".modal-title:first").text(options.title);
                    if (options.width) {
                        modal.find(".modal-dialog:first").css({ "max-width": options.width });
                    }
                    options.backdrop = "static";
                    var zindex = 1050;
                    $(".modal").each(function (index, element) {
                        if ($(element).css("display") === "block") {
                            zindex = zindex + 10;
                            $(element).css({ "z-index": 1030 });
                        }
                    });
                    modal.css({ "z-index": zindex });
                    modal.modal(options);
                }
            });

            var closedcallbackFunc;

            scope.$on("CloseModal", function (event, options) {
                if (options.name == attrs.accelaModal) {

                    if (options.closedCallBack) {
                        closedcallbackFunc = options.closedCallBack;
                    }

                    modal.modal("hide");
                    firstClose = true;
                    if (scope.onModalClose instanceof Function) {
                        scope.onModalClose(options.name, options.result);
                    }
                }
            });
            var firstClose = false;
            modal.on('hidden.bs.modal', function () {
                scope.$emit("ModalClosed", { id: attrs.accelaModal});
                if (closedcallbackFunc) {
                    if ($rootScope.$$phase) {
                        closedcallbackFunc();
                    } else {
                        $rootScope.$apply(function () {
                            closedcallbackFunc();
                        });
                    }
                }

                $(".modal").each(function (index, element) {
                    if ($(element).css("display") === "block" && $(element).css("z-index") =="1030") {
                        console.log($(element).css("z-index"));
                        $(element).css({ "z-index": 1050 });
                    }
                });
                if (firstClose === true) {
                    false;
                } else {
                    if (scope.onModalClose instanceof Function) {
                        scope.onModalClose(attrs.accelaModal);
                    }
                }
            })

            // draggable
            var modalBox = modal.find(".modal-dialog:first");
            var modalHeader = modal.find(".modal-header:first");
            var startX = 0, startY = 0, x = 0, y =0;
            modalHeader.css({ cursor: "pointer" });
            var firstmousedown = false;
            modalHeader.bind('mousedown', function (event) {                
                //event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                if (firstmousedown == false) {
                    firstmousedown = true;
                    startX = event.pageX;
                    startY = event.pageY;
                    modalBox.css({
                        position: 'relative',
                        top: '0px',
                        left: 0 + 'px',
                        right:'auto'
                    });
                } else {
                    modalBox.css({
                        position: 'relative'
                    });
                }
                $document.bind('mousemove', mousemove);
                $document.bind('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                modalBox.css({
                    top: y + 'px',
                    left: x + 'px'
                });
            }

            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }
            $(window).resize(function () {
                firstmousedown = false;
                modalBox.css({
                    position: "initial",
                    top: 0 + 'px',
                    left: 0 + 'px'
                });
            });
        }
    };
}]);