import store from "./store";
export default async function (url, options = {}) {
  const datas = await store.get();
  const t = 10000;

  options = Object.assign(
    {
      //credentials: options.credentials || "same-origin", // 是否跨域访问cookie， omit默认，same-origin同域，include
      method: options.method || "GET",
      mode: options.mode || "cors", // 是否允许跨域请求，no-cors默认，same-origin同域，cors跨域
    },
    options
  );
  const url_prefix = datas.chain[datas.chain_index]["url"];
  return Promise.race([
    new Promise((reslove, reject) => {
      setTimeout(() => {
        reject("timeoute " + url);
      }, t);
    }),
    window
      .fetch(url_prefix + url, options)
      .then((response) => {
        if (response.status >= 200 && response.status < 502) {
          return response;
        } else {
          return Promise.reject(response.statusText);
        }
      })
      .then((res) => {
        return res
          .text()
          .then((d) => {
            let result = { code: 400, msg: "", data: { error: "" } };
            try {
              result.data = JSON.parse(d);
            } catch (e) {}
            result.code = res.status;
            result.msg = res.status == 200 ? "OK" : result.data.error;
            return result;
          })
          .catch((e) => Promise.reject(e));
      })
      .catch((e) => Promise.reject(e)),
  ]);
}
