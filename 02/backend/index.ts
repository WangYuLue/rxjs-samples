import * as Koa from 'koa';
import * as Router from 'koa-router';
import { myTimeout, randomAdd } from './utils';

const app = new Koa();
const router = new Router();

let progress = 0;

const setCorsHeader = async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  await next();
}

/**
 * 模拟上传接口
 */
router.post('/upload', async ctx => {
  await myTimeout(4000);
  progress = 0;
  ctx.set('Content-Type', 'application/json');
  ctx.body = {
    code: 200,
    message: "upload success"
  }
})

/**
 * 上传成功后，模拟处理进度接口
 */
router.get('/progress', async ctx => {
  await myTimeout(Math.floor(Math.random() * 1200)); // 0 到 1200 毫秒的延时
  const newProgress = randomAdd(progress);
  progress = newProgress >= 100 ? 100 : newProgress
  ctx.set('Content-Type', 'application/json');
  ctx.body = {
    code: 200,
    data: {
      progress
    }
  }
})

app
  .use(setCorsHeader)
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3010)

console.log('koa2 start on 3010')