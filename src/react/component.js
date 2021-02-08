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
    // 增加生命周期 getDerivedStateFromProps
    if (this.ownVdom.type.getDerivedStateFromProps) {
      let newState = this.ownVdom.type.getDerivedStateFromProps(this.props, this.state);
      if (newState) {
        this.state = newState;
      }
    }
    const newVdom = this.render();
    // 增加生命周期 getSnapshotBeforeUpdate
    let extraArgs = this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate();
    if (this.oldVdom.dom && this.oldVdom.dom.parentNode) {
      let currentVdom = compareTwoVdom(this.oldVdom.dom.parentNode, this.oldVdom, newVdom);
      this.oldVdom = currentVdom;
    }
    mountClassComponent(this, newVdom);
    // 增加生命周期 componentDidUpdate
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state, extraArgs);
    }
  }
}

function mountClassComponent(classInstance, newVdom) {
  const oldDom = classInstance.dom;
  const newDom = createDOM(newVdom);
  oldDom.parentNode.replaceChild(newDom, oldDom);
  classInstance.dom = newDom;
}

/**
 * 纯组件
 * 重写组件shouldComponentUpdate方法,只有状态或者 属性变化了才会进行更新，否则 不更新
 */
export class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
  }
}
/**
 * 用浅比较 obj1和obj2是否相等
 * 只要内存地址一样，就认为是相等的，不一样就不相等
 * @param {} obj1 
 * @param {*} obj2 
 */
function shallowEqual(obj1, obj2) {
  //如果引用地址是一样的，就相等.不关心属性变没变
  if (obj1 === obj2) {
    return true;
  }
  //任何一方不是对象或者 不是null也不相等  null null  NaN!==NaN
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  //属性的数量不一样，不相等
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let key of keys1) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}

export default Component;