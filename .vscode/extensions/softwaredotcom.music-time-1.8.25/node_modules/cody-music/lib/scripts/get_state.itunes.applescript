on escape_quotes(string_to_escape)
	set AppleScript's text item delimiters to the "\""
	set the item_list to every text item of string_to_escape
	set AppleScript's text item delimiters to the "\\\""
	set string_to_escape to the item_list as string
	set AppleScript's text item delimiters to ""
	return string_to_escape
end escape_quotes

try
	tell application "iTunes"
		set t_info to "{"
		set t_info to t_info & "\"artist\": \"" & my escape_quotes(current track's artist) & "\""
		set t_info to t_info & ",\"album\": \"" & my escape_quotes(current track's album) & "\""
		set t_info to t_info & ",\"genre\":\"" & current track's genre & "\""
		set t_info to t_info & ",\"disc_number\": " & current track's disc number
		set t_info to t_info & ",\"duration\": " & (((current track's duration) * 1000) as integer)
		set t_info to t_info & ",\"played_count\": " & current track's played count
		set t_info to t_info & ",\"track_number\": " & current track's track number
		set t_info to t_info & ",\"id\": \"" & current track's id & "\""
		set t_info to t_info & ",\"name\": \"" & my escape_quotes(current track's name) & "\""
		set t_info to t_info & ",\"state\":\"" & player state & "\""
		set t_info to t_info & ",\"volume\": " & sound volume
		set t_info to t_info & ",\"loved\": " & current track's loved
		set t_info to t_info & ",\"popularity\": " & current track's rating
		set t_info to t_info & "}"
	end tell
on error
	return "{}"
end try