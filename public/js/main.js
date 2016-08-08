$(document).on("click", "button.followButton", function(e){
    e.preventDefault();
    $button = $(this);
    if($button.hasClass('following')){

        //$.ajax(); Do Unfollow

        $button.removeClass('following');
        $button.removeClass('unfollow');
        $button.text('Follow');
    } else {

        // $.ajax(); Do Follow
        var data = "artist:" + $button.id
        console.log(this.id)
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "/favorites/add",
          "method": "PUT",
          "headers": {
            "cache-control": "no-cache",
            "postman-token": "a8b0cb48-0d33-4604-79e2-5f2ea7244f8a",
            "content-type": "application/x-www-form-urlencoded"
          },
          "data": {
            "mkid": this.id
          }
        }

        $.ajax(settings).done(function (response) {
          console.log(response);


          $button.addClass('following');
          $button.text('Following');

          $('#modalConfirm').modal('toggle');
        });

    }
});

$(document).on("hover", "button.followButton", function(e){
   $button = $(this);
    if($button.hasClass('following')){
        $button.addClass('unfollow');
        $button.text('Unfollow');
    }
}, function(){
    if($button.hasClass('following')){
        $button.removeClass('unfollow');
        $button.text('Following');
    }
});
