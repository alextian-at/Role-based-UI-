RBUIApp.factory("LazyLoadService", ["$q", function ($q) {
    var LazyLoader = {};
    LazyLoader.LoadPiwik = function () {
        var deferPiwik = $q.$defer();
        $.getScript("/", function (data, textStatus, jqxhr) {

        });
        return deferPiwik.promise;
    }
}]);