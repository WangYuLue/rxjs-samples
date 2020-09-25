import { interval, Observable, of, race } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  delay,
  distinct,
  pluck,
  map,
  mergeMap,
  switchMap,
  tap,
  takeWhile
} from "rxjs/operators";

interface IAPIUpload {
  code: number;
  message: string;
}

interface IAPIProgress {
  code: number;
  data: {
    progress: number;
  }
}

const ServerURL = 'http://localhost:3010';

/**
 * 服务端请求数据
 * 
 * @param url 接口地址
 */
const _ajax = <T>(url: string, type: 'post' | 'get' = 'get'): Observable<T> => {
  return race(
    of({ code: 400, message: "请求超时！" }).pipe(delay(5000)), // 5 秒未返回则抛出超时异常
    ajax[type](url).pipe(
      pluck('response')
    )
  );
}

const init = () => {
  const $progress = document.getElementById('progress')

  const observer = (progress: number) => {
    if ($progress) {
      if (progress === 100) {
        $progress.innerText = String(progress) + '-> 处理完成'
      } else {
        $progress.innerText = String(progress)
      }
    }
  }

  _ajax<IAPIUpload>(ServerURL + '/upload', 'post').pipe( // 请求上传接口 `/upload`
    tap(res => console.log(res.message)), // 打印请求成功信息
    delay(2000), // 延时 2 秒后调用 /progress 接口
    mergeMap(() =>
      interval(1000).pipe( // 每隔 1 秒发出一个查询请求
        tap(() => console.log('==>')),
        switchMap(() =>   // 如果轮询时有延时，而1秒又有新的请求产生，丢掉之前的请求。
          _ajax<IAPIProgress>(ServerURL + '/progress')
        ),
        map(res => res.data.progress)
      )
    ),
    distinct(process => process), // 如果最新的进度值和旧的值一样，不做渲染操作
    tap(progress => console.log(progress)),
    takeWhile(progress => progress < 100, true) // 进度大于 100 时，停止请求
  ).subscribe(observer);
}

init();
