const fs = require('fs-extra');
const path = require('path');
const { stringify } = require('javascript-stringify');

const LANGS = fs.readdirSync(path.resolve(__dirname, '../src/commons'));

function merge(lang, components) {
  let result = {};
  components.forEach(({ component, noWrap }) => {
    const jsonFile = path.resolve(
      __dirname,
      `../src/${component}/${lang}/${component}.json`,
    );
    const content = fs.readJsonSync(jsonFile, { throws: false }) || undefined;
    if (noWrap) {
      result = { ...result, ...content };
    } else {
      result = { ...result, [component]: content };
    }
  });
  return (
    "Object.defineProperty(exports, '__esModule', { value: true });\nexports.default = " +
    stringify(result, null, null, { skipUndefinedProperties: true }) +
    ';'
  );
}

function write(subdir, lang, data) {
  let jsFile = path.resolve(__dirname, '..', subdir, lang, 'index.js');
  let tsFile = path.resolve(__dirname, '..', subdir, lang, 'index.d.ts');
  fs.ensureFileSync(jsFile);
  fs.writeFileSync(jsFile, data, 'utf8');
  fs.ensureFileSync(tsFile);
  fs.writeFileSync(tsFile, `import i18next from 'i18next';\ndeclare const _default:i18next.Resource;\nexport default _default;`, 'utf8');
}

function generate() {
  const configs = {
    mobile: [
      { component: 'commons' },
      { component: 'mobile', noWrap: true },
      { component: 'yup' },
    ],
    web: [{ component: 'commons' }, { component: 'yup' }],
  };
  Object.entries(configs).forEach(([subdir, components]) => {
    LANGS.forEach((lang) => {
      const data = merge(lang, components);
      write(subdir, lang, data);
    });
  });
}

generate();
