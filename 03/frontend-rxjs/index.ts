import { fromEvent, Observable } from 'rxjs';
import { ajax } from "rxjs/ajax"
import { debounceTime, pluck, switchMap } from 'rxjs/operators';

interface IAPIList {
  code: number;
  data: string[];
}

const getList = (keyword: string): Observable<IAPIList> => {
  return ajax.get(`http://localhost:3010/list?keyword=${keyword}`).pipe(pluck('response'))
}

const observer = (res: IAPIList) => {
  const $list = document.getElementById('list');
  if ($list) {
    const html = res.data.reduce((html, item) => (html += `<div>${item}</div>`, html), '')
    $list.innerHTML = html;
  }
}

const init = () => {
  const $input = document.getElementById('keyword');

  if ($input) {
    fromEvent($input, 'input').pipe(
      pluck('target', 'value'),
      debounceTime(300), // 防抖处理
      switchMap(keyword => getList(keyword as string)) // 处理竞态场景，如果有新的请求，丢掉之前的请求
    ).subscribe(observer)
  }
}

init();