import { createDOM, compareTwoVdom } from "./react-dom"
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
function shouldUpdate(classInstance, nextProps, nextState) {
  // 增加生命周期 shouldComponentUpdate
  let noUpdate = classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(nextProps, nextState);
  if (nextProps) {
    classInstance.props = nextProps;
  }
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
  // 属性更新或状态更新
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    // isBatchingUpdate 延迟批量更新 或 立即更新
    (nextProps || !updateQueue.isBatchingUpdate) ? this.updateComponent() : updateQueue.add(this);
  }
  updateComponent() {
    const { classInstance, pendingStates, nextProps } = this;
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, nextProps, this.getState())
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
    this.nextProps = null;
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
    const newVdom = this.render();
    let currentVdom = compareTwoVdom(this.oldVdom.dom.parentNode, this.oldVdom, newVdom);
    this.oldVdom = currentVdom;
    mountClassComponent(this, newVdom);
    // 增加生命周期 componentDidUpdate
    if (this.componentDidUpdate) {
      this.componentDidUpdate()
    }
  }
}

function mountClassComponent(classInstance, newVdom) {
  const oldDom = classInstance.dom;
  const newDom = createDOM(newVdom);
  oldDom.parentNode.replaceChild(newDom, oldDom);
  classInstance.dom = newDom;
}

export default Component;