Embed Me!
=========
An userscript to embed videos, images from anchor link.

Demo
----
[Demo page][2]

[2]: https://rawgit.com/eight04/Embed-Me/master/demo.html

Supported sites
---------------
Checkout the [module folder][1]. It is welcome to contribute more modules.

[1]: https://github.com/eight04/Embed-Me/tree/master/modules

Module
------
A module object should look like:
```javascript
{
	name: "The module name",
	global: true,				// The module should work globally,
	domains: ["example.com"],	// or the module will only work on these domains.
	getPatterns: function() {
		// Return a list of regex object. Only matched urls will be sent to embed function.
		return [
			// ...
		];
	},
	getEmbedFunction: function() {
		// Return an embedding function.
		//
		// Params:
		//   1...n  The capturing groups returned by regex pattern. n = groups.length.
		//   n+1    The url of the link.
		//   n+2    The text content of the link.
		//   n+3    The link itself.
		//   n+4    A replace function.
		//
		// Usually you can return new element back. If you have to replace element asynchronously,
		// send new element to replace function when you are finished.

		return function (url, text, node, replace) {
			// ...
		}
	}
}
```

Known issues
------------
* [Mixed content restriction][3].
* Twitch always auto start playing.

[3]: https://developer.mozilla.org/en-US/docs/Security/MixedContent

Some online embedding service
-----------------------------
* [Noembed](https://noembed.com/)
* [embed.ly](http://embed.ly/)

Changelog
---------
* 0.2.1 (Oct 6, 2015)
	- Support more patterns in youtube module.
* 0.2.0 (Jun 18, 2015)
	- Update GM_config.
	- Fix image max-width.
	- Fix imgur iframe.
	- Fix youtube bug.
* 0.1.1 (Jun 17, 2015)
	- Add @noframes.
* 0.1.0 (Jun 17, 2015)
	- First release.
