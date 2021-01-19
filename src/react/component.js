import { createDOM } from "./react-dom"

export let updateQueue = {
  updaters: [],
  isBatchingUpdate: false,
  add(updater) {
    this.updaters.push(updater);
  },
  batchUpdate() {
    this.updaters.forEach(updater => updater.updateComponent());
    this.isBatchingUpdate = false;
  }
};
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = [];
  }
  addState(partialState) {
    this.pendingStates.push(partialState);
    updateQueue.isBatchingUpdate ? updateQueue.add(this) : this.updateComponent();
  }
  updateComponent() {
    let { classInstance, pendingStates } = this;
    if (pendingStates.length > 0) {
      classInstance.state = this.getState();
      classInstance.forceUpdate();
    }
  }
  getState() {
    let { classInstance, pendingStates } = this;
    let { state } = classInstance;
    if (pendingStates.length) {
      pendingStates.forEach(nextState => {
        if (isFunction(nextState)) {
          nextState = nextState.call(classInstance, state);
        }
        state = { ...state, ...nextState };
      });
      pendingStates.length = 0;
    }
    return state;
  }
}

class Component {
  // 标示，用来区分于函数组件
  static isReactComponent = true
  constructor(props) {
    this.props = props;
    this.state = {};
  }
  setState(partialState) {
    const { state } = this;
    // 合并，避免更新单独某个属性
    this.state = { ...state, ...partialState };
    const newRenderVdom = this.render();
    // 重新渲染
    mountClassComponent(this, newRenderVdom);
  }
}

function mountClassComponent(classInstance, newRenderVdom) {
  const oldDOM = classInstance.dom;
  const newDOM = createDOM(newRenderVdom);
  oldDOM.parentNode.replaceChild(newDOM, oldDOM);
  classInstance.dom = newDOM;
}

export default Component;