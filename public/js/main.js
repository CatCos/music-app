$(document).on("click", "button.followButton", function(e) {
  e.preventDefault();
  $button = $(this);
  if (!$button.hasClass('following')) {

    // $.ajax(); Do Follow
    var mkid = this.id
    var data = "artist:" + $button.id
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

    $.ajax(settings).done(function(response) {
      console.log(response);


      $button.addClass('following');
      $button.text('Following');
      $(".alert").show();
    });

  }
});


$(document).on("hover", "button.followButton", function(e) {
  $button = $(this);
  if ($button.hasClass('following')) {
    $button.addClass('unfollow');
    $button.text('Unfollow');
  }
}, function() {
  if ($button.hasClass('following')) {
    $button.removeClass('unfollow');
    $button.text('Following');
  }
});


function getArtists(value) {
  $.post("/search", {
    artist: value
  }, function(result) {
    $("#table-results > tbody").html("");
    for (var i = 0; i < result.length; i++) {
      var elem = "<tr><td style='width:160px;'><img src='" + result[i].photo + "' class='img-rounded' height='150' width='150'></td><td style='width:80px;'>" + result[i].mkid + "</td><td>" + result[i].name + "</td>"

      elem = elem + "<td><p>"
      var genres = result[i].genres
      for (var j = 0; j < genres.length; j++) {
        elem = elem + genres[j].name + "<br>"
      }
      elem = elem + "</p></td>"
      if (result[i].is_favorite) {
        elem = elem + "<td><button class='btn-follow followButton following' rel='6' id=" + result[i].mkid + ">Following</button></td><tr>"
      } else {
        elem = elem + "<td><button class='btn-follow followButton' rel='6' id=" + result[i].mkid +
          ">Follow</button></td><tr>"
      }
      $('#table-results > tbody:last-child').append(elem);
    }

    $('#results').show();
    $('#search').val("")
  });
}
