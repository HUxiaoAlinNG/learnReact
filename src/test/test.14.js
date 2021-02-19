import React, { useState, useRef } from "react";
// import ReactDOM from "react-dom";

const hookStates = [];
let hookIndex = 0;

/**
 * useEffect:浏览器渲染完成后执行，不会阻塞浏览器渲染
 * useLayoutEffect：在 DOM 更新完成后,浏览器绘制之前执行，会阻塞浏览器渲染
 * componentDidMount、componentDidUpdate 和 componentWillUnmount 生命周期执行
 * 想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行
 * @param {*} callback 
 * @param {*} dependencies 
 */
function useEffect(callback, dependencies) {
  if (hookStates[hookIndex]) {
    let lastDeps = hookStates[hookIndex];
    let same = dependencies.every((item, index) => item === lastDeps[index]);
    if (same) {
      hookIndex++;
    } else {
      hookStates[hookIndex++] = dependencies;
      setTimeout(callback);
    }
  } else {
    hookStates[hookIndex++] = dependencies;
    setTimeout(callback);
  }
}

function Counter() {
  const [count, setCount] = useState(0);
  const latestCount = useRef(count);

  useEffect(() => {
    latestCount.current = count;
    setTimeout(() => {
      console.log(`You clicked ${latestCount.current} times`);
    }, 3000);
  });
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

export const element = React.createElement(Counter);