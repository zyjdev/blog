import { HeadConfig } from "vitepress";

/*
 * 在 config 中配置
 */

// #region 图标
type FaviconTheme = "light" | "dark"; // 不提供 其他 类型
type FaviconShape = "rounded" | "circle" | null;

/** 获得 /favicon/ 中图标相关文件路径 */
function getFaviconPath(
  theme?: FaviconTheme,
  shape?: FaviconShape,
  filepath?: string
) {
  let folder = "light";

  theme && (folder = theme);
  shape && (folder += `_${shape}`);

  folder = `/favicon/${folder}`;

  if (!filepath) {
    return folder;
  }

  return `${folder}/${filepath}`;
}

/** 获得字体图标 */
export function getFontFavicon(
  theme: FaviconTheme,
  shape?: FaviconShape
): HeadConfig[] {
  return [
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: getFaviconPath(theme, shape, "apple-touch-icon.png"),
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: getFaviconPath(theme, shape, "favicon-32x32.png"),
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: getFaviconPath(theme, shape, "favicon-16x16.png"),
      },
    ],
    [
      "link",
      {
        rel: "manifest",
        href: getFaviconPath(theme, shape, "site.webmanifest"),
      },
    ],
  ];
}
// #endregion

//
const funMapping = {
  favicon: ({ theme, shape }) => getFontFavicon(theme, shape),
};

export default function defineHead(
  options: {
    favicon?: {
      theme?: FaviconTheme;
      shape?: FaviconShape;
    };
  },
  head: HeadConfig[] = []
) {
  let innerHead = [] as HeadConfig[];

  for (const key in options) {
    if (!Reflect.has(funMapping, key)) continue;

    const func = funMapping[key];
    const res = func(options[key]) as HeadConfig[];
    innerHead = [...innerHead, ...res];
  }

  return [...innerHead, ...head];
}
