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
  if (typeof vdom === "string" || typeof vdom === "number") {
    return document.createTextNode(vdom);
  }
  const { type, props } = vdom;
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
  updateProps(dom, props);
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
  const renderVdom = classInstance.render();
  const dom = createDOM(renderVdom);
  // 用来更新
  classInstance.dom = dom;
  return dom;
}

// 更新属性
function updateProps(dom, props) {
  for (let key in props) {
    if (key === "children") { continue; }
    if (key === "style") {  // 样式
      let style = props[key];
      for (let attr in style) {
        dom.style[attr] = style[attr]
      }
    } else if (key.startsWith('on')) { // 事件
      addEvent(dom, key.toLocaleLowerCase(), props[key]);
    } else {
      dom[key] = props[key];
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
const ReactDOM = {
  render
};
export default ReactDOM;