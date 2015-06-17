embedMe.addModule(function(){
	"use strict";
	return {
		name: "SoundCloud",
		domains: ["soundcloud.com"],
		getPatterns: function() {
			return [
				/soundcloud\.com\/[\w-]+\/[\w-]+(?:\?|$)/i
			];
		},
		getEmbedFunction: function(){
			return function(url, text, node, replace) {
				GM_xmlhttpRequest({
					method: "GET",
					url: "http://soundcloud.com/oembed?format=json&url=" + url,
					onload: function(response) {
						if (!response.responseText) {
							return;
						}
						var html = JSON.parse(response.responseText).html;
						var container = document.createElement("div");
						container.innerHTML = html;
						replace(container);
					}
				});
			};
		}
	};
});
