/**
author: Nicol Xiang
create date: 2013/11/30
**/
"use strict";
RBUIApp.directive("asit", ["$routeParams", "ApiService", "$filter", "$compile",function ($routeParams, ApiService, $filter, $compile) {
    return {
        link: function (scope, element, attrs) {

            var obj = null;

            scope.formdata = {};

            scope.InitConfig = function () {

                var TabData = [
                   { name: "tab1", type: "tab1" },
                   { name: "tab2", type: "tab2" },
                   { name: "tab3", type: "tab2" }];

                var FiledData = [
                    { name: "field1", type: "int", contype: "Text" },
                    { name: "field2", type: "string", contype: "Date" },
                    { name: "field3", type: "date", contype: "DropdownList" },
                    { name: "field4", type: "string", contype: "Time" },
                    { name: "field5", type: "string", contype: "CheckBox" },
                    { name: "field6", type: "string", contype: "Text" },
                    { name: "field7", type: "int", contype: "Text" },
                    { name: "field8", type: "string", contype: "Text" },
                    { name: "field9", type: "date", contype: "Text" },
                    { name: "field10", type: "string", contype: "Text" },
                    { name: "field11", type: "string", contype: "Text" },
                    { name: "field12", type: "string", contype: "Text" }
                ];

                attrs.id = attrs.id == undefined ? "dtdiv" : attrs.id;

                attrs.column = attrs.column == undefined ? 2 : attrs.column;

                attrs.showheader = attrs.showheader == undefined ? true : attrs.showheader;

                attrs.showfooter = attrs.showfooter == undefined ? false : attrs.showfooter;

                attrs.footerclassname = attrs.footerclassname == undefined ? "class=\"panel-footer\"" : "class=\"" + attrs.footerclassname + "\"";

                attrs.panelclassname = attrs.panelclassname == undefined ? "class=\"panel panel-default\"" : "class=\"" + attrs.panelclassname + "\"";

                attrs.panelheaderclassname = attrs.panelheaderclassname == undefined ? "class=\"panel-heading\"" : "class=\"" + attrs.panelheaderclassname + "\"";

                attrs.panelbodyclassname = attrs.panelbodyclassname == undefined ? "class=\"panel-body\"" : "class=\"" + attrs.panelbodyclassname + "\"";

                attrs.tableclassname = attrs.tableclassname == undefined ? "class=\"table table-hover\"" : "class=\"" + attrs.tableclassname + "\"";

                attrs.trcontrolclassname = attrs.tdcontrolclassname == undefined ? "" : "class=\"" + attrs.tdcontrolclassname + "\"";

                attrs.tdlabelclassname = attrs.tdlabelclassname == undefined ? "" : "class=\"" + attrs.tdlabelclassname + "\"";

                attrs.tdcontrolclassname = attrs.tdcontrolclassname == undefined ? "" : "class=\"" + attrs.tdcontrolclassname + "\"";

                attrs.tabdatasource = attrs.TableDataSource == undefined ? TabData : attrs.tabdatasource;

                attrs.fileddatasource = attrs.fileddatasource == undefined ? FiledData : attrs.fileddatasource;
            };

            scope.InitConfig();

            scope.CreateASIT = function () {
                var AppendElementId = attrs.id;
                var Column = attrs.column;
                obj = $("#" + AppendElementId);

                var tabs = attrs.tabdatasource;

                var fileds = attrs.fileddatasource;

                //start;
                var html = "";
                for (var i = 0; i < tabs.length; i++) {
                    var tabname = tabs[i].name;
                    html += "<div " + attrs.panelclassname + ">";

                    if (attrs.showheader) {
                        html += "<div " + attrs.panelheaderclassname + ">" + tabname + "</div>";
                    }

                    html += "<div " + attrs.panelbodyclassname + ">";
                    html += "<table " + attrs.tableclassname + ">";
                    html += "<tr " + attrs.trcontrolclassname + ">";
                    for (var j = 0; j < fileds.length; j++) {
                        var filedname = fileds[j].name;
                        var filedtype = fileds[j].type;
                        var controltype = fileds[j].contype;
                        html += "<td " + attrs.tdlabelclassname + ">";
                        html += filedname;
                        html += "</td>";

                        var attr = "id='" + tabname + filedname + "' ng-model='formdata." + tabname + filedname + ".value'";

                        html += "<td " + attrs.tdcontrolclassname + ">";
                        switch (controltype) {
                            case "Text":
                                html += "<input type='text'  " + attr + " value='" + tabname + filedname + "' />";
                                break;
                            case "Date":
                                html += "<input type=\"text\" class=\"form-control calendar-style\" datepicker-popup=\"MM/dd/yyyy\" name=\"scheduleDate\" " + attr + " ng-model=\"inspection.scheduleDate\" ng-required=\"true\" />";
                                break;
                            case "Y/N":
                                html += "<input type='text' " + attr + " />";
                                break;
                            case "Number":
                                html += "<input type='number' " + attr + " />";
                                break;
                            case "DropdownList":
                                html += "<select ng-init=\"a=[1,2,3,4];\" " + attr + ">";
                                html += "<option value=\"\">Select</option>";
                                html += "<option ng-repeat=\"member in a\">{{member}}</option>";
                                html += "</select>";
                                break;
                            case "Textarea":
                                html += "<input type='text' " + attr + " />";
                                break;
                                break;
                            case "Time":
                                html += "<input type='time' " + attr + " />";
                                break;
                            case "Money":
                                html += "<input type='text' " + attr + " />";
                                break;
                            case "CheckBox":
                                html += "<input type='checkbox' " + attr + " />";
                                break;
                        }

                        html += "</td>";

                        if ((j + 1) % (Column) == 0) {

                            html += "</tr>";

                            if (j != fileds.length - 1) {
                                html += "<tr " + attrs.trcontrolclassname + ">";
                            }
                        }

                    }
                    html += "</table>";

                    //panel footer;
                    html += "</div>";
                    if (attrs.showfooter) {
                        html += "<div " + attrs.footerclassname + ">&nbsp;</div>";
                    }
                    html += "</div>";
                }
                var link = $compile(html);
                var node = link(scope);
                obj.append(node);
                //end
            };

            scope.CreateASIT();

            scope.GetformData = function () {
                var jsondata = angular.toJson(scope.formdata);
                alert(jsondata);
                return jsondata;
            }

        }
    };
}]);