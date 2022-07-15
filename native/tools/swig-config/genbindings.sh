#!/bin/bash

# exit this script if any commmand fails
set -e

host_os=`uname -s | tr "[:upper:]" "[:lower:]"`

echo $host_os

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

function abspath() { pushd . > /dev/null; if [ -d "$1" ]; then cd "$1"; dirs -l +0; else cd "`dirname \"$1\"`"; cur_dir=`dirs -l +0`; if [ "$cur_dir" == "/" ]; then echo "$cur_dir`basename \"$1\"`"; else echo "$cur_dir/`basename \"$1\"`"; fi; fi; popd > /dev/null; }

export COCOS_NATIVE_ROOT=$( abspath "$DIR/../../" )

echo $COCOS_NATIVE_ROOT

if [ "$host_os" == "linux" ]; then
    cc_host="linux"
fi

if [ "$host_os" == "darwin" ]; then
    cc_host="mac"
fi


SWIG_ROOT=$COCOS_NATIVE_ROOT/external/${cc_host}/bin/swig
export SWIG_EXE=$SWIG_ROOT/bin/swig
export SWIG_LIB=$SWIG_ROOT/share/swig/4.1.0

# debug linux
# SWIG_ROOT=/home/james/projects/swig
# debug mac
# SWIG_ROOT=/Users/james/Project/cocos/swig

# export SWIG_EXE=$SWIG_ROOT/build/swig
# export SWIG_LIB=$SWIG_ROOT/build
# export SWIG_LIB2=$SWIG_ROOT/Lib/javascript/cocos
# export SWIG_LIB3=$SWIG_ROOT/Lib

$COCOS_NATIVE_ROOT/external/${cc_host}/bin/lua/lua genbindings.lua
