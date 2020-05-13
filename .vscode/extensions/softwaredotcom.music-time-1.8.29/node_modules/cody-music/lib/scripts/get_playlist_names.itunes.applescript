tell application "iTunes"
	get name of playlists whose name does not contain "Library" and name does not contain "Music" and name does not contain "Audiobooks" and name does not contain "Purchased" and name does not contain "Movies" and name does not contain "TV Shows" and name does not contain "Podcasts"
end tell