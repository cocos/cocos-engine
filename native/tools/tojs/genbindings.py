#!/usr/bin/python

# This script is used to generate luabinding glue codes.
# Android ndk version must be ndk-r16 or greater.


import sys, os, shutil, subprocess, re
from contextlib import contextmanager

if sys.version_info.major >= 3:
    import configparser
else:
    import ConfigParser as configparser

defaultSections = [
    'cocos',
    'video',
    'webview',
    'audio' ,
    'extension',
    'network',
    'gfx',
    'pipeline',
    'spine',
    'editor_support',
    'dragonbones',
    'physics',
    'scene',
    'geometry',
    'assets'
]

projectRoot = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
defaultOutputDir = '%s/cocos/bindings/auto' % projectRoot

def _check_ndk_root_env():
    ''' Checking the environment NDK_ROOT, which will be used for building
    '''

    try:
        NDK_ROOT = os.environ['ANDROID_NDK_HOME']
    except Exception:
        print ("ANDROID_NDK_HOME not defined...")
        try:
            NDK_ROOT = os.environ['NDK_ROOT']
        except Exception:
            print ("NDK_ROOT not defined. Please define NDK_ROOT or ANDROID_NDK_HOME in your environment.")
            sys.exit(1)

    return NDK_ROOT

def _check_python_bin_env():
    ''' Checking the environment PYTHON_BIN, which will be used for building
    '''

    try:
        PYTHON_BIN = os.environ['PYTHON_BIN']
    except Exception:
        print ("PYTHON_BIN not defined, use current python.")
        PYTHON_BIN = sys.executable

    return PYTHON_BIN


class CmdError(Exception):
    pass

@contextmanager
def _pushd(newDir):
    previousDir = os.getcwd()
    os.chdir(newDir)
    yield
    os.chdir(previousDir)

def _run_cmd(command):
    # ret = subprocess.call(command, shell=True)
    # if ret != 0:
    #     message = "Error running command"
    #     raise CmdError(message)
    return subprocess.Popen(command, stdout=subprocess.PIPE, shell=True)

def main():
    if len(sys.argv) == 2 and sys.argv[1] == '--help':
        print ('python %s [SECTION]... | --config [config paths]\n' % (sys.argv[0]))
        print ('    Generate JSB bindings for the specified sections or config file.\n')
        print ('    If nothing is specified, all built-in sections will be generated.\n')
        print ('    Built-in section list:')
        for section in defaultSections:
            print ('        %s' % section)
        sys.exit(0)

    cur_platform= '??'
    llvm_path = '??'
    ndk_root = _check_ndk_root_env()
    # del the " in the path
    ndk_root = re.sub(r"\"", "", ndk_root)
    python_bin = _check_python_bin_env()

    platform = sys.platform
    if platform == 'win32':
        cur_platform = 'windows'
    elif platform == 'darwin':
        cur_platform = platform
    elif 'linux' in platform:
        cur_platform = 'linux'
    else:
        print ('Your platform is not supported!')
        sys.exit(1)


    x86_llvm_path = ""
    x64_llvm_path = os.path.abspath(os.path.join(ndk_root, 'toolchains/llvm/prebuilt', '%s-%s' % (cur_platform, 'x86_64')))
    if not os.path.exists(x64_llvm_path):
        x86_llvm_path = os.path.abspath(os.path.join(ndk_root, 'toolchains/llvm/prebuilt', '%s' % (cur_platform)))
    if not os.path.exists(x86_llvm_path):
        x86_llvm_path = os.path.abspath(os.path.join(ndk_root, 'toolchains/llvm/prebuilt', '%s-%s' % (cur_platform, 'x86')))

    if os.path.isdir(x64_llvm_path):
        llvm_path = x64_llvm_path
    elif os.path.isdir(x86_llvm_path):
        llvm_path = x86_llvm_path
    else:
        print ('llvm toolchain not found!')
        print ('path: %s or path: %s are not valid! ' % (x86_llvm_path, x64_llvm_path))
        sys.exit(1)

    x86_gcc_toolchain_path = ""
    x64_gcc_toolchain_path = os.path.abspath(os.path.join(ndk_root, 'toolchains/arm-linux-androideabi-4.9/prebuilt', '%s-%s' % (cur_platform, 'x86_64')))
    if not os.path.exists(x64_gcc_toolchain_path):
        x86_gcc_toolchain_path = os.path.abspath(os.path.join(ndk_root, 'toolchains/arm-linux-androideabi-4.9/prebuilt', '%s' % (cur_platform)))
    if not os.path.exists(x86_gcc_toolchain_path):
        x86_gcc_toolchain_path = os.path.abspath(os.path.join(ndk_root, 'toolchains/arm-linux-androideabi-4.9/prebuilt', '%s-%s' % (cur_platform, 'x86')))

    if os.path.isdir(x64_gcc_toolchain_path):
        gcc_toolchain_path = x64_gcc_toolchain_path
    elif os.path.isdir(x86_gcc_toolchain_path):
        gcc_toolchain_path = x86_gcc_toolchain_path
    else:
        print ('gcc toolchain not found!')
        print ('path: %s or path: %s are not valid! ' % (x64_gcc_toolchain_path, x86_gcc_toolchain_path))
        sys.exit(1)

    cocos_root = os.path.abspath(projectRoot)
    cxx_generator_root = os.path.abspath(os.path.join(projectRoot, 'tools/bindings-generator'))

    # save config to file
    config = configparser.ConfigParser()
    config.set('DEFAULT', 'androidndkdir', ndk_root)
    config.set('DEFAULT', 'clangllvmdir', llvm_path)
    config.set('DEFAULT', 'gcc_toolchain_dir', gcc_toolchain_path)
    config.set('DEFAULT', 'cocosdir', cocos_root)
    config.set('DEFAULT', 'cxxgeneratordir', cxx_generator_root)
    config.set('DEFAULT', 'extra_flags', '')

    conf_ini_file = os.path.abspath(os.path.join(os.path.dirname(__file__), 'userconf.ini'))

    print ('generating userconf.ini...')
    with open(conf_ini_file, 'w') as configfile:
      config.write(configfile)


    # set proper environment variables
    if 'linux' in platform or platform == 'darwin':
        os.putenv('LD_LIBRARY_PATH', '%s/libclang' % cxx_generator_root)
        print ('%s/libclang' % cxx_generator_root)
    if platform == 'win32':
        path_env = os.environ['PATH']
        os.putenv('PATH', r'%s;%s\libclang;%s\tools\win32;' % (path_env, cxx_generator_root, cxx_generator_root))


    try:
        tojs_root = '%s/tools/tojs' % projectRoot

        target = 'spidermonkey'
        generator_py = '%s/generator.py' % cxx_generator_root
        tasks = []

        def generate (cfg, directory = None, section = None, filename = None):
            if directory is None: directory = os.path.dirname(cfg)
            if section is None: section = os.path.basename(cfg)[:-4]
            if filename is None: filename = 'jsb_%s_auto' % section
            print ('!!----------Generating bindings for %s----------!!' % (section))
            command = '%s -W ignore %s %s -s %s -t %s -o %s -n %s' % (python_bin, generator_py, cfg, section, target, directory, filename)
            print ("command : %s" % (command))
            # tasks.append(_run_cmd(command))
            _run_cmd(command).communicate()

        if len(sys.argv) > 2 and sys.argv[1] == '--config':
            for path in sys.argv[2:]:
                generate(path.replace('\\', '/'))
        else:
            genCnt = 0
            for section in defaultSections:
                if len(sys.argv) <= 1 or any(section in s for s in sys.argv[1:]):
                    generate('%s/%s.ini' % (tojs_root, section), defaultOutputDir)
                    genCnt += 1
            if genCnt == 0:
                print ('----------------------------------------')
                print ('Warn: no ini found, update var `defaultSections`?')

        # for t in tasks:
        #     t.communicate()

        print ('----------------------------------------')
        print ('Generating javascript bindings succeeds.')
        print ('----------------------------------------')

    except Exception as e:
        if e.__class__.__name__ == 'CmdError':
            print ('-------------------------------------')
            print ('Generating javascript bindings fails.')
            print ('-------------------------------------')
            sys.exit(1)
        else:
            raise


# -------------- main --------------
if __name__ == '__main__':
    main()
