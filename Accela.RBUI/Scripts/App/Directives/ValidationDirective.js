var DATE_PATTERN = /^([0,1]?\d{1}[\/\-\\](([0-2]?\d{1})|([3][0,1]{1}))[\/\-\\](([1-9]{1}\d{3})))\b$/,//|((([1-9]{1}\d{3}))[\/\-\\][0,1]?\d{1}[\/\-\\](([0-2]?\d{1})|([3][0,1]{1})))\b
    MOBILEPHONE_PATTERN = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
    TELEPHONE_PATTERN = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
RBUIApp.directive("accelaDate", [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (DATE_PATTERN.test(viewValue)) {
                    ctrl.$setValidity('accelaDate', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('accelaDate', false);
                    return undefined;
                }
            });
        }
    }
}]);

RBUIApp.directive("accelaNumber", [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    }
}])

RBUIApp.directive("accelaMobilephone", [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (MOBILEPHONE_PATTERN.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('accelaMobilephone', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('accelaMobilephone', false);
                    return undefined;
                }
            });
        }
    }
}]);

RBUIApp.directive("accelaTelephone", [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (TELEPHONE_PATTERN.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('accelaMobilePhone', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('accelaMobilePhone', false);
                    return undefined;
                }
            });
        }
    }
}]);