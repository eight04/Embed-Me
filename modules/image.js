embedMe.addModule(function(){
	"use strict";

	return {
		name: "Image",
		global: true,
		getPatterns: function() {
			return [
				/^[^?#]+\.(?:jpg|png|gif|jpeg)(?:$|[?#])/i
			];
		},
		getEmbedFunction: function() {
			return function(url, text, node) {
				var image = new Image;
				image.src = url;
				image.title = text;
				node = node.cloneNode(false);
				node.appendChild(image);
				return node;
			};
		}
	};
});
