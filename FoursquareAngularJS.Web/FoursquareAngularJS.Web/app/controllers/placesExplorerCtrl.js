﻿app.controller('placesExplorerController', function ($scope,$modal, placesExplorerService, placesPhotosService, $filter) {

    $scope.exploreNearby = "San Francisco";
    $scope.exploreQuery = "";
    $scope.filterValue = "";

    // Filtered Places
    $scope.places = [];
    $scope.filteredPlaces = [];
    $scope.filteredPlacesCount = 0;

    //Paging
    $scope.totalRecordsCount = 0;
    $scope.pageSize = 10;
    $scope.currentPage = 1;

    // initialize the watch and get the places on load
    init();

    function init() {

        createWatche();
        getPlaces();
    }

    // Get the result from Forsquare api
    function getPlaces() {

        var offset = ($scope.pageSize) * ($scope.currentPage - 1);

        placesExplorerService.get({ near: $scope.exploreNearby, query: $scope.exploreQuery, limit: $scope.pageSize, offset: offset }, function (placesResult) {

            if (placesResult.response.groups) {
                $scope.places = placesResult.response.groups[0].items;
                $scope.totalRecordsCount = placesResult.response.totalResults;
                filterPlaces('');
            }
            else {
                $scope.places = [];
                $scope.totalRecordsCount = 0;
            }
        });
    };

    function filterPlaces(filterInput) {
        $scope.filteredPlaces = $filter("placeNameCategoryFilter")($scope.places, filterInput);
        $scope.filteredPlacesCount = $scope.filteredPlaces.length;
    }

    function createWatche() {

        $scope.$watch("filterValue", function (filterInput) {
            filterPlaces(filterInput);
        });
    }

   // Call this method when the search button is clicked
    $scope.doSearch = function () {
        $scope.currentPage = 1;
        getPlaces();
    };

    // Call this method when the user clicks on  page buttons
    $scope.pageChanged = function (page) {

        $scope.currentPage = page;
        getPlaces();
    };

    // Create the category icon
    $scope.buildCategoryIcon = function (icon) {

        return icon.prefix + '44' + icon.suffix;
    };

    // Create the venue thumbnail
    $scope.buildVenueThumbnail = function (photo) {

        return photo.items[0].prefix + '128x128' + photo.items[0].suffix;
    };
    

     // Get the images from Foursquare api
    $scope.showVenuePhotos = function (venueId, venueName) {

        placesPhotosService.get({ venueId: venueId }, function (photosResult) {

            var modalInstance = $modal.open({
                templateUrl: 'app/views/placesphotos.html',
                controller: 'placesPhotosController',
                resolve: {
                    venueName: function () {
                        return venueName;
                    },
                    venuePhotos: function () {
                        return photosResult.response.photos.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                //$scope.selected = selectedItem;
            }, function () {
                //alert('Modal dismissed at: ' + new Date());
            });

        });
    };
});