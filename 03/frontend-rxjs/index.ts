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
      debounceTime(300),
      switchMap(keyword => getList(keyword as string))
    ).subscribe(observer)
  }
}

init();