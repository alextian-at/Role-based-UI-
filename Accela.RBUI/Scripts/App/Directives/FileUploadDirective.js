/**
author: Nicol Xiang
create date: 2013/11/30
**/
"use strict";
RBUIApp.directive("accelaFileUpload", ["browserVersion", "$resource", "$filter", function (browserVersion, $resource, $filter) {
    return {
        templateUrl: "/appviews/common/fileupload.html",
        link: function (scope, element, attrs) {
            scope.isButton = attrs.type == "buttonStyle";
            var formData = null;
            var contextForm = null;
            scope.FileUpload = {};
            scope.FileUpload.SelectedFiles = ["test"];
            var contextFile = null;
            if (scope.isButton) {
                contextForm = element.find("#buttonForm");
                contextFile = element.find("#buttonFile");
            } else {
                contextForm = element.find("#linkForm");
                contextFile = element.find("#linkFile");
            }

            var fileDropBox = element.find("#fileDropBox");
            if (fileDropBox[0]) {//
                fileDropBox.bind("dragenter", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                });

                fileDropBox.bind("dragover", function (e) {
                    fileDropBox.css('background', '#009ACD');
                    e.stopPropagation();
                    e.preventDefault();
                });

                fileDropBox.bind("drop", function (e) {
                    fileDropBox.css('background', 'white');
                    if (e.dataTransfer.files == undefined) {
                        alert("Browser Not Supported!");
                        return false;
                    }

                    formData = new FormData();
                    //scope.FileUpload.SelectedFiles = [];
                    var filenames = [];
                    for (var i in e.dataTransfer.files) {
                        formData.append('files', e.dataTransfer.files[i]);
                        if (e.dataTransfer.files[i] && e.dataTransfer.files[i].type)
                            filenames.push(e.dataTransfer.files[i].name);
                    }
                    scope.FileUpload.SelectedFiles = filenames;
                    if (scope.$$phase)
                        scope.$apply();
                    scope.SelectedFile();
                    e.stopPropagation();
                    e.preventDefault();
                });
            }
            contextFile.bind("click", function () {
                contextFile.val("");
                contextForm[0].reset();
            });
            contextFile.bind("change", function () {
                scope.$apply(function () {
                    if (contextFile.val() != "") {
                        if (browserVersion.indexOf("MSIE") != -1 && parseInt(browserVersion.replace("MSIE", ""), 10) < 10) {
                            scope.FileUpload.SelectedFiles = [];
                            scope.FileUpload.SelectedFiles.push(contextFile.val());

                        } else {
                            //scope.FileUpload.SelectedFiles = [];
                            var filenames = [];
                            formData = new FormData();
                            for (var i in contextFile[0].files) {
                                formData.append('files', contextFile[0].files[i]);
                                //alert(angular.toJson(contextFile[0].files[i]));
                                if (contextFile[0].files[i] && contextFile[0].files[i].type) {
                                    filenames.push(contextFile[0].files[i].name);
                                }
                            }
                            scope.FileUpload.SelectedFiles = filenames;

                        }
                        scope.SelectedFile();
                    }
                });
            });

            scope.QueryDocumentGroup = function ()
            {
                scope.Groupdata = $resource("/App/GetDocumentType").get();
               
            };
            scope.QueryDocumentGroup();

            scope.DocumentGroupChange = function (DocumentgroupId) {
                var tmpTypes = [];
                for (var i in scope.Groupdata.documentGroups)
                {
                    if (($filter("filter")(scope.Groupdata.documentGroups[i].types, { $: DocumentgroupId + "-" })).length > 0)
                    {
                        for (var j in scope.Groupdata.documentGroups[i].types)
                        {
                            tmpTypes.push({ value: scope.Groupdata.documentGroups[i].types[j].display});
                        }
                    }
                }
                scope.Typedata = tmpTypes;
            };


            scope.FileUploadSubmit = function () {
                $(document).progressDialog.showDialog('');
                var postUrl = "/App/UploadDocument?DocumentGroup=" + scope.Documentgroup.value + "&Documenttype=" + scope.Documenttype.value + "&Description=" + scope.FileDescripttion + "&url=" + attrs.url;
                if (browserVersion.indexOf("MSIE") != -1 && parseInt(browserVersion.replace("MSIE", ""),10) < 10) {
                    contextForm.ajaxForm({
                        beforeSubmit: function (formData, jqForm, options) {
                            return true;
                        },
                        success: function (responseText, statusText, xhr, $form) {
                            $(document).progressDialog.hideDialog('');
                            //send upload success event
                            //send id data when success
                            scope.$emit("FileUploadSuccess", { id: attrs.id, data: responseText });
                            scope.$broadcast('CloseModal', { name: 'FileUploadModal' });
                        },
                        url: postUrl,
                        data: { filename: contextFile.val() }
                    });
                    contextForm.submit();
                } else {
                    var xhr = new XMLHttpRequest();
                    xhr.open("post", postUrl, true);
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    xhr.onreadystatechange = function () {
                        $(document).progressDialog.hideDialog('');
                        if (xhr.readyState == 4) {
                            //send upload success event
                            //send id data when success
                            scope.$emit("FileUploadSuccess", { id: attrs.id, data: xhr.responseText });
                            scope.$broadcast('CloseModal', { name: 'FileUploadModal' });
                        }
                    };
                    xhr.send(formData);
                }
            }

            scope.SelectedFile = function () {
                scope.$broadcast('OpenModal', { name: 'FileUploadModal', width: '800px', title: 'Upload Document' });
            }

            scope.$on("ModalClosed", function (event, data) {
                if (data.id == "FileUploadModal") {
                    if (scope.Documenttype&&scope.Documenttype.value)
                        scope.Documenttype.value = null;

                    element.find("form").each(function () {
                        this.reset();
                    })
                    scope.FileType = null;
                    scope.FileDescripttion = null;
                    scope.FileUpload.SelectedFiles = [];
                    contextFile.val("");
                    console.log(" fileupload modal close: ");
                }
            })
        }
    };
}]);