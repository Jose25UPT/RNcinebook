const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const files = [ 'App.js', 'index.js', ...glob.sync(path.join('src', '**', '*.js')) ];
const offenders = [];

for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx'],
    });
  } catch (error) {
    console.error(`No se pudo parsear ${file}:`, error.message);
    continue;
  }

  traverse(ast, {
    JSXText(pathNode) {
      const value = pathNode.node.value;
      if (!value || value.trim() === '') return;

      const parentPath = pathNode.parentPath;
      if (!parentPath || !parentPath.isJSXElement()) return;

      const openingEl = parentPath.node.openingElement;
      const nameNode = openingEl.name;
      const name = getName(nameNode);

      if (name !== 'Text') {
        const { line, column } = pathNode.node.loc.start;
        offenders.push({ file, line, column, text: value.trim() });
      }
    },
  });
}

if (offenders.length === 0) {
  console.log('Sin textos fuera de <Text>.');
} else {
  console.log('Textos fuera de <Text> encontrados:');
  offenders.forEach(({ file, line, column, text }) => {
    console.log(`${file}:${line}:${column} -> ${text}`);
  });
}

function getName(node) {
  if (!node) return '';
  if (node.type === 'JSXIdentifier') return node.name;
  if (node.type === 'JSXMemberExpression') {
    return `${getName(node.object)}.${getName(node.property)}`;
  }
  if (node.type === 'JSXNamespacedName') {
    return `${getName(node.namespace)}:${getName(node.name)}`;
  }
  return '';
}
