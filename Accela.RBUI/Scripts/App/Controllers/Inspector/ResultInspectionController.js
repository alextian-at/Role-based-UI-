"use strict"
RBUIApp.controller("ResultInspectionController", ["$scope", "ApiService", "$routeParams", function ($scope, ApiService, $routeParams) {

    $scope.isTouchDevice = function ()
    {
        var TouchDevice = (typeof (window.ontouchstart) != 'undefined') ? true : false;
        return TouchDevice;
    };

    $scope.LoadSignature = function (down, move, up)
    {
        CreateSignature("InspectorSignatureDiv", "InspectorSignature");
        CreateSignature("ContractorSignatureDiv", "ContractorSignature");
        function CreateSignature(obj, objid) {
            var InspectorSignatureDiv = document.getElementById(obj);
            var canvas = document.createElement('canvas');
            var canvasWidth = 730, canvasHeight = 100;
            var point = {};
            point.notFirst = false;

            canvas.setAttribute('width', canvasWidth);
            canvas.setAttribute('height', canvasHeight);
            canvas.setAttribute('id', 'canvas');
            InspectorSignatureDiv.appendChild(canvas);

            if (typeof G_vmlCanvasManager != 'undefined') {

                canvas = G_vmlCanvasManager.initElement(canvas);
            }
            var context = canvas.getContext("2d");


            canvas.addEventListener(down, function (e) {
                e.preventDefault();
                var mouseX = e.pageX - $(this).offset().left;
                var mouseY = e.pageY - $(this).offset().top;
                paint = true;
                addClick(e.pageX - $(this).offset().left,e.pageY - $(this).offset().top);
                redraw();
            });

            canvas.addEventListener(move, function (e) {
                e.preventDefault();
                if (paint) {
                    addClick(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
                    redraw();
                }
            });

            canvas.addEventListener(up, function (e) {
                paint = false;
            });

            var clickX = new Array();
            var clickY = new Array();
            var clickDrag = new Array();
            var paint;

            function addClick(x, y, dragging) {
                clickX.push(x);
                clickY.push(y);
                clickDrag.push(dragging);
            }

            function redraw() {
                //canvas.width = canvas.width; // Clears the canvas

                context.strokeStyle = "#df4b26";
                context.lineJoin = "round";
                context.lineWidth = 5;

                while (clickX.length > 0) {
                    point.bx = point.x;
                    point.by = point.y;
                    point.x = clickX.pop();
                    point.y = clickY.pop();
                    point.drag = clickDrag.pop();
                    context.beginPath();
                    if (point.drag && point.notFirst) {
                        context.moveTo(point.bx, point.by);
                    } else {
                        point.notFirst = true;
                        context.moveTo(point.x - 1, point.y);
                    }
                    context.lineTo(point.x, point.y);
                    context.closePath();
                    context.stroke();
                }
            }

            var clear =document.getElementById("canvasClear");
            clear.addEventListener("click", function () {
                canvas.width = canvas.width;
            });
            var submit = document.getElementById("btnSubmit");
            submit.addEventListener("click", function () {
                var bytedata = canvas.toDataURL("image/png");
                document.getElementById(objid).value = bytedata;
            });
        }
    };

    if ($scope.isTouchDevice()) {
        $scope.LoadSignature("touchstart", "touchmove", "touchend");
    }
    else
    {
        $scope.LoadSignature("mousedown","mousemove","mouseup");
    }

    $scope.$on("OpenModal", function (event)
    {
        document.getElementById("canvasClear").click();
    });

    $scope.GetUpateStatus = function () {
        var UpdateStatus = new ApiService.GetInspectionStatus();
        UpdateStatus.data = "group=" + $routeParams.group;
        UpdateStatus.$update({ url: "/settings/inspections/types?groupCode=" + $routeParams.group + "" }, function (data) {
            if (data.status == 200) {
                $scope.UpdateStatusRecord = data.result.results;
            }
        });
    };

    $scope.GetUpateStatus();


    $scope.showResultInspectionWindow = function () {
        $scope.resultinspection = {};
    }
    $scope.showResultInspectionWindow();

    $scope.showdialog = function () {
        $scope.$broadcast('OpenModal', { name: 'ResultInspection', width: '800px', title: 'Result Inspection' });
    };

    $scope.closedialog = function () {
        $scope.$broadcast('CloseModal', { name: "ResultInspection", result: $scope.commentList });
    };

    $scope.submit = function () {
        $(document).progressDialog.showDialog(' ');
        //var MakePublic = "N";
        //try{
        //    if ($scope.resultinspection.MakePublic.value)
        //    {
        //        MakePublic = "Y";
        //    }
        //}
        //catch (e)
        //{

        //}
        var status = $scope.resultinspection.inspectionstatus.value;
        var InspectorSignature = document.getElementById("InspectorSignature").value;
        var ContractorSignature = document.getElementById("ContractorSignature").value;
        var resultComment = $scope.resultinspection.inspectioncomments.value;
        $scope.requestbody = {
            "status": {
                "value": status,
                "text": status
            },
            "resultComment": resultComment
            //"displayCommentPublicVisible": MakePublic
        };

        var ResultInspection = new ApiService.ResultInspections();

        ResultInspection.data = angular.toJson($scope.requestbody);
        ResultInspection.InspectorSignature = InspectorSignature;
        ResultInspection.ContractorSignature = ContractorSignature
        ResultInspection.documneturl = "/inspections/" + $routeParams.id + "/documents";
        ResultInspection.$update({ url: "/inspections/" + $routeParams.id + "/result" }, function (data) {
            if (data.status == 200) {
                $scope.resultinspection = {};
                $(document).progressDialog.hideDialog();
                $scope.$broadcast('CloseModal', { name: "ResultInspection", result: $scope.commentList });
            }
        });

    }

}]);
