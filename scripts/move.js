const exec = require("child_process").exec;
const path = require("path");
const fs = require("fs");

const sh = `mv ${path.join(
  __dirname,
  "../build2",
  "background.js"
)} ${path.join(__dirname, "../build")}`;
const sh2 = `mv ${path.join(
  __dirname,
  "../build3",
  "content-script.js"
)} ${path.join(__dirname, "../build")}`;
const sh3 = `mv ${path.join(__dirname, "../build4", "inpage.js")} ${path.join(
  __dirname,
  "../build"
)}`;

exec(sh);
exec(sh2);
exec(sh3);

exec(`rm -rf ${path.join(__dirname, "../build2")}`);
exec(`rm -rf ${path.join(__dirname, "../build3")}`);
exec(`rm -rf ${path.join(__dirname, "../build4")}`);

// 首页 inline script 写入到 单独js文件
function inline_script() {
  let result = fs.readFileSync(path.join(__dirname, "../build/index.html"));
  result = Buffer.from(result).toString();

  let s = result.match(/<script>/);
  let n = result.match(/<\/script>/);

  let script = result.slice(s.index, n.index + 9);

  result = result.replace(script, '<script src="./main.js"></script>');
  script = script.replace("<script>", "").replace("</script>", "");

  fs.writeFileSync(path.join(__dirname, "../build/index.html"), result);
  fs.writeFileSync(path.join(__dirname, "../build/main.js"), script);
}
inline_script();

// inpage.js 内容写入到 content-script.js
function inpage() {
  let result = fs.readFileSync(
    path.join(__dirname, "../build/content-script.js")
  );
  result = Buffer.from(result).toString();
  let inpage = fs.readFileSync(path.join(__dirname, "../build/inpage.js"));
  inpage = Buffer.from(inpage).toString();
  inpage = inpage.replace(
    /\/\*\! For license information please see inpage.js.LICENSE.txt \*\/\n/,
    ""
  );

  result = result.replace('"{inpageContent}"', "'" + inpage + "'");
  fs.writeFileSync(path.join(__dirname, "../build/content-script.js"), result);
}
inpage();
