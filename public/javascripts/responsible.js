$(document).ready(() => {

    console.log('Client-side code running');

    $('#firstButton').on("click", (evt) => {
        console.log("Clicked submitButton");
        console.log("Redirect to map");
        window.location.href = "/map";
    });


});



