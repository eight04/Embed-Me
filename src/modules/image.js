export default {
  name: "Image",
  global: true,
  getPatterns: function() {
    return [
      /^[^?#]+\.(?:jpg|png|gif|jpeg)(?:$|[?#])/i
    ];
  },
  getEmbedFunction: function() {
    GM_addStyle(".embed-me-image { max-width: 90%; }");
    return function(url, text, node) {
      var image = new Image;
      image.title = text;
      image.className = "embed-me-image";
      image.src = url;
      node = node.cloneNode(false);
      node.appendChild(image);
      return node;
    };
  }
};
