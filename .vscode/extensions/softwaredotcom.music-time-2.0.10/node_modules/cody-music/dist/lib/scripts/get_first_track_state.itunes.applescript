
on escape_quotes(string_to_escape)
	set AppleScript's text item delimiters to the "\""
	set the item_list to every text item of string_to_escape
	set AppleScript's text item delimiters to the "\\\""
	set string_to_escape to the item_list as string
	set AppleScript's text item delimiters to ""
	return string_to_escape
end escape_quotes

tell application "iTunes"
	set trk to (first track in playlist "Library")
	set t_info to "{"
	set t_info to t_info & "\"artist\": \"" & my escape_quotes(artist of trk) & "\""
	set t_info to t_info & ",\"album\": \"" & my escape_quotes(album of trk) & "\""
	set t_info to t_info & ",\"genre\":\"" & genre of trk & "\""
	set t_info to t_info & ",\"disc_number\": " & disc number of trk
	set t_info to t_info & ",\"duration\": " & (((duration of trk) * 1000) as integer)
	set t_info to t_info & ",\"played_count\": " & played count of trk
	set t_info to t_info & ",\"track_number\": " & track number of trk
	set t_info to t_info & ",\"id\": \"" & id of trk & "\""
	set t_info to t_info & ",\"name\": \"" & my escape_quotes(name of trk) & "\""
	set t_info to t_info & ",\"state\":\"" & player state & "\""
	set t_info to t_info & ",\"volume\": " & sound volume
	set t_info to t_info & ",\"loved\": " & loved of trk
	set t_info to t_info & ",\"popularity\": " & rating of trk
	set t_info to t_info & "}"
end tell