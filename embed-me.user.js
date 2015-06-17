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
		globalMods = [],
		index = {},
		config, re;

	GM_config.init("Embed Me!", {
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
		var exclude = config.excludes.trim();
		re = {
			excludeUrl: exclude && new RegExp(exclude.split(/\s*\n\s*/).join("|"), "i")
		};
	}

	function addModule(mod) {
		mods.push(mod);

		if (mod.global) {
			globalMods.push(mod);
		} else {
			var i;
			for (i = 0; i < mod.domains.length; i++) {
				index[mod.domains[i]] = mod;
			}
		}
	}

	function valid(node) {
		if (node.nodeName != "A" || !node.href) {
			return false;
		}
		if (config.simple && node.childNodes.length > 1) {
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

		var mod, patterns, match, i, j;

		if (node.hostname in index) {
			mod = index[node.hostname];
			patterns = getPatterns(mod);

			for (i = 0; i < patterns.length; i++) {
				if ((match = patterns[i].match(node.href))) {
					callEmbedFunc(node, Array.slice.call(match, 1), getEmbedFunction(mod));
					return;
				}
			}
		}

		for (j = 0; j < globalMods.length; j++) {
			mod = globalMods[j];
			patterns = getPatterns(mod);

			for (i = 0; i < patterns.length; i++) {
				if ((match = patterns[i].match(node.href))) {
					callEmbedFunc(node, Array.slice.call(match, 1), getEmbedFunction(mod));
					return;
				}
			}
		}
	}

	function observeDocument(callback) {

		callback(document.body);

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

	loadConfig();

	GM_registerMenuCommand("Embed Me! - Configure", GM_config.open);
	GM_config.onclose = loadConfig;

	observeDocument(function(node){
		var links = node.querySelector("a[href]"), i;
		for (i = 0; i < links.length; i++) {
			embed(links[i]);
		}
	});

	return {
		addModule: addModule
	};
}();
