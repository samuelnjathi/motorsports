$(document).ready(function () {
    $(".thumbnail img").click(function () {
        var imgUrl = $(this).attr("src");
        $("#mainDisplay").attr("src", imgUrl);
    });
});
