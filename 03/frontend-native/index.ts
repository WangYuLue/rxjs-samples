import { debounce } from 'lodash';

interface IAPIList {
  code: number;
  data: string[];
}

const getList = (keyword: string): Promise<IAPIList> => {
  return fetch(`http://localhost:3010/list?keyword=${keyword}`)
    .then(res => res.json())
}

const getListWithId = (keyword: string, id: string): Promise<IAPIList & { id: string }> => {
  return getList(keyword).then(res => ({ ...res, id }))
}

const render = (res: IAPIList) => {
  const $list = document.getElementById('list');
  if ($list) {
    const html = res.data.reduce((html, item) => (html += `<div>${item}</div>`, html), '')
    $list.innerHTML = html;
  }
}

const init = () => {
  const $input = document.getElementById('keyword');

  let requestId: string;

  if ($input) {
    const onInput = event => {
      const keyword = event.target.value;
      requestId = String(Math.random());
      getListWithId(keyword, requestId).then(res => {
        if (res.id === requestId) { // 处理竞态场景，如果请求id不一致，则表示超时，于是丢掉请求
          render(res);
        }
      })
    }
    const onDebounceInput = debounce(onInput, 300); // 防抖处理
    $input.addEventListener('input', onDebounceInput);
  }
}

init();
