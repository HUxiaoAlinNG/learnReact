import React from "react";
import ReactDOM from "react-dom";

const hookStates = [];
let hookIndex = 0;
// useState的增强版
function useReducer(reducer, initialState, init) {
  hookStates[hookIndex] = hookStates[hookIndex] || (init ? init(initialState) : initialState);
  const currentIndex = hookIndex;
  function dispatch(action) {
    hookStates[currentIndex] = reducer ? reducer(hookStates[currentIndex], action) : action;
    render();
  }
  return [hookStates[hookIndex++], dispatch];
}
function useState(initialState) {
  return useReducer(null, initialState);
}

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return { number: state.number + 1 };
    case "minus":
      return { number: state.number - 1 };
    default:
      return state;
  }
}
function init(initialState) {
  return { number: initialState };
}
function Counter1() {
  const [state, setState] = useState({ number: 0 });
  return (
    <>
      Count: {state.number}
      <button onClick={() => setState({ number: state.number + 1 })}>+</button>
      <button onClick={() => setState({ number: state.number - 1 })}>-</button>
    </>
  )
}
function Counter2() {
  const [state, dispatch] = useReducer(reducer, 0, init);
  return (
    <>
      Count: {state.number}
      <button onClick={() => dispatch({ type: "add" })}>+</button>
      <button onClick={() => dispatch({ type: "minus" })}>-</button>
    </>
  )
}

function render() {
  hookIndex = 0;
  ReactDOM.render(
    <>
      <Counter1 />
      <Counter2 />
    </>,
    document.getElementById("root")
  );
}

export const element = React.createElement(React.Fragment, null, React.createElement(Counter1, null), React.createElement(Counter2, null));