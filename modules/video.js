embedMe.addModule(function(){
	"use strict";
	return {
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
				video.src = url;
				video.title = text;
				return video;
			};
		}
	};
});
