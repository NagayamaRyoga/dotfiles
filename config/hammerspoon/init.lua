hs.alert.show('Config loaded')

-- Reload
hs.hotkey.bind({'cmd', 'alt', 'ctrl'}, 'R', function()
  hs.reload()
end)

local function keyStroke(mod, key)
  return function() hs.eventtap.keyStroke(mod, key, 1000) end
end

local function keyStrokes(text)
  return function() hs.eventtap.keyStrokes(text) end
end

local function launch(app)
  return function() hs.application.launchOrFocus('/Applications/' .. app .. '.app') end
end

local function remap(mod, key, pressedFn, repeatFn)
  hs.hotkey.bind(mod, key, pressedFn, nil, repeatFn)
end

local function remapRepeat(mod, key, fn)
  remap(mod, key, fn, fn)
end

-- shortcuts
-- remapRepeat({'cmd'}, 'Y', keyStroke({'cmd', 'shift'}, 'Z'))
remap({'cmd', 'ctrl'}, 't', launch('Alacritty'))
remap({'cmd', 'ctrl'}, 'v', launch('Visual Studio Code'))
remap({'cmd', 'ctrl'}, 'e', launch('Sublime Text'))
remap({'cmd', 'ctrl'}, 'c', launch('Google Chrome'))
