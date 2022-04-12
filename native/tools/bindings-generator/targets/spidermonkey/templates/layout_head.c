\#include "${os.path.relpath(os.path.join($outdir, $out_file + '.h'), $search_path+'/..').replace(os.path.sep, '/')}"
#if $macro_judgement
$macro_judgement
#end if
\#include "cocos/bindings/manual/jsb_conversions.h"
\#include "cocos/bindings/manual/jsb_global.h"
#for header in $headers
    #set include_header = os.path.basename(header)
    #if include_header in $replace_headers
\#include "${replace_headers[include_header]}"
    #else
        #set relative = os.path.relpath(header, $search_path)
        #if not '..' in relative
\#include "${relative.replace(os.path.sep, '/')}"
        #else
\#include "${include_header}"
        #end if
    #end if
#end for
#if $cpp_headers
#for header in $cpp_headers
\#include "${header}"
#end for
#end if

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
