@echo %off

set DIR=%~dp0
set COCOS_NATIVE_ROOT=%DIR%..\..

for %%i in ("%COCOS_NATIVE_ROOT%") do SET COCOS_NATIVE_ROOT=%%~fi

echo COCOS_NATIVE_ROOT=%COCOS_NATIVE_ROOT%

set SWIG_ROOT=%COCOS_NATIVE_ROOT%/external/win64/bin/swig

set SWIG_EXE=%SWIG_ROOT%/bin/swig.exe
set SWIG_LIB=%SWIG_ROOT%/share/swig/4.1.0

%COCOS_NATIVE_ROOT%/external/win64/bin/lua/lua.exe genbindings.lua
