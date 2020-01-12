/* eslint-env node */

const fs = require("fs").promises;

async function main() {
  const dir = await fs.opendir("src/modules");
  const names = [];
  for await (const e of dir) {
    if (e.name !== "index.js") {
      names.push(e.name.slice(0, -3));
    }
  }
  const output =
    names.map(n => `import ${n} from "./${n}.js";\n`).join("") + 
    `export default [${names.join(",")}];`;
  fs.writeFile("src/modules/index.js", output);
}

main().catch(console.error);
