embedMe.addModule(function(){
	"use strict";

	return {
		name: "Youtube",
		domains: [
			"www.youtube.com",
			"youtu.be"
		],
		getPatterns: function() {
			return [
				/youtube\.com\/watch\?v=([^&]+)/i,
				/youtu\.be\/([^?]+)/i
			];
		},
		getEmbedFunction: function() {
			return function(id, url, text, replace) {
				GM_xmlhttpRequest({
					method: "GET",
					url: "//www.youtube.com/oembed?format=json&url=" + url,
					onload: function(response) {
						var html = JSON.parse(response.responseText).html,
							container = document.createElement("div");

						container.innerHTML = html;
						replace(container);
					}
				});
			};
		}
	};
});
