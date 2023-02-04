import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/blog/",
  lang: "zh-CN",
  description: "工作总结，读书笔记",
  theme,

  shouldPrefetch: false,
});
