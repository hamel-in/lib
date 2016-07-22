function fetchPlaylistsContainingVideo(videoId) {
	const baseURL = 'https://gdata.youtube.com/feeds/api/playlists/snippets';
	const url = baseURL + '?v=2&alt=jsonc&max-results=50&q=' + id;
	return fetch(url);
}

function fetchPlaylist(id) {
	const baseURL = 'https://gdata.youtube.com/feeds/api/playlists';
	const url = baseURL + '/' + id + '?v=2&alt=jsonc';
	return fetch(url);
}

function mergePlaylists(playlists) {
	let videos = {};
	let videoIDs = [];
	let merged = [];
	let promiseArr = playlists.data.items.map(i => {
		return fetchPlaylist(i.id).then(resp => resp.json());
	})
	return Promise.all(promiseArr).then((playlists) => {
		playlists.forEach((playlist) => {
			playlist.data.items.forEach((item) => {
				if (item.video.id in videos) {
					videos[item.video.id].count++;
				} else {
					videos[item.video.id] = item;
					videos[item.video.id].count = 1;
					videoIDs.push(item.video.id);
				}
			});
		});
		merged = videoIDs.map(id => videos[id]);
		return merged;
	});
}

function sortMergedPlaylist(playlist) {
	let compareFunction = (a, b) => a.count - b.count;
	return playlist.sort(compareFunction);
}

function fetchRelated(videoId) {
	return fetchPlaylistsContainingVideo(videoId)
		.then(resp => resp.json())
		.then(mergePlaylists)
		.then(sortMergedPlaylist);
}

export default fetchRelated;
