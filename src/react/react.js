import Component from "./component";

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
  const props = { ...config };
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2);
  }
  props.children = children;
  return {
    type,
    props,
  };
}



const React = {
  createElement,
  Component,
};
export default React