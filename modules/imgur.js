embedMe.addModule(function(){
	"use strict";
	return {
		name: "Imgur gifv",
		domains: ["i.imgur.com", "imgur.com"],
		getPatterns: function() {
			return [
				/imgur\.com\/(\w+)(\.gifv|$)/i
			];
		},
		getEmbedFunction: function() {
			GM_addStyle('.imgur-embed-iframe-pub { box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.10); border: 1px solid #ddd; border-radius: 2px; margin: 10px 0; width: 540px; overflow: hidden; }');

			window.addEventListener("message", function(e){
				if (e.origin != "http://imgur.com") {
					return;
				}

				var data = JSON.parse(e.data),
					id = data.href.match(/imgur\.com\/(\w+)\//)[1],
					css = '.imgur-embed-iframe-pub-' + id + '-' + data.context + '-540 { height: ' + data.height + 'px!important; width: 540px!important; }';

				GM_addStyle(css);
			});

			return function(id) {
				var iframe = document.createElement("iframe");
				iframe.className = "imgur-embed-iframe-pub imgur-embed-iframe-pub-" + id + "-true-540";
				iframe.scrolling = "no";
				iframe.src = "http://imgur.com/" + id + "/embed?w=540&ref=" + location.href;
				return iframe;
			};
		}
	};
});
