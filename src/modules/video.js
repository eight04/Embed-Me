export default {
  name: "Video",
  global: true,
  getPatterns: function() {
    return [
      /^[^?#]+\.(?:mp4|webm|ogv|mov)(?:$|[?#])/i
    ];
  },
  getEmbedFunction: function() {
    return function (url, text) {
      var video = document.createElement("video");
      video.controls = true;
      video.title = text;
      video.src = url;
      return video;
    };
  }
};
