// ==UserScript==
// @name        Embed Me!
// @author      eight <eight04@gmail.com>
// @homepage    https://github.com/eight04/Embed-Me
// @supportURL  https://github.com/eight04/Embed-Me/issues
// @compatible  firefox
// @compatible  chrome
// @compatible  opera
// @version     0.2.1
// @namespace   eight04.blogspot.com
// @description An userscript to embed video, images from links.
// @include     http*
// @require     https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=57385
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @license     MIT
// ==/UserScript==

var embedMe = function(){

	"use strict";

	if (location.hash.indexOf("embed-me") >= 0) {
		return null;
	}

	var globalMods = [],
		index = {},
		config, re;

	GM_config.init("Embed Me!", {
		simple: {
			label: "Ignore complex anchor",
			type: "checkbox",
			default: true
		},
		excludes: {
			label: "Excludes these urls (regexp per line)",
			type: "textarea",
			default: ""
		}
	});

	function loadConfig() {
		config = GM_config.get();
		var exclude = config.excludes.trim();
		re = {
			excludeUrl: exclude && new RegExp(exclude.split(/\s*\n\s*/).join("|"), "i")
		};
	}

	function addModule(modProvider) {
		var mod = modProvider();

		if (mod.global) {
			globalMods.push(mod);
		} else {
			var i;
			for (i = 0; i < mod.domains.length; i++) {
				index[mod.domains[i]] = mod;
			}
		}
	}

	function validParent(node) {
		var cache = node;
		while (node != document.documentElement) {
			if (node.INVALID || node.className.indexOf("embed-me") >= 0) {
				cache.INVALID = true;
				return false;
			}
			if (!node.parentNode) {
				return false;
			}
			if (node.VALID) {
				break;
			}
			node = node.parentNode;
		}
		cache.VALID = true;
		return true;
	}

	function valid(node) {
		if (!validParent(node)) {
			return false;
		}
		if (node.nodeName != "A" || !node.href) {
			return false;
		}
		if (config.simple && (node.childNodes.length != 1 || node.childNodes[0].nodeType != 3)) {
			return false;
		}
		if (re.excludeUrl && re.excludeUrl.test(node.href)) {
			return false;
		}
		return true;
	}

	function getPatterns(mod) {
		if (!mod.getPatterns) {
			return [];
		}
		if (!mod.patterns) {
			mod.patterns = mod.getPatterns();
		}
		return mod.patterns;
	}

	function getEmbedFunction(mod) {
		if (!mod.embedFunction) {
			mod.embedFunction = mod.getEmbedFunction();
		}
		return mod.embedFunction;
	}

	function callEmbedFunc(node, params, func) {
		var replace = function (newNode) {
			if (!node.parentNode) {
				// The node was detached from DOM tree
				return;
			}
			newNode.classList.add("embed-me");
			node.parentNode.replaceChild(newNode, node);
		};
		params.push(node.href, node.textContent, node, replace);
		var result = func.apply(null, params);
		if (result) {
			replace(result);
		}
	}

	function embed(node) {
		if (!valid(node)) {
			return;
		}
		// Never process same element twice
		node.INVALID = true;

		var mods = [], mod, patterns, match, i, j;

		if (node.hostname in index) {
			mods.push(index[node.hostname]);
		}

		mods = mods.concat(globalMods);

		for (j = 0; j < mods.length; j++) {
			mod = mods[j];
			patterns = getPatterns(mod);

			for (i = 0; i < patterns.length; i++) {
				if ((match = patterns[i].exec(node.href))) {
					callEmbedFunc(node, Array.prototype.slice.call(match, 1), getEmbedFunction(mod));
					return;
				}
			}
		}
	}

	function observeDocument(callback) {

		setTimeout(callback, 0, document.body);

		new MutationObserver(function(mutations){
			var i;
			for (i = 0; i < mutations.length; i++) {
				if (!mutations[i].addedNodes.length) {
					continue;
				}
				callback(mutations[i].target);
			}
		}).observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	function init() {
		observeDocument(function(node){
			var links = node.querySelectorAll("a[href]"), i;
			for (i = 0; i < links.length; i++) {
				embed(links[i]);
			}
		});
	}

	loadConfig();

	GM_registerMenuCommand("Embed Me! - Configure", GM_config.open);
	GM_config.onclose = loadConfig;

	init();

	return {
		addModule: addModule
	};
}();


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
});

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
				if (e.origin.indexOf("imgur.com") < 0) {
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
				iframe.src = "//imgur.com/" + id + "/embed?w=540&ref=" + location.href + "#embed-me";
				return iframe;
			};
		}
	};
});

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
					url: "//soundcloud.com/oembed?format=json&url=" + url,
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

embedMe.addModule(function(){
	"use strict";
	return {
		name: "Twitch",
		domains: ["www.twitch.tv"],
		getPatterns: function() {
			return [
				/twitch\.tv\/(\w+)\/v\/(\d+)/i
			];
		},
		getEmbedFunction: function() {
			return function (user, id) {
				var container = document.createElement("div");
				container.innerHTML = '<object bgcolor="#000000" data="http://www.twitch.tv/swflibs/TwitchPlayer.swf" height="378" id="clip_embed_player_flash" type="application/x-shockwave-flash" width="620"><param name="movie" value="http://www.twitch.tv/swflibs/TwitchPlayer.swf" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="allowFullScreen" value="true" /><param name="flashvars" value="channel=' + user + '&amp;auto_play=false&amp;autoplay=false&amp;autostart=false&amp;start_volume=25&amp;videoId=v' + id + '" /></object><br /><a href="http://www.twitch.tv/' + user + '" style="padding:2px 0px 4px; display:block; width: 320px; font-weight:normal; font-size:10px; text-decoration:underline;">Watch live video from ' + user + ' on Twitch</a>';
				return container;
			};
		}
	};
});

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
				video.controls = true;
				video.title = text;
				video.src = url;
				return video;
			};
		}
	};
});

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
				/youtube\.com\/watch\?.*?v=([^&]+)/i,
				/youtu\.be\/([^?]+)/i,
				/youtube\.com\/embed\/([^?#]+)/,
				/youtube\.com\/v\/([^?#]+)/
			];
		},
		getEmbedFunction: function() {
			return function(id, url, text, node, replace) {
				url = "https://www.youtube.com/watch?v=" + id;
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
