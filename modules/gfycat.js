
embedMe.addModule(function(){
	"use strict";
	return {
		name: "Gfycat",
		domains: ["gfycat.com"],
		getPatterns: function() {
			return [
				/gfycat\.com\/([A-Z]\w*)$/i
			];
		},
		getEmbedFunction: function() {
			return function(name, url, text, node, replace) {
				GM_xmlhttpRequest({
					method: "GET",
					url: "//gfycat.com/cajax/get/" + name,
					onload: function(response) {
						var res = JSON.parse(response.responseText);
						if (res.error) {
							return;
						}
						var video = document.createElement("video");
						video.autoplay = true;
						video.loop = true;
						video.src = res.gfyItem.mp4Url;
						video.title = text;
						replace(video);
					}
				});
			};
		}
	};
});
