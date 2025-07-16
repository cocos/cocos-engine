import { setCustomPipeline } from '../custom';
import { PostProcessBuilder } from './post-process-builder';
import './utils/pass-context';

export * from './components';
export * from './passes';
export * from './post-process-builder';

setCustomPipeline('Forward', new PostProcessBuilder());
setCustomPipeline('Custom', new PostProcessBuilder());
