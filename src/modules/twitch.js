export default {
  name: "Twitch",
  domains: ["www.twitch.tv"],
  getPatterns: function() {
    return [
      /twitch\.tv\/(\w+)\/v\/(\d+)/i
    ];
  },
  getEmbedFunction: function() {
    return function (user, id) {
      var container = document.createElement("div");
      container.innerHTML = '<object bgcolor="#000000" data="http://www.twitch.tv/swflibs/TwitchPlayer.swf" height="378" id="clip_embed_player_flash" type="application/x-shockwave-flash" width="620"><param name="movie" value="http://www.twitch.tv/swflibs/TwitchPlayer.swf" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="allowFullScreen" value="true" /><param name="flashvars" value="channel=' + user + '&amp;auto_play=false&amp;autoplay=false&amp;autostart=false&amp;start_volume=25&amp;videoId=v' + id + '" /></object><br /><a href="http://www.twitch.tv/' + user + '" style="padding:2px 0px 4px; display:block; width: 320px; font-weight:normal; font-size:10px; text-decoration:underline;">Watch live video from ' + user + ' on Twitch</a>';
      return container;
    };
  }
};
