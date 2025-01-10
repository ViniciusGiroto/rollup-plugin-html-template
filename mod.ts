import { minify } from "html-minifier-terser";

type MinifyOptions = (minify extends (...args: infer U) => any ? U : never)[1];

export default function (
  config?: Partial<{
    shadowRootMode: "open" | "closed";
    minifyOptions: MinifyOptions;
  }>,
) {
  return {
    name: "rollup-plugin-html-template",
    async transform(code: string, id: string) {
      if (id.endsWith(".template.html")) {
        const html = await minify(
          code,
          config?.minifyOptions ?? {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
          },
        );
        return `
         const template = document.createElement("template");
         template.shadowRootMode = ${
          JSON.stringify(config?.shadowRootMode ?? "open")
        };
         template.innerHTML = ${JSON.stringify(html)};
         export default template;
       `;
      }
    },
  };
}
