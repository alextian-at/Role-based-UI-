"use strict";
RBUIApp.directive('ngGrid', ["$filter", "$timeout", "$parse", function ($filter, $timeout, $parse) {
    return {
        templateUrl: "/AppViews/Common/GridTemplate.html",
        link: function (scope, element, attrs) {
            /* public options */
            if (!scope.gridOptions) {
                scope.gridOptions = {}
            }
            if (!scope.gridOptions.columns) {
                scope.gridOptions.columns = [{ name: "id", title: "Id", sortable: true }];
            }
            if (!scope.gridOptions.PageSizes) {
                scope.gridOptions.PageSizes = [10, 20, 50];
            }
            if (!scope.gridOptions.Selectable)
                scope.gridOptions.Selectable = false;
            if (!scope.gridOptions.SelectedFirst)
                scope.gridOptions.SelectedFirst = false;
            if (!scope.gridOptions.Pageable)
                scope.gridOptions.Pageable = false;
            if (!scope.gridOptions.HeaderFilterable)
                scope.gridOptions.HeaderFilterable = false;
            /* private */

            scope.Grid = {
                Pagination: { startPoint: 0, endPoint: scope.gridOptions.ShowPaginationNumber ? scope.gridOptions.ShowPaginationNumber : 5, number: scope.gridOptions.ShowPaginationNumber ? scope.gridOptions.ShowPaginationNumber : 5 },
                Totals: 0,
                PageSize: scope.gridOptions.PageSizes[0],
                TotalPages: 0,
                CurrentPage: 0,
                SelectedItem: {},
                CheckAllBool: false,
                SearchModel: {}
            };

            scope.Grid.sortingOrder = scope.gridOptions.columns[0].name;
            scope.Grid.reverse = false;
            scope.Grid.DataLoading = false;
            scope.Grid.PageItems = [];

            for (var i in scope.gridOptions.columns) {
                scope.Grid.SearchModel[scope.gridOptions.columns[i].name] = "";
                if (scope.gridOptions.columns[i].filtertype == "date") {
                    scope.$watch("Grid.SearchModel." + scope.gridOptions.columns[i].name, function () {
                        scope.Grid.SearchSubmit();
                    });
                }
                
            }

            scope.Grid.SelectItemFunc = function (item, $event) {
                if (scope.gridOptions.Selectable) {
                    if (!scope.$$phase) {
                        scope.$apply(function () {
                            scope.Grid.SelectedItem = item;
                            setTimeout(function () {
                                if (scope.onGridRowSelected instanceof Function)
                                    scope.onGridRowSelected(item);
                            }, 10);
                        });
                    } else {
                        scope.Grid.SelectedItem = item;
                        setTimeout(function () {
                            if (scope.onGridRowSelected instanceof Function)
                                scope.onGridRowSelected(item);
                        }, 10);
                    }
                }
            }
            scope.Grid.CheckAll = function () {
                if (!scope.$$phase) {
                    scope.$apply(function () {
                        for (var i in scope.Grid.PageItems) {
                            scope.Grid.PageItems[i].checked = scope.Grid.CheckAllBool;
                            if (scope.onGridCheckedAll instanceof Function) {
                                scope.onGridCheckedAll();
                            }
                            //if (scope.Grid.CheckAllBool) {
                            //    setTimeout(function () {
                            //        if (scope.onGridCheckedItem instanceof Function)
                            //            scope.onGridCheckedItem(scope.Grid.PageItems[i]);
                            //    });
                            //}
                            //scope.setCheckedItem(scope.Grid.PageItems[i]);
                        }
                    });
                } else {
                    for (var i in scope.Grid.PageItems) {
                        scope.Grid.PageItems[i].checked = scope.Grid.CheckAllBool;
                        if (scope.onGridCheckedAll instanceof Function) {
                            scope.onGridCheckedAll();
                        }
                        //if (scope.Grid.CheckAllBool) {
                        //    setTimeout(function () {
                        //        if (scope.onGridCheckedItem instanceof Function)
                        //            scope.onGridCheckedItem(scope.Grid.PageItems[i]);
                        //    });
                        //}
                        //scope.setCheckedItem(scope.Grid.PageItems[i]);
                    }
                }
            }

            scope.Grid.SearchSubmit = function () {
                scope.Grid.DataLoading = true;
                //scope.Grid.PageItems = [];
                setTimeout(function () {                   
                    if (scope.onGridSearch)
                        scope.onGridSearch();
                },10);
            }
           
            /* public function */

            /*  pagination function  */
            scope.prevNGGridPage = function () {
                if (scope.Grid.CurrentPage > 0) {
                    scope.setNGGridPage(scope.Grid.CurrentPage - 1);
                }
            };

            scope.nextNGGridPage = function () {
                if (scope.Grid.CurrentPage < scope.Grid.TotalPages - 1) {
                    scope.setNGGridPage(scope.Grid.CurrentPage + 1);
                }
            };

            scope.firstNGGridPage = function () {
                scope.setNGGridPage(0);
            }

            scope.lastNGGridPage = function () {
                scope.setNGGridPage(scope.Grid.TotalPages - 1);
            }


            /* setter function */
            scope.setNGGridPageItems = function (items) {

                if (!scope.$$phase) {
                    if (scope.gridOptions.SelectedFirst&&items.length > 0)
                        scope.Grid.SelectItemFunc(items[0]);
                    scope.$apply(function () {
                        scope.Grid.DataLoading = false;
                            scope.Grid.PageItems = items;
                    });
                } else {
                    if (scope.gridOptions.SelectedFirst && items.length > 0)
                        scope.Grid.SelectItemFunc(items[0]);
                    scope.Grid.DataLoading = false;
                        scope.Grid.PageItems = items;
                }
            }

            // set current page
            scope.setNGGridPage = function (page) {
                if (scope.Grid.CurrentPage != page) {
                    scope.Grid.CurrentPage = page;
                    var _points = scope.Grid.Pagination.number;
                    var startP = scope.Grid.Pagination.startPoint = parseInt(page / _points, 10) * _points;
                    scope.Grid.Pagination.endPoint = startP + ((scope.Grid.TotalPages - startP) > _points ? _points : (scope.Grid.TotalPages - startP));
                    scope.Grid.DataLoading = true;
                    scope.Grid.PageItems = [];
                    setTimeout(function () {                       
                        if (scope.onGridPageChange) {
                            scope.onGridPageChange();
                        }
                    }, 10);
                }
            };

            scope.setNGGridTotals = function (totals) {
                if (scope.Grid.Totals != totals) {
                    scope.Grid.Totals = totals;
                    scope.setTotalPages();
                    if (scope.Grid.CurrentPage > scope.Grid.TotalPages - 1) {
                        scope.Grid.CurrentPage = scope.Grid.TotalPages - 1;
                    }
                    var _points = scope.Grid.Pagination.number;
                    var startP = scope.Grid.Pagination.startPoint = parseInt(scope.Grid.CurrentPage / _points, 10) * _points;
                    scope.Grid.Pagination.endPoint = startP + ((scope.Grid.TotalPages - startP) > _points ? _points : (scope.Grid.TotalPages - startP));
                }
            }

            scope.setNGGridPaginationNumber = function (number) {
                scope.Grid.Pagination.number = number;
                var _points = scope.Grid.Pagination.number;
                var startP = scope.Grid.Pagination.startPoint = parseInt(scope.Grid.CurrentPage / _points, 10) * _points;
                scope.Grid.Pagination.endPoint = startP + ((scope.Grid.TotalPages - startP) > _points ? _points : (scope.Grid.TotalPages - startP));
            }

            scope.setNGGridSelectItem = function (item) {
                scope.Grid.SelectItemFunc(item);
            }

            /*getter function*/

            scope.getNGGridPage = function () {
                return scope.Grid.CurrentPage;
            }

            scope.getNGGridPageSize = function () {
                return scope.Grid.PageSize;
            }

            scope.getNGGridPageItems = function () {
                return scope.Grid.PageItems;
            }

            scope.getNGGridSelectedItem = function () {
                if (scope.gridOptions.Selectable)
                    return scope.Grid.SelectedItem;
            }

            scope.getNGGridCheckedItems = function () {
                var checkedItems = [];
                for (var i in scope.Grid.PageItems) {
                    if (scope.Grid.PageItems[i].checked === true)
                        checkedItems.push(scope.Grid.PageItems[i]);
                }
                return checkedItems;
            }

            scope.getNGGridSearchModel = function () {
                return scope.Grid.SearchModel;
            }

            scope.getNGGridAllItems = function () {
                return scope.Grid.PageItems;
            }

            /* private function */

            scope.setCheckedItem = function (item) {
                if (item.checked === true) {
                    setTimeout(function () {
                        if (scope.onGridCheckedItem instanceof Function)
                            scope.onGridCheckedItem(item);
                    });
                }
            }

            scope.setNGGridPageSize = function (size) {
                if (scope.Grid.PageSize != size) {
                    scope.Grid.PageSize = size;
                    scope.setTotalPages();
                    scope.setNGGridPage(0);
                    scope.Grid.DataLoading = true;
                    scope.Grid.PageItems = [];
                    setTimeout(function () {                        
                        if (scope.onGridPageSizeChange) {
                            scope.onGridPageSizeChange();
                        }
                    }, 10);
                }
            }

            var searchMatch = function (haystack, needle) {
                if (!needle) {
                    return true;
                }
                return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
            };

            // init the filtered items
            scope.search = function () {
                scope.setNGGridTotals(0);
                scope.setNGGridPage(0);
            };

            scope.range = function (start, end) {
                var ret = [];
                if (!end) {
                    end = start;
                    start = 0;
                }
                for (var i = start; i < end; i++) {
                    ret.push(i);
                }
                return ret;
            };

            // change sorting order
            scope.sort_by = function (newSortingOrder, sortable) {
                if (sortable) {
                    if (scope.Grid.sortingOrder == newSortingOrder)
                        scope.Grid.reverse = !scope.Grid.reverse;
                    scope.Grid.sortingOrder = newSortingOrder;
                    // icon setup
                    $('th.headerSortDown i').each(function () {
                        // icon reset
                        $(this).removeClass().addClass('glyphicon glyphicon-sort');
                    });
                    if (scope.Grid.reverse)
                        $('th.' + newSortingOrder + ' i').removeClass().addClass('glyphicon glyphicon-sort-by-attributes-alt');
                    else
                        $('th.' + newSortingOrder + ' i').removeClass().addClass('glyphicon glyphicon-sort-by-attributes');
                }
            };

            scope.setTotalPages = function () {
                var tp=Math.ceil(scope.Grid.Totals / scope.Grid.PageSize);
                if (scope.Grid.TotalPages != tp)
                    scope.Grid.TotalPages = tp;
            }

            var SearchJson = function (json, path) {
                if (path.length <= 1) {
                    var value = json[path[0]] ? json[path[0]] : "";
                } else {
                    if (json[path[0]]) {
                        var temp;
                        json = json[path[0]];
                        path.splice(0, 1);
                        value = SearchJson(json, path);
                    } else {
                        value = "";
                    }
                }
                return value;
            }

            
            scope.FormatValue = function (json, pathStr, exprs) {
                var value = $parse(pathStr)(json);// SearchJson(json, pathStr.split("."));//
                if (exprs) {
                    for (var i in exprs) {
                        if (exprs[i] instanceof Object) {
                            for (var j in exprs[i]) {
                                value = $filter(j)(value, exprs[i][j]);
                            }
                        } else
                            value = $filter(exprs[i])(value);
                    }
                }
                return value;
            }

            // grid loaded
            if (scope.onGridLoad) {
                scope.Grid.DataLoading = true;
                scope.Grid.PageItems = [];
                scope.onGridLoad();
            }
        }
    }
}]);

RBUIApp.directive('ngIf', function () {
    return {
        link: function (scope, element, attrs) {
            if (scope.$eval(attrs.ngIf)) {
                element.replaceWith(element.children())
            } else {
                element.replaceWith(' ')
            }
        }
    }
});