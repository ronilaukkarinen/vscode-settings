on max(x, y)
  if x < y then
    return y
  else
    return x
  end if
end max

tell application "iTunes" to set sound volume to (my max(sound volume - 10, 0))