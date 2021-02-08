import { addEvent } from "./event"

/**
 * 
 * @param {*} vdom 虚拟dom
 * @param {*} container 创建的真实dom
 */
function render(vdom, container) {
  const dom = createDOM(vdom);
  container.appendChild(dom);
}

// 将虚拟dom渲染成真实dom
export function createDOM(vdom) {
  if (vdom === null) {
    return document.createTextNode("");
  }
  if (typeof vdom === "string" || typeof vdom === "number") {
    return document.createTextNode(vdom);
  }
  const { type, props, ref } = vdom;
  let dom;
  if (typeof type === 'function') {
    if (type.isReactComponent) {
      return mountClassComponent(vdom);  // 类组件
    } else {
      return mountFunctionComponent(vdom);  // 函数组件
    }
  } else {
    dom = document.createElement(type);
  }
  //更新属性
  updateProps(dom, {}, props);
  // 基本类型
  if (typeof props.children === "string" || typeof props.children === "number") {
    dom.textContent = props.children;
  } else if (typeof props.children == "object" && props.children.type) {
    render(props.children, dom);
  } else if (Array.isArray(props.children)) {//是数组的话
    reconcileChildren(props.children, dom);
  } else {
    dom.textContent = props.children ? props.children.toString() : "";
  }
  // 用来更新
  vdom.dom = dom;
  if (ref) {
    ref.current = dom;
  }
  return dom;
}

// 函数组件
function mountFunctionComponent(vdom) {
  const { type, props } = vdom;
  // 执行函数
  const renderVdom = type(props);
  return createDOM(renderVdom);
}

// 类组件
function mountClassComponent(vdom) {
  const { type, props } = vdom;
  // 构造实例
  const classInstance = new type(props);
  vdom.classInstance = classInstance;
  // 增加生命周期 componentWillMount
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount();
  }
  const renderVdom = classInstance.render();
  const dom = createDOM(renderVdom);
  vdom.dom = renderVdom.dom = dom;
  classInstance.oldVdom = renderVdom;
  // 用来更新
  classInstance.dom = dom;
  // 增加生命周期 componentDidMount
  if (classInstance.componentDidMount) {
    classInstance.componentDidMount();
  }
  return dom;
}

// 更新属性
function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === "children") { continue; }
    if (key === "style") {  // 样式
      let style = newProps[key];
      for (let attr in style) {
        dom.style[attr] = style[attr]
      }
    } else if (key.startsWith('on')) { // 事件
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      dom[key] = newProps[key];
    }
  }
}

// 遍历并渲染子元素
function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    const childVdom = childrenVdom[i];
    render(childVdom, parentDOM);
  }
}

// dom-diff
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextVdom) {
  if (!oldVdom && !newVdom) { //新老元素都没有
    return null;
  } else if (oldVdom && !newVdom) { //老的有节点,新的没有
    const currentDom = oldVdom.dom;
    currentDom.parentNode.removeChild(currentDom);
    // 增加生命周期 componentWillUnmount
    if (oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount();
    }
    return null;
  } else if (!oldVdom && newVdom) { //老的没有,新的有节点
    const newDom = createDOM(newVdom);
    if (nextVdom) {
      parentDOM.insertBefore(newDom, nextVdom.dom);
    } else {
      parentDOM.appendChild(newDom);
    }

    newVdom.dom = newDom;
    return newVdom;
    //新老节点都有,但是类型不同,也不能复用,所以删除建新的 
  } else if ((oldVdom && newVdom && oldVdom.type !== newVdom.type)) {
    const oldDom = oldVdom.dom;
    const newDom = createDOM(newVdom);
    newVdom.dom = newDom;
    oldDom.parentNode.replaceChild(newDom, oldDom);
    // 增加生命周期 componentWillUnmount
    if (oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount();
    }
    return newVdom;
  } else { //新老节点都有,类型一样
    updateElement(oldVdom, newVdom);
    return newVdom;
  }
}

// 类型相同时，进行复用
function updateElement(oldVdom, newVdom) {
  if (typeof oldVdom.type === 'string') {//原生的DOM类型 div span p
    let currentDOM = newVdom.dom = oldVdom.dom;//获取 老的真实DOM
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === 'function') {
    if (oldVdom.type.isReactComponent) {//说明它是一个类组件的实例
      newVdom.classInstance = oldVdom.classInstance;
      updateClassInstance(oldVdom, newVdom);
    } else {//说明它是一个函数式组件
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}

/**
 * 对比子元素
 * @param {*} parentDOM 
 * @param {*} oldVChildren 
 * @param {*} newVChildren 
 */
function updateChildren(parentDOM, oldVChildren, newVChildren) {
  //如果是纯文本则直接改变
  if ((typeof oldVChildren === 'string' || typeof oldVChildren === 'number')
    && (typeof newVChildren === 'string' || typeof newVChildren === 'number')) {
    if (oldVChildren !== newVChildren) {
      parentDOM.textContent = newVChildren;
    }
    return;
  }
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];
  const maxLength = Math.max(oldVChildren.length, newVChildren.length);
  for (let i = 0; i < maxLength; i++) {
    const nextDOM = oldVChildren.find((item, index) => index > i && item && item.dom);
    compareTwoVdom(parentDOM, oldVChildren[i], newVChildren[i], nextDOM && nextDOM.dom);
  }
}
/**
 * 更新函数式组件
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateFunctionComponent(oldVdom, newVdom) {
  let parentDOM = oldVdom.renderVdom.dom.parentNode;
  let { type, props } = newVdom; //获取新的虚拟函数组件
  let newRenderVdom = type(props);//传入属性对象并执行它,
  newVdom.renderVdom = newRenderVdom;
  compareTwoVdom(parentDOM, oldVdom.renderVdom, newRenderVdom);
}

/**
 * 更新组件实例
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateClassInstance(oldVdom, newVdom) {
  let classInstance = oldVdom.classInstance;
  // 增加生命周期 componentWillReceiveProps
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps();
  }
  classInstance.updater.emitUpdate(newVdom.props);
}

const ReactDOM = {
  render
};
export default ReactDOM;