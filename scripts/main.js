'use strict';

var FORMAT = "YYYY-MM-DD HH:mm:ss Z z"

var app = angular.module('timekeeper', [])
app.controller('timekeeper', ["$scope", "$interval", ($scope, $interval) => {
    $scope.now = moment();
    $scope.timezone = "";

    //Current time to local, UTC, unix and custom timezone
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
        if (!$scope.timezone)
            return "N/A";
        else
            return $scope.now.clone().tz($scope.timezone).format(FORMAT);
    };
    //Convert to Swatch Internet Time just for fun
    $scope.swatch = () => {
        var utc1 = $scope.now.clone().add(1, "hour")
        var seconds = utc1.hours() * 3600
            + utc1.minutes() * 60
            + utc1.seconds();
        var beats = Math.floor(seconds / 86.4);
        var date = utc1.format("DD.MM.YYYY");
        return `${date} @${beats}`;
    }

    //Find the difference in hours between two timezones
    $scope.tz_diff = () => {
        var hours_diff = "N/A";
        if ($scope.timezone_left && $scope.timezone_right) {
            var left_offset = $scope.now.clone().tz($scope.timezone_left).utcOffset();
            var right_offset = $scope.now.clone().tz($scope.timezone_right).utcOffset();
            hours_diff = (right_offset - left_offset) / 60;
        }

        var left = $scope.timezone_left;
        var right = $scope.timezone_right;
        var diff_desc = "";
        if (hours_diff === "N/A")
            diff_desc = "N/A"
        else if (hours_diff === 0)
            diff_desc = `${left} is the same time as ${right}`;
        else if (hours_diff < 0)
            diff_desc = `${left} is ${Math.abs(hours_diff)} hours ahead of ${right}`;
        else if (hours_diff > 0)
            diff_desc = `${left} is ${hours_diff} hours behind ${right}`;

        return diff_desc;
    }
    //Convert time from one timezone to another.
    $scope.time_right = () => {
        if (!$scope.datetime_left || !$scope.timezone_left || !$scope.timezone_right)
            return "N/A"

        //Date is in local time. Strip out timezone info
        var date = $scope.datetime_left;
        var naive = moment(date).format("YYYY-MM-DD HH:mm:ss");

        //Construct with left timezone
        var left_time = moment.tz(naive, "YYYY-MM-DD HH:mm:ss", $scope.timezone_left);

        //Convert to right timezone and display
        var right_time = left_time.tz($scope.timezone_right);
        return right_time.format(FORMAT);
    };

    //Panel 3: Convert unix timestamp to UTC or local time
    $scope.unix_to_utc = () => {
        if (!$scope.unix_timestamp)
            return "N/A"
        else
            return moment.unix($scope.unix_timestamp).utc().format(FORMAT);
    };
    $scope.unix_to_local = () => {
        if (!$scope.unix_timestamp)
            return "N/A"
        else
            return moment.unix($scope.unix_timestamp).format(FORMAT);
    };

    //Update the current time every second
    $interval(() => {
        $scope.now = moment();
    });
}]);

$(document).ready(() => {
    for (var tz of moment.tz.names()) {
        var tz_option = $("<option>")
            .attr("value", tz)
            .text(tz);
        var tz_option_left = $(tz_option).clone();
        var tz_option_right = $(tz_option).clone();
        $("#tz-select").append(tz_option);
        $("#tz-select-left").append(tz_option_left);
        $("#tz-select-right").append(tz_option_right);
    }
});
