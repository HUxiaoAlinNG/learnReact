import { updateQueue } from './component';
/**
 * 给 DOM元素 绑定 类型事件
 * @param {*} dom 真实DOM元素
 * @param {*} eventType 事件类型  onclick
 * @param {*} listener 事件处理函数 handleClick
 */
export function addEvent(dom, eventType, listener) {
  //给dom增加一个store属性,值是一个空对象
  let store = dom.store || (dom.store = {});
  store[eventType] = listener;//store.onclick=handleClick
  if (!document[eventType]) {
    document[eventType] = dispatchEvent;//document.onclick=dispatchEvent
  }
}

let syntheticEvent = {};

/**
 * 函数劫持
 * 设置 isBatchingUpdate 为 true
 * 批量更新
 * @param {*} event 原生的DOM事件对象
 */
function dispatchEvent(event) {
  let { target, type } = event;//type=click target事件源button dom
  let eventType = `on${type}`;//onclick
  updateQueue.isBatchingUpdate = true;
  let syntheticEvent = createSyntheticEvent(event);
  while (target) {
    let { store } = target;
    let listener = store && store[eventType];
    listener && listener.call(target, syntheticEvent);
    // 事件冒泡
    target = target.parentNode;
  }
  for (let key in syntheticEvent) {
    syntheticEvent[key] = null;
  }
  updateQueue.batchUpdate();
}

// 记录原生事件
function createSyntheticEvent(nativeEvent) {
  for (let key in nativeEvent) {
    syntheticEvent[key] = nativeEvent[key];
  }
  return syntheticEvent;
}