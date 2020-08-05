


export interface CocosProject{
    project_type:string;
    has_native:boolean;
    custom_step_script:string;
    engine_version:string;
    pre_build:string;
    post_build:string;
}


export const CONFIG: string = '.cocos-project.json';

export interface CocosProjectTasks {

    exclude_from_template?: string[],

    append_from_template: {
        from:string;
        to:string;
        exclude?:string[];
    },
    append_file: {from:string, to:string}[],
    append_x_engine?:{
        from:string; to:string
    },
    project_rename:{
        src_project_name:string;
        files:[]
    },
    project_replace_project_name: {
        src_project_name:string,
        files:string[];
    },
    project_replace_package_name: {
        src_package_name:string;
        files:string[]
    },
    project_replace_mac_bundleid: {
        src_bundle_id: string;
        files:string[]
    },
    project_replace_ios_bundleid: {
        src_bundle_id:string,
        files:string[]
    },
    project_replace_cocos_x_root: {
        pattern: string;
        files:(string|{file:string, default?:string, link?:string, needFix?:boolean})[];
    },
    project_replace_projec_common: {
        pattern: string;
        files:(string|{file:string, default?:string, link?:string, needFix?:boolean})[];
    }
    common_replace?: {pattern:string, value:string, files:string[]}[];
}

export interface CocosProjecConfig {
    do_default:CocosProjectTasks,
    do_add_native_support: CocosProjectTasks
}
