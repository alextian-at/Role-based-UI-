"use strict"
RBUIApp.factory("MapService", ["$q", "$rootScope", function ($q, $rootScope) {
    var MapService = {};
    MapService.loaded = false;
    var MapClass,Point,LocatorClass, Graphic,
             InfoTemplate, SimpleMarkerSymbol,
             Font, TextSymbol,
             arrayUtils, Color,
             number, parser, dom, registry, arcgisUtils;
    var webmapId = "b56de0a201f543bab8a34a42b31560dd";
    var map, locator;
    var xCoordinator, yCoordinator;
    MapService.Loader = function () {
        var deferred = $q.defer();
        if (!MapService.loaded) {
            $.getScript("/Scripts/CommonJs/Map/Map.js", function (data, textStatus, jqxhr) {
                require([
                  "esri/map", "esri/geometry/Point", "esri/tasks/locator", "esri/graphic",
                  "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol",
                  "esri/symbols/Font", "esri/symbols/TextSymbol",
                  "dojo/_base/array", "dojo/_base/Color",
                  "dojo/number", "dojo/parser", "dojo/dom", "dijit/registry",
                   "esri/arcgis/utils",
                  "dijit/form/Button", "dijit/form/Textarea",
                  "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!"
                ], function (
                  _Map,_Point,_Locator, _Graphic,
                  _InfoTemplate, _SimpleMarkerSymbol,
                  _Font, _TextSymbol,
                  _arrayUtils, _Color,
                  _number, _parser, _dom, _registry, _arcgisUtils
                ) {
                    MapClass = _Map;
                    Point = _Point;
                    LocatorClass = _Locator;
                    Graphic = _Graphic;
                    InfoTemplate = _InfoTemplate;
                    SimpleMarkerSymbol = _SimpleMarkerSymbol;
                    Font = _Font;
                    TextSymbol = _TextSymbol;
                    arrayUtils = _arrayUtils;
                    Color = _Color;
                    number = _number;
                    parser = _parser;
                    dom = _dom;
                    registry = _registry;
                    arcgisUtils = _arcgisUtils;
                    $rootScope.$apply(function () {
                        deferred.resolve();
                    });
                    MapService.loaded = true;
                });
            });
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }


    MapService.CreateMap = function (id) {
        var deferredCreate = $q.defer();
        try {
            //parser.parse();
            arcgisUtils.createMap(webmapId, id, { center: [-70.6508, 43.1452], zoom: 2 }).then(function (response) {
                map = response.map;
                locator = new LocatorClass("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
                locator.on("address-to-locations-complete", showResults);
                // listen for button click then geocode
                //registry.byId("locate").on("click", locate);
                map.infoWindow.resize(120, 120);
                if (!$rootScope.$$parse) {
                    $rootScope.$apply(function () {
                        deferredCreate.resolve();
                    });
                } else {
                    deferredCreate.resolve();
                }
            });
        } catch (e) {
            console.log("createmap exception = " + e);
        }
        return deferredCreate.promise;
    }
     
    MapService.locate = function (strAddress, _xCoordinator,_yCoordinator) {
        if (map != undefined) {
            xCoordinator = _xCoordinator;
            yCoordinator = _yCoordinator;
            map.graphics.clear();
            if (strAddress != "") {
                var address = {
                    "SingleLine": strAddress
                };
                locator.outSpatialReference = map.spatialReference;
                var options = {
                    address: address,
                    outFields: ["Loc_name"]
                }
            //var addressvalue = dom.byId("address").value;
            if (xCoordinator != undefined && yCoordinator != undefined)
            {
                locator.addressToLocations(options);
            }
            else{
                    locator.addressToLocations(options);
                }
            }
        }
    }

    var showResults = function (evt) {
        var candidate;
        var symbol = new SimpleMarkerSymbol();
        var infoTemplate = new InfoTemplate(
          "Location",
          "Address: ${address}<br />Score: ${score}<br />Source locator: ${locatorName}"
        );
        symbol.setStyle(SimpleMarkerSymbol.STYLE_NORMAL);
        symbol.setColor(new Color([153, 0, 51, 0.75]));

        var geom;
        arrayUtils.every(evt.addresses, function (candidate) {
            if (candidate.score > 80) {

                var attributes = {
                    address: candidate.address,
                    score: candidate.score,
                    locatorName: candidate.attributes.Loc_name
                };
                if (xCoordinator != undefined && yCoordinator != undefined)
                {
                    candidate.location.x = xCoordinator;
                    candidate.location.y = yCoordinator;
                }
                geom = candidate.location;
                var graphic = new Graphic(geom, symbol, attributes, infoTemplate);
                //add a graphic to the map at the geocoded location
                map.graphics.add(graphic);
                //add a text symbol to the map listing the location of the matched address.
                var displayText = candidate.address;
                var font = new Font(
                  "16pt",
                  Font.STYLE_NORMAL,
                  Font.VARIANT_NORMAL,
                  Font.WEIGHT_BOLD,
                  "Helvetica"
                );

                var textSymbol = new TextSymbol(
                  displayText,
                  font,
                  new Color("#1E90FF")
                );
                textSymbol.setOffset(0, 8);
                map.graphics.add(new Graphic(geom, textSymbol));
                return false; //break out of loop after one candidate with score greater  than 80 is found.
            }
        });
        if (geom !== undefined) {
            map.centerAndZoom(geom, 12);
        }
    }
    return MapService;
}]);