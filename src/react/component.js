import { createDOM } from "./react-dom"
import { isFunction } from "./utils"

// 批量更新队列
export const updateQueue = {
  updaters: [],
  isBatchingUpdate: false,  // 用来标示是否存入队列
  add(updater) {
    this.updaters.push(updater);
  },
  batchUpdate() {
    this.updaters.forEach(updater => updater.updateComponent());
    this.isBatchingUpdate = false;
  }
};

// 是否更新
function shouldUpdate(classInstance, nextState) {
  // 增加生命周期 shouldComponentUpdate
  let noUpdate = classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(classInstance.props, nextState);
  classInstance.state = nextState;
  if (!noUpdate) {
    // 渲染页面
    classInstance.forceUpdate();
  }
}

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = [];
  }
  // 添加状态
  addState(partialState) {
    this.pendingStates.push(partialState);
    this.emitUpdate();
  }
  // 更新
  emitUpdate() {
    // 延迟批量更新 或 立即更新
    updateQueue.isBatchingUpdate ? updateQueue.add(this) : this.updateComponent();
  }
  updateComponent() {
    const { classInstance, pendingStates } = this;
    if (pendingStates.length > 0) {
      shouldUpdate(classInstance, this.getState())
    }
  }
  // 更新状态
  getState() {
    const { classInstance, pendingStates } = this;
    let { state } = classInstance;
    if (pendingStates.length) {
      pendingStates.forEach(nextState => {
        // 若为函数形式，则将最新的state传递进去
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

/**
 * 类组件
 */
class Component {
  // 标示，用来区分于函数组件
  static isReactComponent = true
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this);
  }
  setState(partialState) {
    this.updater.addState(partialState);
  }
  // 强制刷新
  forceUpdate() {
    // 增加生命周期 componentWillUpdate
    if (this.componentWillUpdate) {
      this.componentWillUpdate();
    }
    const newRenderVdom = this.render();
    mountClassComponent(this, newRenderVdom);
    // 增加生命周期 componentDidUpdate
    if (this.componentDidUpdate) {
      this.componentDidUpdate()
    }
  }
}

function mountClassComponent(classInstance, newRenderVdom) {
  const oldDOM = classInstance.dom;
  const newDOM = createDOM(newRenderVdom);
  oldDOM.parentNode.replaceChild(newDOM, oldDOM);
  classInstance.dom = newDOM;
}

export default Component;