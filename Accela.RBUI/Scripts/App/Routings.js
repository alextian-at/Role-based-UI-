"use strict"

RBUIApp.config(['$routeProvider', "$locationProvider", function ($routeProvider, $locationProvider) {    
    $routeProvider.
         when('/MyDashboard', {
             templateUrl: '/AppViews/Inspector/MyDashboard/MyDashboard.html',
             controller: "GetInspectionsCtrl"
         }).
        when('/InspectionSummary/:group/:id', {
            templateUrl: '/AppViews/Inspector/InspectionSummary.html',
            controller: "InspectionSummaryCtrl"
        }).
         when('/InspectionSummary/:group/:id/checklist', {
             templateUrl: '/AppViews/Inspector/checklists.html',
             controller: "ChecklistCtrl"
         }).
         when('/InspectionSummary/:group/:id/conditions', {
             templateUrl: '/AppViews/Inspector/conditions.html',
             controller: "ConditionController"
         }).
         when('/Inspections', {
             templateUrl: '/AppViews/Inspector/InspectorIndex.html',
             controller: "GetAllInspectionsCtrl"
         }).
         when('/Permits', {
             templateUrl: '/AppViews/Permits/PermitsIndex.html',
             controller: "PermitsCtrl"
         }).
        when('/Intake', {
            templateUrl: '/AppViews/Permits/IntakeForm.html',
            controller:"IntakeFormCtrl"
        }).
        when('/CreatePermits', {
            templateUrl: '/AppViews/Permits/CreateForm.html',
            controller:"CreateFormController"
        }).
        when("/Analytics", {
            templateUrl: '/AppViews/Analytics/AnalyticsIndex.html'
        }).
        when("/SubmissionComplete", {
            templateUrl: '/AppViews/Permits/SubmissionComplete.html'
        }).
        otherwise({ redirectTo: '/MyDashboard' });
}]);