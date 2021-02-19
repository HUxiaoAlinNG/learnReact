import Component, { PureComponent } from "./component";

/**
 * createElement
 * 构造AST结构
 * 如babel下转码的：
 * {
    "type": "div",
    "key": null,
    "ref": null,
    "props": {
      "className": "title",
      "style": {
        "color": "red"
      },
      "children": [
        {
          "type": "span",
          "key": null,
          "ref": null,
          "props": {
            "children": "hello"
          },
          "_owner": null,
          "_store": {}
        },
        "world"
      ]
    },
    "_owner": null,
    "_store": {}
  }
 * @param {*} type 元素类型，可为原生或非原生
 * @param {*} config 
 * @param {*} children  
 */
function createElement(type, config, children) {
  let ref;
  if (config) {
    ref = config.ref;
  }
  const props = { ...config };
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2);
  }
  props.children = children;
  return {
    type,
    props,
    ref,
  };
}

/**
 * 创建ref
 */
function createRef() {
  return { current: null };
}

/**
 * 创建context上下文
 */
function createContext() {
  function Provider(props) {
    Provider._value = props.value;
    return props.children;
  }
  function Consumer(props) {
    return props.children(Provider._value);
  }
  return {
    Provider,
    Consumer,
  };
}

/**
 * 使用上下文
 * @param {*} context 
 */
function useContext(context) {
  return context._value;
}

/**
 * 返回纯组件
 * @param {*} OldComponent 
 */
function memo(OldComponent) {
  return class extends React.PureComponent {
    render() {
      return createElement(OldComponent, this.props)
    }
  }
}

const React = {
  createElement,
  PureComponent,
  Component,
  createRef,
  createContext,
  useContext,
  memo,
};
export default React