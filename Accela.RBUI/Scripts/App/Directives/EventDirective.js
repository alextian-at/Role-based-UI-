RBUIApp.directive('ngBlur', function ($document) {
    return {
        link: function (scope, element, attrs) {
            $(element).bind('blur', function (e) {
                scope.$apply(attrs.ngBlur);
            });
        }
    }
})

// event stop propagation
RBUIApp.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind(attr.stopEvent, function (e) {
                e.stopPropagation();
            });
        }
    };
});
RBUIApp
.directive('myRepeatDirective', function () {
    return function (scope, element, attrs) {
        
        if (scope.$first) {
            console.log(new Date().getTime() + "=====start");
        }

        if (scope.$last) {
            console.log(new Date().getTime()+"=====end");
        }
    };
})