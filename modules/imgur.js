embedMe.add(function(){
	"use strict";
	return {
		name: "Imgur gifv",
		domains: ["i.imgur.com", "imgur.com"],
		getPatterns: function() {
			return [
				/imgur\.com\/(\w+)(?:\.gifv|$)/i
			];
		},
		getEmbedFunction: function() {
			return function(id, url, text) {
				var container = document.createElement("div");
				container.title = text;
				container.innerHTML = '<blockquote class="imgur-embed-pub" lang="en" data-id="a/' + id + '" data-context="false"></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>';
				return container;
			};
		}
	};
});
