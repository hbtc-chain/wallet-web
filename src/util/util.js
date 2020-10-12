import { v4 } from "uuid";

/**
 * 对消息进行包装
 * @param {string} from page,background,popup
 * @param {string} to page,background,popup
 * @param {string} id
 * @param {string} tabId 浏览器tab id，如果是发送到page的消息，则发送到=tabid的这个tab，如果没有，读取当前激活的窗口tabid
 * @param {number} time 时间戳
 * @param {string} type 事件类型：sign签名，connect链接插件，get_account获取账户信息，其他业务以后在增加, set_store, get_store
 * @param {object} data 具体的消息内容
 */
function packmsg({ from, to, id, tabId, type, data }) {
  return {
    from,
    to,
    id: id || v4(),
    tabId: tabId || "",
    time: new Date().getTime(),
    type,
    data: data || "",
  };
}

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

/**
 * 精度判断
 * @param {String} v v=number时，传入999. , 返回的数值会被忽略.
 * @param {Number} digits   -10,-1,1,2,3,4
 */
function fix_digits(v, digits) {
  if (!digits) {
    return v ? Math.floor(v) : v;
  }
  if (!v && v !== 0) return v;
  if (digits <= 0) {
    return Math.floor(v);
  }
  let string_v = `${v}`;
  let d = string_v.split(".");
  if (!d[1] || d[1].length <= digits) {
    return string_v;
  }
  d[1] = d[1].split("");
  d[1].length = digits;
  d[1] = d[1].join("");
  return d[0] + "." + d[1];
}

export default {
  packmsg,
  delay,
  fix_digits,
};
