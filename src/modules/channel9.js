export default {
  name: "Channel 9",
  domains: ["channel9.msdn.com"],
  getPatterns: function() {
    return [
      /channel9\.msdn\.com\/[\w-]/i
    ];
  },
  getEmbedFunction: function() {
    return function (url) {
      var urlPlayer = url + '/player?format=html5';
      var container = document.createElement("div");
      container.innerHTML = '<iframe src="' + urlPlayer + '" width="640" height="360" allowFullScreen frameBorder="0" title="' + url + '"></iframe>';
      return container;
    };
  }
};