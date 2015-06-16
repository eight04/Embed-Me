// ==UserScript==
// @name        Embed Me!
// @version     0.1.0
// @namespace   eight04.blogspot.com
// @description An userscript to embed video, images from links.
// @include     http*
// @require     https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=56964
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @license     MIT
// ==/UserScript==

var embedMe = function(){

	"use strict";

	var mods = [],
		index = {},
		config, re;

	config = GM_config.init("Embed Me!", {
		simple: {
			label: "Ignore complex anchor",
			type: "checkbox",
			default: true
		},
		excudes: {
			label: "Excludes these urls",
			type: "textarea",
			default: "example\.com\nexample2\.com"
		}
	});

	function loadConfig() {
		config = GM_config.get();
		re = config.excludes.trim().splt(/\s*\n\s*/).join("|");
	}

	function addModule(mod) {
		mods.push(mod);

		var i;
		for (i = 0; i < mod.domains.length; i++) {
			index[mod.domains[i]] = mod;
		}
	}

	function valid(node) {
		if (node.nodeName != "A" || !node.href || !(node.hostname in index)) {
			return false;
		}
		if (config.simple && node.childNodes.length > 1) {
			return false;
		}
		if (re.excludeUrl.test(node.href)) {
			return false;
		}
		return true;
	}

	function getModule(host) {
		return index[host];
	}

	function getPatterns(mod) {
		if (!mod.patterns) {
			mod.patterns = mod.getPatterns();
		}
		return mod.patterns;
	}

	function getEmbedFunction(mod) {
		if (!mod.embedFunction) {

		}
	}

	function embed(node) {
		if (!valid(node)) {
			return;
		}

		var mod = index[node.host],
			patterns = getPatterns(mod),
			match, i, args, newElement;

		for (i = 0; i < patterns.length; i++) {
			if ((match = patterns[i].match(node.href))) {
				args = Array.slice.call(match, 1);
				args.push(node.href, node);
				newElement = getEmbedFunction(mod).apply(null, args);
				node.parentNode.replaceChild(newElement, node);
				return;
			}
		}
	}

	return {
		embed: embed,
		addModule: addModule
	};
}();


var embedMe = function() {

	var embedFunction = {
		image: function(url, element) {
			var obj;
			if (!config.useImg || !/^[^?#]+\.(jpg|png|gif|jpeg)($|[?#])/i.test(url)) {
				return null;
			}
			obj = document.createElement("img");
			obj.className = "embedme-image";
			obj.alt = url;
			obj.src = url;
			element = element.cloneNode(false);
			element.appendChild(obj);
			return element;
		},
		youtube: function(url) {
			var id, cont, wrap, obj;
			if (!config.useYT || !(id = getYoutubeId(url))) {
				return null;
			}
			cont = document.createElement("div");
			cont.className = "embedme-video";

			wrap = document.createElement("div");
			wrap.className = "embedme-video-wrap";
			cont.appendChild(wrap);

			obj = document.createElement("iframe");
			obj.className = "embedme-video-iframe";
			obj.src = "https://www.youtube.com/embed/" + id;
			obj.setAttribute("allowfullscreen", "true");
			obj.setAttribute("frameborder", "0");
			wrap.appendChild(obj);

			return cont;
		}
	};

	function embedContent(element) {
		var url = element.href, key, embed;

		if (!element.parentNode) {
			return;
		}

		for (key in embedFunction) {
			embed = embedFunction[key](url, element);
			if (embed) {
				embed.classList.add("embedme");
				element.parentNode.replaceChild(embed, element);
				return;
			}
		}
		//	element.classList.add("embedme-fail");
	}

	function embed(node) {
		var result, nodes = [], i, xpath;

		if (config.embedAll) {
			xpath = ".//a[not(*) and text() and @href and not(contains(@class, 'embedme'))]";
		} else {
			xpath = ".//a[not(*) and text() and @href and not(contains(@class, 'embedme')) and contains(@class, 'linkifyplus')]";
		}

		result = document.evaluate(xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

		for (i = 0; i < result.snapshotLength; i++) {
			nodes.push(result.snapshotItem(i));
		}

		loop(nodes, embedContent);
	}

	return {
		embed: embed
	};
}();

observeDocument(embedMe.embed);

function template(text, option) {
	var key;
	for (key in option) {
		text = text.split("@" + key).join(option[key]);
	}
	return text;
}

