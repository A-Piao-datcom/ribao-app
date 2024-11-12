
export const host = "http://127.0.0.1:3000";

// api/index.js

// 通用的 GET 请求封装
export const get = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: url,
      data: data,
      method: 'GET',
      success(res) {
        // 判断请求是否成功
        if (res.statusCode === 200) {
			// console.log('--->',res);
          resolve(res.data); // 将获取的数据传递给调用者
        } else {
          reject(`请求失败，状态码：${res.statusCode}`);
        }
      },
      fail(err) {
        reject('请求失败，请检查网络连接或接口地址');
      }
    });
  });
};

// 获取文章列表接口
export const fetchLatestStories = () => {
  return get('https://apis.netstart.cn/zhihudaily/stories/latest');
};
// 获取特定文章详情
export const fetchArticleDetails = (id) => {
  return get(`https://apis.netstart.cn/zhihudaily/story/${id}`);
};
// 获取分页文章列表
export const fetchSectionStories = (page = 1) => {
  return get(`https://apis.netstart.cn/zhihudaily/section/1?page=${page}`);
};
// https://apis.netstart.cn/zhihudaily/stories/before/