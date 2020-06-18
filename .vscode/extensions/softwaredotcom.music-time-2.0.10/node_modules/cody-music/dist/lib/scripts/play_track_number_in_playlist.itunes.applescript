on run argv
	tell application "iTunes" to set song repeat to off
	set playlist_name to (item 1 of argv)
	set track_number to (item 2 of argv)
	tell application "iTunes"
		
		tell playlist playlist_name to play
		
		repeat (track_number - 1) times
			next track
		end repeat
		
	end tell
end run