import { DescriptorBlock, DescriptorBlockIndex } from './layout-graph';
import { LayoutGraphBuilder } from './pipeline';

export class WebLayoutGraphBuilder extends LayoutGraphBuilder  {
    public addRenderStage (name: string): number {
        return 0xFFFFFFFF;
    }
    public addRenderPhase (name: string, parentID: number): number {
        return 0xFFFFFFFF;
    }
    public addDescriptorBlock (nodeID: number, index: DescriptorBlockIndex, block: DescriptorBlock): void {

    }
    public reserveDescriptorBlock (nodeID: number, index: DescriptorBlockIndex, block: DescriptorBlock): void {

    }
    public compile (): number {
        return 0;
    }
    public print (): string {
        return '';
    }
}
