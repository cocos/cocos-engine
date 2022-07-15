local PATH = os.getenv('PATH')
local SWIG_LIB = os.getenv('SWIG_LIB')
local SWIG_LIB2 = os.getenv('SWIG_LIB2')
local SWIG_LIB3 = os.getenv('SWIG_LIB3')
local SWIG_EXE = os.getenv('SWIG_EXE')
local COCOS_NATIVE_ROOT = os.getenv('COCOS_NATIVE_ROOT')

local all_paths = {
    SWIG_LIB,
    SWIG_LIB2,
    SWIG_LIB3,
    SWIG_EXE,
    COCOS_NATIVE_ROOT,
}

--- Check if a file or directory exists in this path
function exists(file)
    if file == nil then
        return false
    end
    local ok, err, code = os.rename(file, file)
    if not ok then
        if code == 13 then
            -- Permission denied, but it exists
            return true
        end
    end
    return ok, err
end

--- Check if a directory exists in this path
function isdir(path)
   -- "/" works on both Unix and Windows
   return exists(path.."/")
end

print('COCOS_NATIVE_ROOT: ' .. tostring(COCOS_NATIVE_ROOT))
print('PATH: ' .. tostring(PATH))
print('SWIG_LIB: ' .. tostring(SWIG_LIB))
print('SWIG_LIB2: ' .. tostring(SWIG_LIB2))
print('SWIG_LIB3: ' .. tostring(SWIG_LIB3))
print('SWIG_EXE: ' .. tostring(SWIG_EXE))

for _, path in ipairs(all_paths) do
    if path ~= nil and not exists(path) then
        print(string.format('(%s) does not exist!', path))
        os.exit(-2)
        return
    end
end

local swig_config_map = {
    { '2d.i', 'jsb_2d_auto.cpp' },
    { 'assets.i', 'jsb_assets_auto.cpp' },
    { 'audio.i', 'jsb_audio_auto.cpp' },
    { 'cocos.i', 'jsb_cocos_auto.cpp' },
    { 'dragonbones.i', 'jsb_dragonbones_auto.cpp' },
    { 'editor_support.i', 'jsb_editor_support_auto.cpp' },
    { 'extension.i', 'jsb_extension_auto.cpp' },
    { 'geometry.i', 'jsb_geometry_auto.cpp' },
    { 'gfx.i', 'jsb_gfx_auto.cpp' },
    { 'network.i', 'jsb_network_auto.cpp' },
    { 'physics.i', 'jsb_physics_auto.cpp' },
    { 'pipeline.i', 'jsb_pipeline_auto.cpp' },
    { 'scene.i', 'jsb_scene_auto.cpp' },
    { 'spine.i', 'jsb_spine_auto.cpp' },
    { 'webview.i', 'jsb_webview_auto.cpp' },
    { 'video.i', 'jsb_video_auto.cpp' },
    { 'renderer.i', 'jsb_render_auto.cpp' },
}

for _, config in ipairs(swig_config_map) do
    local includes = {
        SWIG_LIB,
        SWIG_LIB2,
        SWIG_LIB3,
        COCOS_NATIVE_ROOT,
        COCOS_NATIVE_ROOT .. '/cocos',
    }

    local includeStrArr = {}
    for i = 1, #includes + 1 do
        local v = includes[i]
        if exists(v) then
            table.insert(includeStrArr, '-I' .. v)
        end
    end

    local includeStr = table.concat(includeStrArr, " ")

	local command = string.format('%s %s %s %s %s %s', 
        SWIG_EXE,
		'-c++ -cocos -fvirtual -noexcept -cpperraswarn',
		'-D__clang__ -Dfinal= -DCC_PLATFORM=3 -Dconstexpr=const -DCC_PLATFORM_ANDROID=3',
		includeStr,
		'-o ' .. COCOS_NATIVE_ROOT .. '/cocos/bindings/auto/' .. config[2],
		COCOS_NATIVE_ROOT .. '/tools/swig-config/' .. config[1]
	)
	print('command: ' .. command)
	local r = os.execute(command)
	print('command execute returns: ' .. tostring(r))
	if r ~= true then
		print(string.format('ERROR: execute command (%s) failed!', command))
        os.exit(-1)
		break
	end
end
