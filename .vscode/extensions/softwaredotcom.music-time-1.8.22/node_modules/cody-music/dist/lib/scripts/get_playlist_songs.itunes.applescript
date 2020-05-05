on escape_quotes(string_to_escape)
	set AppleScript's text item delimiters to the "\""
	set the item_list to every text item of string_to_escape
	set AppleScript's text item delimiters to the "\\\""
	set string_to_escape to the item_list as string
	set AppleScript's text item delimiters to ""
	return string_to_escape
end escape_quotes

on run argv
	set playlistName to (item 1 of argv)
	set myList to {}
	tell application "iTunes"
		set results to (every file track of playlist playlistName)
		set counter to 0
		set len to count of results
		repeat with aTrack in results
			set t_info to "{"
			set t_info to t_info & "\"artist\": \"" & my escape_quotes(artist of aTrack) & "\""
			set t_info to t_info & ",\"album\": \"" & my escape_quotes(album of aTrack) & "\""
			set t_info to t_info & ",\"duration\": " & (((duration of aTrack) * 1000) as integer)
			set t_info to t_info & ",\"played_count\": " & played count of aTrack
			set t_info to t_info & ",\"name\": \"" & my escape_quotes(name of aTrack) & "\""
			set t_info to t_info & ",\"id\": \"" & id of aTrack & "\""
			set testCount to counter + 1
			if testCount is greater than or equal to len then
				set t_info to t_info & "}"
			else
				set t_info to t_info & "}[TRACK_END]"
			end if
			copy t_info to end of myList
			set counter to counter + 1
		end repeat
	end tell

	return myList
end run