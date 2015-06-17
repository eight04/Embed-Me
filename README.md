Embed Me!
=========
An userscript to embed videos, images from anchor link.

Supported sites
---------------
Checkout the [module folder][1]. Welcome to contribute!

[1]: https://github.com/eight04/Embed-Me/tree/master/modules

Module
------
An module object should look like:

```
{
	name: "The module name",
	global: true,								// The module should work globally,
	domains: ["example.com", "example2.com"],	// or the module will only work on these hostname.
	getPatterns: function() {
		// Patterns builder. Create a list of regex object.
		// The match result will be used in embed function.
		return [
			/\.com\/(\d+)\//i
		];
	},
	getEmbedFunction: function() {
		// Params:
		//   matches[1], matches[2], ... , url, text, anchorElement
		return function (id, url, text) {
			var image = new Image;

		}
	}
}
```
