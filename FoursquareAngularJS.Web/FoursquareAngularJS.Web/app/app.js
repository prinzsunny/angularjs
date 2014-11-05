var app = angular.module('FoursquareApp', ['ngRoute', 'ngResource', 'ui.bootstrap']);
app.config(function ($routeProvider) {

    $routeProvider.when("/explore", {
        controller: "placesExplorerController",
        templateUrl: "/app/views/placesresults.html"
    });
    $routeProvider.otherwise({ redirectTo: "/explore" });

});