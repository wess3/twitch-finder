$(document).ready(function () {

  // Number Of Inputs
  let total = 3;
  // Number Of Streamers
  let num = 0;
  // Number Of Empty Spaces In Form
  let empty = 0;

  const twitchUsers = {};

  // Button Event Listeners
  $("#plus").on("click", addInput);
  $("#send").on("click", getUsers);

  // Add New Input
  function addInput() {
    $("#form").append(
      `<input class="input" type="text" name="user${++total}" value="">`
    );
  }

  // Create Object From Inputs
  function getUsers() {
    empty = 0;
    num = 0;

    $(".well-right").empty();
    $(".input").each(function(i) {
      if($(this).val()) {
        twitchUsers[i] = {};
        twitchUsers[i].name = $(this).val().toLowerCase();
        getMoreInfo(i, $(this).val());
      } else {
        empty++;
      }
    });
  }

  function getMoreInfo(index, name) {
    const url = `https://wind-bow.glitch.me/twitch-api/streams/${name}`;
    const user = twitchUsers[index];

    $.ajax({
      url: url,
      dataType: "jsonp",
      data: {
        format: "json"
      },

      success: function (data) {
        if (data.stream === null) {
          offlineUser(name, user);
        } else {
          user.status = "online";
          user.image = data.stream.channel.logo;
          user.link = data.stream.channel.url;
          user.stream = data.stream.channel.status;
          if (user.stream.length > 50) {
            user.stream = user.stream.substring(0,49) + "...";
          }
          user.info = `<p>game: ${data.stream.game}</p><p>viewers: ${data.stream.viewers}</p><p>type: ${data.stream.stream_type}</p>`;
          showUser(user);
        }
      }
    });

    function offlineUser(name, user) {
      $.ajax({
        url: `https://wind-bow.glitch.me/twitch-api/channels/${name}`,
        dataType: "jsonp",
        data: {
          format: "json"
        },

        success: function (data) {
          if (data.status === 404) {
            user.status = "unknown";
            user.image = "https://cdn.browshot.com/static/images/not-found.png";
            user.stream = "----User does not exists.----";
            user.link = "#";
          } else {
            user.status = "offline";
            user.image = data.logo;
            user.stream = "----User is offline.----";
            user.link = data.url;
          }
          user.info = "";
          showUser(user);
        }
      });
    }
  }

  function showUser(user) {
    num++;

    const profile =
    `<div class="profile">
      <div class="name""><img src="/img/${user.status}.png">${user.name}</div>
      <div class="data"">
        <img src="${user.image}" alt="img">
        <div class="text">
          <div class="stream-name"><a href="${user.link}" target="_blank">${user.stream}</a></div>
          <div class="stream-info">${user.info}</div>
        </div>
      </div>
    </div>`;

    $(".well-right").append(profile);
    $(".data").hide();
    $(".profile").css("min-height", "auto");

    if (num === total - empty) {
      $(".profile").on("click", function() {
        $(this).children(".data").toggle(1000);
      });
    }
  }

});
