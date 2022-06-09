export interface CocosProject {
    projectType: string;
    hasNative: boolean;
    customStepScript: string;
    preBuild: string;
    postBuild: string;
}

export interface CocosProjectTasks {

    excludeFromTemplate?: string[],

    appendFromTemplate?: {
        from: string;
        to: string;
        exclude?: string[];
    },
    appendFile?: { from: string, to: string }[],
    appendXEngine?: {
        from: string; to: string
    },
    projectRename: {
        srcProjectName: string;
        files: []
    },
    projectReplaceProjectName?: {
        srcProjectName: string,
        files: string[];
    },
    projectReplacePackageName?: {
        srcPackageName: string;
        files: string[]
    },
    projectReplaceMacBundleid?: {
        srcBundleId: string;
        files: string[]
    },
    projectReplaceIosBundleid?: {
        srcBundleId: string,
        files: string[]
    },
    projectReplaceCocosRoot?: {
        pattern: string;
        files: (string | { file: string, default?: string, link?: string, needFix?: boolean })[];
    },
    projectReplaceTemplatePath?: {
        pattern: string;
        files: (string | { file: string, default?: string, link?: string, needFix?: boolean })[];
    },
    projectReplaceProjectCommon?: {
        pattern: string;
        files: (string | { file: string, default?: string, link?: string, needFix?: boolean })[];
    }
    commonReplace?: { pattern: string, value: string, files: string[] }[];
}

export interface CocosProjectConfig {
    doDefault?: CocosProjectTasks,
    doAddNativeSupport: CocosProjectTasks
}
