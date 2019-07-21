
import { UIRenderComponent, RenderFlowFlag, CanvasComponent } from '../../3d';
import { UI } from './ui';
import { Node } from '../../scene-graph';
import { RenderFlow } from '../../pipeline/render-flow';

interface IFlow {
  [key: number]: UIRenderFlow;
}

export class UIRenderFlow {
  public static flows: IFlow = {};
  public static ui: UI;
  public static init(batcher: UI){
    this.ui = batcher;

    this.flows[0] = EMPTY_FLOW;
    for (let i = 1; i < RenderFlowFlag.FINAL; i++) {
      this.flows[i] = new UIRenderFlow();
    }
  }

  public static createFlow(flag: RenderFlowFlag, next: UIRenderFlow | null) {
    let flow = new UIRenderFlow();
    flow.next = next || EMPTY_FLOW;

    switch (flag) {
      case RenderFlowFlag.DONOTHING:
        flow.func = flow.doNothing;
        break;
      case RenderFlowFlag.LOCAL_TRANSFORM:
        flow.func = flow.localTransform;
        break;
      case RenderFlowFlag.WORLD_TRANSFORM:
        flow.func = flow.worldTransform;
        break;
      case RenderFlowFlag.UPDATE_RENDER_DATA:
        flow.func = flow.updateRenderData;
        break;
      case RenderFlowFlag.RENDER:
        flow.func = flow.render;
        break;
      // case RenderFlowFlag.CUSTOM_IA_RENDER:
      //   flow.func = flow.customIARender;
      //   break;
      case RenderFlowFlag.CHILDREN:
        flow.func = flow.children;
        break;
      case RenderFlowFlag.POST_UPDATE_RENDER_DATA:
        flow.func = flow.postUpdateRenderData;
        break;
      case RenderFlowFlag.POST_RENDER:
        flow.func = flow.postRender;
        break;
    }

    return flow;
  }

  public static getFlow(flag: RenderFlowFlag) {
    let flow: UIRenderFlow | null = null;
    let tFlag = RenderFlowFlag.FINAL;
    while (tFlag > 0) {
      if (tFlag & flag)
        flow = UIRenderFlow.createFlow(tFlag, flow);
      tFlag = tFlag >> 1;
    }

    return flow;
  }

  public static visit(canvas: CanvasComponent){
    const flag = canvas.node.renderFlag;
    if (flag & RenderFlowFlag.WORLD_TRANSFORM) {
      canvas.node.renderFlag &= ~RenderFlowFlag.WORLD_TRANSFORM;
      UIRenderFlow.flows[flag].func(canvas.node);
    } else {
      UIRenderFlow.flows[flag].func(canvas.node);
    }

    this.ui.autoMergeBatches();
  }

  public func = this.defaultInit;
  public next = EMPTY_FLOW;

  defaultInit(node: Node){
    let flag = node.renderFlag;
    const getFlow = UIRenderFlow.getFlow(flag);
    let r = UIRenderFlow.flows[flag] = getFlow ? getFlow: EMPTY_FLOW;
    r.func(node);
  }

  doNothing() {
  }

  localTransform(node: Node) {
    // node._updateLocalMatrix();
    node.renderFlag &= ~RenderFlowFlag.LOCAL_TRANSFORM;
    this.next.func(node);
  }

  worldTransform(node: Node) {
    // this.ui.worldMatDirty++;

    // let t = node._matrix;
    // let position = node._position;
    // t.m12 = position.x;
    // t.m13 = position.y;
    // t.m14 = position.z;

    // node._mulMat(node._worldMatrix, node._parent._worldMatrix, t);
    node.renderFlag &= ~RenderFlowFlag.WORLD_TRANSFORM;
    this.next!.func(node);

    // this.ui.worldMatDirty--;
  }

  updateRenderData(node: Node) {
    let comp = node._uiComp as UIRenderComponent;
    comp.updateRenderData();
    node.renderFlag &= ~RenderFlowFlag.UPDATE_RENDER_DATA;
    this.next.func(node);
  }

  render(node: Node) {
    let comp = node._uiComp as UIRenderComponent;
    // TODO:
    comp.updateAssembler(UIRenderFlow.ui);
    this.next.func(node);
  }

  // customIARender(node: Node) {
  //   let comp = node._uiComp as UIRenderComponent;
  //   comp.commitData();
  //   this.next.func(node);
  // }

  children(node: Node) {
    let children = node.children;
    for (let i = 0, l = children.length; i < l; i++) {
      let c = children[i];
      if (!c.activeInHierarchy ) {
        continue;
      };

      UIRenderFlow.flows[c.renderFlag].func(c);
    }

    this.next.func(node);
  }

  postUpdateRenderData(node: Node) {
    let comp = node._uiComp as UIRenderComponent;
    comp.updatePostRenderData();
    node.renderFlag &= ~RenderFlowFlag.POST_UPDATE_RENDER_DATA;
    this.next.func(node);
  }

  postRender(node: Node) {
    let comp = node._uiComp as UIRenderComponent;
    comp.postUpdateAssembler(UIRenderFlow.ui);
    this.next.func(node);
  }
}

const EMPTY_FLOW = new UIRenderFlow();
EMPTY_FLOW.func = EMPTY_FLOW.doNothing;
EMPTY_FLOW.next = EMPTY_FLOW;
