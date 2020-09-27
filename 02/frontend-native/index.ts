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
 * @param postId 请求ID，用于取消请求
 */
const _ajax = <T>(url: string, postId: string = '', type: 'post' | 'get' = 'get'): Promise<T & { id: string }> => {
  return fetch(url, { method: type })
    .then(res => res.json())
    .then(res => Promise.resolve({ ...res, id: postId }))
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

  let localProgress = 0;

  _ajax<IAPIUpload>(ServerURL + '/upload', '', 'post').then(res => { // 请求上传接口 `/upload`
    console.log(res); // 打印请求成功信息
    setTimeout(() => { // 延时 2 秒后调用 /progress 接口
      let postId: string;
      const interval = setInterval(() => { // 每隔 1 秒发出一个查询请求
        postId = String(Math.random());
        console.log('==>')
        _ajax<IAPIProgress>(ServerURL + '/progress', postId).then(res => {
          if (res.id === postId) { // 如果id不一致，取消下面的操作
            const progress = res.data.progress;
            if (progress === localProgress) { // 如果最新的进度值和旧的值一样，不做渲染操作
              return;
            }
            localProgress = progress;
            console.log(progress)
            observer(localProgress);
            if (progress >= 100) {  // 进度到 100 时，停止请求
              clearInterval(interval);
              return;
            }
          }
        })
      }, 1000)
    }, 2000)
  })
}

init();

export { };
