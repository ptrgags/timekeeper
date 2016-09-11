'use strict';

var FORMAT = "YYYY-MM-DD HH:mm:ss Z z"

var app = angular.module('timekeeper', [])
app.controller('timekeeper', ["$scope", "$interval", ($scope, $interval) => {
    $scope.now = moment();
    $scope.timezone = "";
    $scope.local = () => {
        return $scope.now.local().format(FORMAT);
    };
    $scope.utc = () => {
        return $scope.now.utc().format(FORMAT);
    };
    $scope.unix = () => {
        return $scope.now.unix();
    };
    $scope.custom = () => {
        if ($scope.timezone === "")
            return "N/A";
        else
            return $scope.now.clone().tz($scope.timezone).format(FORMAT);
    };
    $scope.swatch = () => {
        var utc1 = $scope.now.clone().add(1, "hour")
        var seconds = utc1.hours() * 3600
            + utc1.minutes() * 60
            + utc1.seconds();
        var beats = Math.floor(seconds / 86.4);
        var date = utc1.format("DD.MM.YYYY");
        return `${date} @${beats}`;
    }

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
