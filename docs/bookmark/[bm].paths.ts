import fs from "fs";
import path from "path";

interface Params {
  bm: string;
  data: unknown;
}

// 存放 bookmark json 数据的文件夹路径
const bookmarkDir = path.normalize("docs/bookmark");

function getPaths(
  p: string,
  arr: Record<"params", Params>[],
  base = bookmarkDir
) {
  fs.readdirSync(p).forEach((bm) => {
    const filepath = path.join(p, bm);

    const info = fs.statSync(filepath);

    if (info.isDirectory()) {
      getPaths(filepath, arr, base);
      return;
    }

    if (
      path.extname(bm) !== ".json" ||
      fs.existsSync(filepath.replace(".json", ".md"))
    )
      return;

    const params = {} as Params;

    params.bm = path
      .relative(base, filepath)
      .replace(/[\\\\, \\]/g, "/")
      .replace(".json", "");

    path.sep;

    const data = fs.readFileSync(path.resolve(p, bm), {
      encoding: "utf-8",
    });
    params.data = JSON.parse(data);

    arr.push({ params: params });
  });
}

export default {
  paths() {
    const paths = [];
    getPaths(bookmarkDir, paths, bookmarkDir);

    return paths;
  },
};
