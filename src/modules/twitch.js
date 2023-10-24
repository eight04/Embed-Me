export default {
  name: "Twitch",
  domains: ["www.twitch.tv"],
  getPatterns: function() {
    return [
      /twitch\.tv\/(\w+)\/(v)\/(\d+)/i,
      /twitch\.tv\/()(videos)\/(\d+)/i,
      /twitch\.tv\/(\w+)\/(clip)\/([^/]+)/i,
    ];
  },
  getEmbedFunction: function() {
    return function (user, type, id) {
      var container = document.createElement("div");
      if (type == "v" || type == "videos") {
        container.innerHTML = `<iframe src="https://player.twitch.tv/?video=${id}&autoplay=false&parent=${location.hostname}" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>`;
      } else if (type == "clip") {
        container.innerHTML = `<iframe src="https://clips.twitch.tv/embed?clip=${id}&autoplay=false&parent=${location.hostname}" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>`;
      }
      return container;
    };
  }
};
