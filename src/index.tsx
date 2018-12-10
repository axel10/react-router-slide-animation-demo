import history from '@/history';
import {routes} from "@/router";
import ReactDOM from 'react-dom';
import './index.scss';

const config = {
  routeAnimationDuration: 350,
};


let historyKeys: string[] = JSON.parse(sessionStorage.getItem('historyKeys')); // 记录history.location.key的列表。存储进sessionStorage以防刷新丢失

if (!historyKeys) {
  historyKeys = history.location.key ? [history.location.key] : [''];
}

let lastPathname = history.location.pathname;
const positionRecord = {};
let isAnimating = false;
let bodyOverflowX = '';

let currentHistoryPosition = historyKeys.indexOf(history.location.key); // 记录当前页面的location.key在historyKeys中的位置
currentHistoryPosition = currentHistoryPosition === -1 ? 0 : currentHistoryPosition;
history.listen((() => {

  if (lastPathname === history.location.pathname) { return; }

  if (!history.location.key) {  // 目标页为初始页
    historyKeys[0] = '';
  }
  const delay = 50; // 适当的延时以保证动画生效
  if (!isAnimating) { // 如果正在进行路由动画则不改变之前记录的bodyOverflowX
    bodyOverflowX = document.body.style.overflowX;
  }
  const originPage = document.getElementById('routeWrap').children[0] as HTMLElement;
  const oPosition = originPage.style.position;
  setTimeout(() => { // 动画结束后还原相关属性
    document.body.style.overflowX = bodyOverflowX;
    originPage.style.position = oPosition;
    isAnimating = false;
  }, config.routeAnimationDuration + delay + 50); // 多50毫秒确保动画执行完毕
  document.body.style.overflowX = 'hidden'; // 防止动画导致横向滚动条出现

  if (history.location.state && history.location.state.noAnimate) { // 如果指定不要发生路由动画则让新页面直接出现
    setTimeout(() => {
      const wrap = document.getElementById('routeWrap');
      const newPage = wrap.children[0] as HTMLElement;
      const oldPage = wrap.children[1] as HTMLElement;
      newPage.style.opacity = '1';
      oldPage.style.display = 'none';
    });
    return;
  }
  const { action } = history;

  const currentRouterKey = history.location.key ? history.location.key : '';
  const oldScrollTop = window.scrollY;
  originPage.style.position = 'fixed';
  originPage.style.top = -oldScrollTop + 'px'; // 防止页面滚回顶部
  setTimeout(() => { // 新页面已插入到旧页面之前
    isAnimating = true;
    const wrap = document.getElementById('routeWrap');
    const newPage = wrap.children[0] as HTMLElement;
    const oldPage = wrap.children[1] as HTMLElement;
    if (!newPage || !oldPage) {
      return;
    }
    const currentPath = history.location.pathname;

    const isForward = historyKeys[currentHistoryPosition + 1] === currentRouterKey; // 判断是否是用户点击前进按钮

    if (action === 'PUSH' || isForward) {
      positionRecord[lastPathname] = oldScrollTop; // 根据之前记录的pathname来记录旧页面滚动位置
      window.scrollTo(0,0);  // 如果是点击前进按钮或者是history.push则滚动位置归零

      if (action === 'PUSH') {
        historyKeys = historyKeys.slice(0, currentHistoryPosition + 1);
        historyKeys.push(currentRouterKey); // 如果是history.push则清除无用的key
      }
    } else {
      // 如果是点击回退按钮或者调用history.pop、history.replace则让页面滚动到之前记录的位置
      window.scrollTo(0,positionRecord[currentPath]);

      // 删除滚动记录列表中所有子路由滚动记录
      for (const key in positionRecord) {
        if (key === currentPath) {
          continue;
        }
        if (key.startsWith(currentPath)) {
          delete positionRecord[key];
        }
      }
    }

    if (action === 'REPLACE') { // 如果为replace则替换当前路由key为新路由key
      historyKeys[currentHistoryPosition] = currentRouterKey;
    }
    window.sessionStorage.setItem('historyKeys', JSON.stringify(historyKeys)); // 对路径key列表historyKeys的修改完毕，存储到sessionStorage中以防刷新导致丢失。

    // 开始进行滑动动画
    newPage.style.width = '100%';
    oldPage.style.width = '100%';
    newPage.style.top = '0px';
    if (action === 'PUSH' || isForward) {
      newPage.style.left = '100%';
      oldPage.style.left = '0';

      setTimeout(() => {
        newPage.style.transition = `left ${(config.routeAnimationDuration - delay) / 1000}s`;
        oldPage.style.transition = `left ${(config.routeAnimationDuration - delay) / 1000}s`;
        newPage.style.opacity = '1'; // 防止页面闪烁
        newPage.style.left = '0';
        oldPage.style.left = '-100%';
      }, delay);
    } else {
      newPage.style.left = '-100%';
      oldPage.style.left = '0';
      setTimeout(() => {
        oldPage.style.transition = `left ${(config.routeAnimationDuration - delay) / 1000}s`;
        newPage.style.transition = `left ${(config.routeAnimationDuration - delay) / 1000}s`;
        newPage.style.left = '0';
        oldPage.style.left = '100%';
        newPage.style.opacity = '1';
      }, delay);
    }
    currentHistoryPosition = historyKeys.indexOf(currentRouterKey); // 记录当前history.location.key在historyKeys中的位置
    lastPathname = history.location.pathname;// 记录当前pathname作为滚动位置的键
  });

}));


ReactDOM.render(routes(), document.getElementById('root'));
