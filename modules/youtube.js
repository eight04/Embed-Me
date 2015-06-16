function getYoutubeId(url) {
	var match =
		url.match(/https?:\/\/www\.youtube\.com\/watch\?v=([^&]+)/) ||
		url.match(/https?:\/\/youtu\.be\/([^?]+)/);
	return match && match[1];
}


