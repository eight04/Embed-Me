embedMe.add(function(){
	"use strict";

	return {
		name: "Youtube",
		domains: [
			"www.youtube.com",
			"youtu.be"
		],
		getPatterns: function() {
			return [
				/https?:\/\/www\.youtube\.com\/watch\?v=([^&]+)/i,
				/https?:\/\/youtu\.be\/([^?]+)/i
			]
		},
		getEmbedFunction: function() {
			var apiKey = "AIzaSyCPVYeYLN1cgutHpSwv8dQR0CVws26sSs0";

			return function(id, url, text, replace) {
				// Grab embeding code from google api
				GM_xmlhttpRequest({
					method: "GET",
					url: "https://www.googleapis.com/youtube/v3/videos?id=" + id + "&part=player&fields=item/player&key=" + apiKey,
					onload: function(response) {
						var embedHtml = JSON.parse(response.responseText).items[0].player.embedHtml,
							container = document.createElement("div");

						container.innerHTML = embedHtml;
						replace(container);
					}
				});
			}
		}
	}
});
