import urls from "../util/api";
import request from "../util/request";

/**
 * 通用请求
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 * @return {promise}
 */
export default function getData(url) {
  return ({ payload, ...props }) => {
    return request(url, { body: payload, ...props });
  };
}
