import { from, fromEvent, interval, merge, EMPTY } from 'rxjs';
import { filter, mapTo, map, switchMap, withLatestFrom } from 'rxjs/operators';

interface IData {
  code: number;
  data: string
}

const _mockAjax = (): Promise<IData> => {
  return new Promise(resolve => {
    // 延时设定在 700 ～ 1200 毫秒，来模拟后面1000毫秒延时的处理
    const delay = Math.floor(Math.random() * 500) + 700;
    setTimeout(() => resolve({
      code: 200,
      data: String(delay)
    }), delay);
  })
}

const init = () => {
  const $box = document.getElementById('box');

  if ($box) {
    // 鼠标离开数据流
    const mouseleave$ = fromEvent($box, 'mouseleave').pipe(mapTo(false));
    // 鼠标进入数据流
    const mouseenter$ = fromEvent($box, 'mouseenter').pipe(mapTo(true));
    // 1秒轮训一次
    const interval$ = interval(1000);

    const observer = (res: IData) => {
      $box.innerHTML = res.data;
    }

    const mouse$ = merge(mouseleave$, mouseenter$);

    mouse$.pipe(
      switchMap(res => res ? interval$ : EMPTY), // 鼠标离开时发出空的事件
      switchMap(() => from(_mockAjax())), // 每隔一秒请求一次数据，并抛弃之前的请求
      withLatestFrom(mouse$), // 鼠标移出盒子后，最后一个请求还在继续，所以要拿到鼠标现在的状态来做判断
      filter(([data, status]) => status), // 如果鼠标已经移出盒子，过滤掉
      map(([data, status]) => data) // 拿到请求的数据
    ).subscribe(observer);
  }
}

init();