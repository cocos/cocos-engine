import { PostProcess } from '../components/post-process';

export const passSettings = {
    renderProfiler: false,
    passPathName: '',
    passVersion: 0,

    isFinalCamera: false,
    isFinalPass: false,

    forwardPass: undefined as any,
    postProcess: undefined as (PostProcess | undefined),
};
