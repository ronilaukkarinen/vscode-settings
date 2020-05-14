on escape_quotes(string_to_escape)
	set AppleScript's text item delimiters to the "\""
	set the item_list to every text item of string_to_escape
	set AppleScript's text item delimiters to the "\\\""
	set string_to_escape to the item_list as string
	set AppleScript's text item delimiters to ""
	return string_to_escape
end escape_quotes

set myList to {}

tell application "iTunes"
	set playlistResults to (name of playlists whose name does not contain "Library" and name does not contain "Music" and name does not contain "Audiobooks" and name does not contain "Purchased" and name does not contain "Movies" and name does not contain "TV Shows" and name does not contain "Podcasts")
	
	set playlistCounter to 0
	repeat with t in playlistResults
		set playlistTracks to (every file track of playlist t)
		set counter to 0
		set t_info to "{"
		set t_info to t_info & "\"name\": \"" & my escape_quotes(t) & "\""
		repeat with aTrack in playlistTracks
			set counter to counter + 1
		end repeat
		set t_info to t_info & ", \"count\": " & counter
        set t_info to t_info & "}[TRACK_END]"
		copy t_info to end of myList
		set playlistCounter to playlistCounter + 1
	end repeat
end tell
return myList