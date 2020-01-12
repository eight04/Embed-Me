export default {
  name: "Fumen",
  global: true,
  getPatterns: function() {
    return [
      /(?:fumen\.zui\.jp|harddrop\.com\/fumen)[^?]*\?(v115@.*)/i
    ];
  },
  getEmbedFunction: function() {
    return function (data, url, text, node) {
      var image = new Image;
      image.title = text;
      image.className = "embed-me-fumen";
      image.src = `https://fumen-svg-server--eight041.repl.co/?data=${encodeURIComponent(data)}`;
      node = node.cloneNode(false);
      node.appendChild(image);
      return node;
    };
  }
};
