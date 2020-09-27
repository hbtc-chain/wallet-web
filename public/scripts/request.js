export default function (url, options = {}) {
  const t = 10000;

  options = Object.assign(
    {
      //credentials: options.credentials || "same-origin", // 是否跨域访问cookie， omit默认，same-origin同域，include
      method: options.method || "GET",
      mode: options.mode || "cors", // 是否允许跨域请求，no-cors默认，same-origin同域，cors跨域
    },
    options
  );
  // if (options.data && !options.body) {
  //   options.body = options.data;
  // }
  // if (
  //   options.body &&
  //   Object.prototype.toString.call(options.body) === "[object Object]" &&
  //   !options.upload
  // ) {
  //   let str = "";
  //   //let form = new FormData();
  //   const fn = (item, key) => {
  //     str += `${key}[]=${item}&`;
  //   };
  //   for (const key in options.body) {
  //     if ({}.hasOwnProperty.call(options.body, key)) {
  //       const v = options.body[key];
  //       if (Object.prototype.toString.call(v) === "[object Array]") {
  //         for (let i = 0, l = v.length; i < l; i += 1) {
  //           fn(v[i], key);
  //         }
  //       } else {
  //         str += `${key}=${options.body[key]}&`;
  //       }
  //     }
  //     //form.append(key, options.body[key]);
  //   }
  //   str = str.replace(/&$/, "");
  //   if (/get/i.test(options.method)) {
  //     if (str) {
  //       url += url.indexOf("?") > -1 ? `&${str}` : `?${str}`;
  //     }
  //     delete options.body;
  //   }
  //   if (/post/i.test(options.method)) {
  //     options.body = str;
  //   }
  // }
  return Promise.race([
    new Promise((reslove, reject) => {
      setTimeout(() => {
        reject("timeoute " + url);
      }, t);
    }),
    window
      .fetch(url, options)
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
