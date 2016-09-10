'use strict';

var app = angular.module('timekeeper', [])
app.controller('timekeeper', ["$scope", "$interval", ($scope, $interval) => {
    $scope.now = moment();
    $scope.timezone = "";
    $scope.local = () => {
        return $scope.now.local().format();
    };
    $scope.utc = () => {
        return $scope.now.utc().format();
    };
    $scope.unix = () => {
        return $scope.now.unix();
    };
    $scope.custom = () => {
        if ($scope.timezone === "")
            return "";
        else
            return $scope.now.tz($scope.timezone).format();
    };

    $interval(() => {
        $scope.now = moment();
    });
}]);

$(document).ready(() => {
    for (var tz of moment.tz.names()) {
        var tz_option = $("<option>")
            .attr("value", tz)
            .text(tz);
        $("#tz-select").append(tz_option);
    }
});
