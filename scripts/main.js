$(document).ready(() => {
    var now = moment()
    $("#test").html(now.format())
    $("#test2").html(now.utc().format())
});
