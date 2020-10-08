import * as Koa from 'koa';
import * as Router from 'koa-router';
import { myTimeout, randomId } from './utils';

const app = new Koa();
const router = new Router();

const setCorsHeader = async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  await next();
}



const genDataList = (keyword: string): string[] => {
  const num = Math.floor(Math.random() * 5) + 5;
  return Array(num).fill('').map(() => `(${randomId()}):${keyword}`)
}

/**
 * 模拟列表查询接口
 */
router.get('/list', async ctx => {
  await myTimeout(Math.floor(Math.random() * 1200)); // 0 到 1200 毫秒的延时
  ctx.set('Content-Type', 'application/json');
  const keyword = ctx.query.keyword || 'default';
  console.log(ctx.query);
  ctx.body = {
    code: 200,
    data: genDataList(keyword)
  }
})

app
  .use(setCorsHeader)
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3010)

console.log('koa2 start on 3010')