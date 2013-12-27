RBUIApp.factory("ApiService", ["$resource", function ($resource) {
    var service = {};
    service.Inspection = {};//current inspection
    service.ApiRequest = $resource("/app/ApiRequest?url=:url&version=:version&time=:time", {}, { update: { method: "PUT" }, search :{ method: "POST"} });
    service.GetInspections = $resource('/App/GetInspections?time=:time', {});
    service.GetSummary = $resource('/App/GetInspectionSummary/:id', { id: '@id' });
    service.GetInspectors = $resource('/App/GetInspectors');
    service.GetInspectionStatus = $resource('/App/GetInspectionStatus', {}, { update: { method: "PUT" }, search: { method: "POST" } });
    service.WriteLog = $resource('/App/WriteLog?time=:time', {}, { update: { method: "PUT" }, search: { method: "POST" } });
    service.ResultInspections = $resource('/App/ResultInspections?url=:url', {}, { update: { method: "PUT" }, search: { method: "POST" } });
    return service;
}]);