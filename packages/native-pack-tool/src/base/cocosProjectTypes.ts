export interface CocosProject {
    projectType: string;
    hasNative: boolean;
    customStepScript: string;
    preBuild: string;
    postBuild: string;
}

export interface CocosProjectTasks {


    appendFile?: { from: string, to: string }[],

    projectReplaceProjectName?: {
        srcProjectName: string,
        files: string[];
    },
    projectReplaceProjectNameASCII?: {
        srcProjectName: string,
        files: string[];
    },
    projectReplacePackageName?: {
        srcPackageName: string;
        files: string[]
    }
}

export interface CocosProjectConfig {
    doDefault?: CocosProjectTasks,
    doAddNativeSupport: CocosProjectTasks
}
