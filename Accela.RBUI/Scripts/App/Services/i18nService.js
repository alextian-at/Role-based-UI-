"use strict"
var recordService = RBUIApp.
    factory('JsonResource', ["$resource", function ($resource) {
        return $resource('/PageBase/GetJsonResource?time=' + Math.random());
    }]);