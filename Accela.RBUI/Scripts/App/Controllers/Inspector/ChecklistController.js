"use strict";
RBUIApp.controller("ChecklistCtrl", ["$scope", "$routeParams", "ApiService", "$filter",
    function ($scope, $routeParams, ApiService, $filter) {
        $scope.inspectionid = $routeParams.id;
        $scope.alerts = [];
        $scope.checklists = [];
        $scope.checkListItems = [];
        $scope.checkListStatus = [{ "text": "N/A[API Data]", "value": "N/A" }, { "text": "Yes[API Data]", "value": "Yes" }, { "text": "No[API Data]", "value": "No" }];
        $scope.checkListStatusScore = [{ value: "N/A", score: 0 }, { value: "Yes", score: 10 }, { value: "No", score: 0 }];
        $scope.batchStatus = $scope.checkListStatus[0];
        $scope.currentCheckListItem = {};
        $scope.batchScore = 0;
        $scope.totalScore = 0;
        $scope.gridOptions = {
            columns: [
                { name: "id", checkboxcolumn: true, width: '10%', align: 'center', headerAlign: 'center' },
                { name: "id", headertempleate: "HeaderTemplate", template: "FirstTemplate", width: '70%', align: 'left' }
            ]
        };

        $scope.onGridCheckedAll = function () {
            for (var i in $scope.checkListItems) {
                $scope.checkListItems[i].status = $scope.batchStatus;
                $scope.checkListItems[i].score = $scope.batchScore;
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

        $scope.onGridCheckedItem = function (item) {
            item.status = $scope.batchStatus;
            item.score = $scope.batchScore;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }


        $scope.toggleImg = function (element, target, item) {
            var id = item.id;
            var src = $("#" + element).attr("src");
            if (src.indexOf("arrow-down.png") > -1) {
                $("#" + element).attr("src", "../../../Images/Inspector/arrow-right.png");
                $("#" + target).collapse('hide');
            }
            else {
                item.itemtemplate = "ItemShowTemplate";  
                $("#" + element).attr("src", "../../../Images/Inspector/arrow-down.png");
                $("#" + target).collapse('show');
                console.log("=========" + $scope.$$phase);
                $scope.getChecklistItemDocuments(id);//get checklistitem documents
            }
        }

        $scope.batchStatusChange = function (status) {
            var checkListeItems = $scope.getNGGridCheckedItems();
            var tmpScore = 0;
            for (var s in $scope.checkListStatusScore) {
                if ($scope.checkListStatusScore[s].value === status.value) {
                    tmpScore = $scope.checkListStatusScore[s].score;
                    break;
                }
            }
            for (var i in checkListeItems) {
                checkListeItems[i].status = status;
                checkListeItems[i].score = tmpScore;
            }
            $scope.batchScore = tmpScore;
            //alert(tmpScore);
            $scope.batchStatus = status;
            if (!$scope.$$phase)
                $scope.$apply();
            //calcTotalScore();
        };
        $scope.batchScoreChange = function (score) {
            var checkListeItems = $scope.getNGGridCheckedItems();
            for (var i in checkListeItems) {
                checkListeItems[i].score = score;
            }
            $scope.batchScore = score;
            if (!$scope.$$phase)
                $scope.$apply();
            //calcTotalScore();
        }

        $scope.itemScoreChange = function () {
            //alert(1);
            //calcTotalScore();
        }

        $scope.itemStatusChange = function (item) {
            var tmpScore = 0;
            for (var s in $scope.checkListStatusScore) {
                if ($scope.checkListStatusScore[s].value === item.status.value) {
                    tmpScore = $scope.checkListStatusScore[s].score;
                    break;
                }
            }
            item.score = tmpScore;
            if (!$scope.$$phase)
                $scope.$apply();
            //calcTotalScore();

        }

        $scope.$watch("checkListItems", function () {
            calcTotalScore();
        }, true);

        // calc total score
        var calcTotalScore = function () {
            var total = 0;
            for (var i in $scope.checkListItems) {
                if ($scope.checkListItems[i].score) {
                    total += parseInt($scope.checkListItems[i].score, 10);
                }
            }
            $scope.totalScore = total;
        }

        $scope.selectCheckListChange = function () {
            getCheckListItems();
        };

        $scope.getChecklist = function () {
            $(document).progressDialog.showDialog('');
            try {
                ApiService.ApiRequest.get({ url: "/inspections/" + $routeParams.id + "/checklists", time: Math.random() }, function (data) {
                    if (data.status == 200) {
                        $scope.checklists = data.result;
                        //console.log(" check list ==== " + angular.toJson($scope.checklists));
                        if ($scope.checklists != null && $scope.checklists.length > 0) {
                            $scope.checklistSelected = $scope.checklists[0];
                            getCheckListItems();
                        } else {
                            $scope.alerts.push({ type: "danger", msg: "There are no checklists set up for this inspection." });
                            $(document).progressDialog.hideDialog('');
                        }
                    } else {
                        $(document).progressDialog.hideDialog('');
                    }
                }, function (error) {
                    $(document).progressDialog.hideDialog('');
                });
            }
            catch (ex) {
                //alert("getChecklist err:" + ex.message);
            }
        }
        $scope.getChecklist();

        $scope.dialogHistory = function (title, modalId) {            
            $scope.$broadcast('OpenModal', { name: "CheckListItemHistoryModal", width: "750px", title: title });
        };

        // save  checklist item
        $scope.SaveChange = function () {
            $(document).progressDialog.showDialog('');
            var ApiRequest = new ApiService.ApiRequest();
            var tmpItems = angular.copy($scope.checkListItems);
            var saveItems = [];
            for (var i in tmpItems) {
                var item = tmpItems[i];
                delete item.score;
                saveItems.push(item);
            }
            ApiRequest.data = angular.toJson(saveItems);
            ApiRequest.$update({ url: "/inspections/" + $routeParams.id + "/checklists/" + $scope.checklistSelected.id + "/checklistItems", time: Math.random() }, function (data) {
                console.log("update check list :" + angular.toJson(data));
                if (data.status == 200) {

                }
                $(document).progressDialog.hideDialog('');
            }, function (error) {
                $(document).progressDialog.hideDialog('');
            });
        }

        $scope.OpenStandardCommentsModal = function (item) {
            $scope.currentCheckListItem = item;
            $scope.$broadcast('OpenModal', { name: "standardComment", width: "800px", title: "Standard Comments" });
        }

        $scope.onModalClose = function (name, result) {
            if (name === "standardComment") {
                if (result) {
                    if (!$scope.currentCheckListItem.comment)
                        $scope.currentCheckListItem.comment = {};
                    if (!$scope.currentCheckListItem.comment.value)
                        $scope.currentCheckListItem.comment.value = "";
                    var breakStr = $scope.currentCheckListItem.comment.value == "" ? "" : "\r\n\r\n";
                    $scope.currentCheckListItem.comment.value += breakStr + result;
                }
            }
        }

        var deleteId = null;
        $scope.ChecklistItemDocumentDelte = function (id,itemId) {
            deleteId = id;
            $scope.accelaConfirm(null, 'Delete Document', 'Are you sure you want to delete this document?', function () {
                ApiService.ApiRequest.delete({ url: "/inspections/" + $routeParams.id + "/documents/" + deleteId, time: Math.random() }, function (data) {
                    if (data.status == 200) {
                        $scope.getChecklistItemDocuments(itemId);
                    }
                }, function (error) {

                })
            });
        }

        var getCheckListItems = function () {
            $(document).progressDialog.showDialog('');
            ApiService.ApiRequest.get({ url: "/inspections/" + $routeParams.id + "/checklists/" + $scope.checklistSelected.id + "/checklistItems", time: Math.random() }, function (data) {
                $(document).progressDialog.hideDialog('');
                if (data.status == 200) {
                    $scope.checkListItems = formatCheckListItemData(data.result);
                    $scope.setNGGridPageItems($scope.checkListItems);
                    //setTimeout(function () { getAllChecklistItemDocuments(); },1500);
                }
            }, function (error) {
                $(document).progressDialog.hideDialog('');
            });
        }

        //var setItemTemplate = function (i) {
        //    if (i < $scope.checkListItems.length) {
        //        $scope.checkListItems[i].itemtemplate = "ItemShowTemplate";
        //        setTimeout(function () {
        //            setItemTemplate(i+1);
        //        }, 10);
        //    }
        //}

        var formatCheckListItemData = function (array) {
            for (var i in array) {
                var matchStatses = [];
                if (array[i].status)
                    matchStatses = $filter("filter")($scope.checkListStatus, { value: array[i].status.value });
                array[i].status = (matchStatses && matchStatses.length > 0) ? matchStatses[0] : $scope.checkListStatus[0];
                array[i].getdocuments = false;
                array[i].documents = [];
            }
            return array;
        }

        $scope.getChecklistItemDocuments = function (itemId) {
            var items = $filter("filter")($scope.checkListItems, { id: itemId });
            if (items && items.length > 0) {
                var item = items[0];
                console.log("get:::" + item.getdocuments + "===" + item);
                item.getdocuments = true;
                item.documents = [];
                ApiService.ApiRequest.get({ url: "/inspections/" + $routeParams.id + "/checklists/" + $scope.checklistSelected.id + "/checklistItems/" + itemId + "/documents", time: Math.random() }, function (data) {
                    item.getdocuments = false;
                    if (data.status == 200) {
                        item.documents = data.result;
                        console.log("item docuemnts:" + item.documents);
                    }
                }, function (error) {
                    item.getdocuments = false;
                });
            }
            //$scope.setNGGridPageItems($scope.checkListItems);
        }

        $scope.$on("FileUploadSuccess", function (event, data) {
            $scope.getChecklistItemDocuments(data.id);
        });

    }]);
