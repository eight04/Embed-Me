// ==UserScript==
// @name        Embed Me!
// @author      eight <eight04@gmail.com>
// @homepage    https://github.com/eight04/Embed-Me
// @supportURL  https://github.com/eight04/Embed-Me/issues
// @compatible  firefox
// @compatible  chrome
// @compatible  opera
// @version     0.1.0
// @namespace   eight04.blogspot.com
// @description An userscript to embed video, images from links.
// @include     http*
// @require     https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=56964
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @license     MIT
// ==/UserScript==

var embedMe = function(){

	"use strict";

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
//		console.log(params);
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
		// The link is not embedable.
		node.INVALID = true;
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

	loadConfig();

	GM_registerMenuCommand("Embed Me! - Configure", GM_config.open);
	GM_config.onclose = loadConfig;

	observeDocument(function(node){
		var links = node.querySelectorAll("a[href]"), i;
		for (i = 0; i < links.length; i++) {
			embed(links[i]);
		}
	});

	return {
		addModule: addModule
	};
}();
