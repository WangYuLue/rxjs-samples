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

const _mockCanCancelAjax = (id: string): Promise<IData & { id: string }> => {
  return _mockAjax().then(res => ({ ...res, id }))
}

const init = () => {
  const $box = document.getElementById('box');

  if ($box) {
    let isMoveIn: boolean;

    const render = (res: IData) => {
      $box.innerHTML = res.data;
    }

    const onMouseleave = () => isMoveIn = false;
    const onMouseenter = () => isMoveIn = true;

    let postId: string;

    setInterval(() => { // 定时器
      if (isMoveIn) {
        postId = String(Math.random());
        _mockCanCancelAjax(postId).then(res => {
          if (isMoveIn && res.id === postId) { // 如果请求id不一致，则表示超时，于是丢掉请求
            render(res)
          }
        })
      }
    }, 1000)

    $box.addEventListener('mouseleave', onMouseleave);
    $box.addEventListener('mouseenter', onMouseenter);
  }
}

init();

export { };