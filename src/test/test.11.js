
// import React from "../react/react";
import React from "react";
import ReactDOM from "react-dom";

// Hook内部有dom diff操作
const hookState = [];
let hookIndex = 0;

function useState(initialState) {
  hookState[hookIndex] = hookState[hookIndex] || (typeof initialState === "function" ? initialState() : initialState);
  let currentIndex = hookIndex;
  function setState(newState) {
    hookState[currentIndex] = typeof newState === "function" ? newState(hookState[currentIndex]) : newState;
    render();
  }
  return [hookState[hookIndex++], setState];
}

function useMemo(factory, deps) {
  if (hookState[hookIndex]) {
    const [lastMemo, lastDeps] = hookState[hookIndex];
    // 浅比较
    const same = deps.every((item, i) => item === lastDeps[i]);
    if (same) {
      hookIndex++;
      return lastMemo;
    }
    const newMemo = factory();
    hookState[hookIndex++] = [newMemo, deps];
    return newMemo;
  }

  const newMemo = factory();
  hookState[hookIndex++] = [newMemo, deps];
  return newMemo;
}

function useCallback(callback, deps) {
  if (hookState[hookIndex]) {
    const [lastCallback, lastDeps] = hookState[hookIndex];
    // 浅比较
    const same = deps.every((item, i) => item === lastDeps[i]);
    if (same) {
      hookIndex++;
      return lastCallback;
    }
    hookState[hookIndex++] = [callback, deps];
    return callback;
  }

  hookState[hookIndex++] = [callback, deps];
  return callback;
}

let lastRef;
// eslint-disable-next-line no-unused-vars
function useRef() {
  lastRef = lastRef || { current: null };
  return lastRef;
}

let Child = ({ data, handleClick }) => {
  console.log("Child Render", data, handleClick);
  return <button onClick={handleClick}>{data}</button>
}

function App() {
  console.log("App Render")
  const [number, setNumber] = useState(0);
  const numberRef = useRef();
  const handleClick = () => {
    setNumber(number);
    numberRef.current = number;
    console.log(numberRef.current);
  }
  const data = useMemo(() => number, [number]);
  const handleClick2 = useCallback(() => setNumber(number + 1), [number]);
  return (
    <div>
      <p>{number}</p>
      <button onClick={handleClick}>+</button>
      <Child data={data} handleClick={handleClick2} />
    </div>
  )
}

function render() {
  hookIndex = 0;
  ReactDOM.render(
    <App />,
    document.getElementById("root")
  );
}

export const element = React.createElement(App);