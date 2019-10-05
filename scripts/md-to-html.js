const md = require('markdown-it')('commonmark');
const markdownItAttrs = require('markdown-it-attrs');
const fs = require('fs-extra');
const path = require('path');
const { stringify } = require('javascript-stringify');

const HEADER = `<!DOCTYPE html>
<!--[if IE 9]><html class="ie ie9" lang="en" class="no-js"> <![endif]-->
<!--[if !(IE)]><!-->
<html lang="en" class="no-js">
  <!--<![endif]-->

  <head>
    <title>whitewater.guide - mobile app for kayakers</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <meta
      name="description"
      content="whitewater.guide - mobile app for kayakers"
    />
    <!-- CSS -->
    <link
      href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css"
      rel="stylesheet"
      type="text/css"
    />
    <link href="/assets/css/main.css" rel="stylesheet" type="text/css" />
    <link href="/assets/css/skins/blue.css" rel="stylesheet" type="text/css" />

    <!-- GOOGLE FONTS -->
    <link
      href="//fonts.googleapis.com/css?family=Open+Sans:300,400,700"
      rel="stylesheet"
      type="text/css"
    />
    <!-- FAV AND TOUCH ICONS -->
    <!--<link rel="apple-touch-icon-precomposed" type="image/png" sizes="57x57" href="assets/ico/zi-favicon57x57.png">-->
    <link rel="shortcut icon" href="/assets/ico/favicon.png" />
  </head>

  <body>
    <!-- WRAPPER -->
    <div class="wrapper">
      <section class="generated-markdown">
        <div class="container">
`;

const FOOTER = `</div>
      </section>

      <!-- FOOTER -->
      <footer class="generated-markdown">
        <div class="container">
          <p class="copyright">&copy;2019 whitewater.guide</p>
        </div>
      </footer>
      <!-- END FOOTER -->
    </div>
    <!-- END WRAPPER -->
    <div class="back-to-top">
      <a href="#top"><i class="fa fa-angle-up"></i></a>
    </div>
    <!-- JAVASCRIPTS -->
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/1.4.3/jquery.scrollTo.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery-localScroll/1.2.8/jquery.localScroll.min.js"></script>
    <script src="/assets/js/index.js"></script>
  </body>
</html>
`;

md.use(markdownItAttrs);

function convert(mdFile, htmlFile) {
  const input = fs.readFileSync(mdFile, 'utf8');
  let output = HEADER + md.render(input) + FOOTER;
  output = output.replace('color="0"', `style="color: #666666"`);
  output = output.replace('color="1"', `style="color: #000066"`);
  output = output.replace('color="2"', `style="color: #0000FF"`);
  output = output.replace('color="3"', `style="color: #00FF00"`);
  output = output.replace('color="4"', `style="color: #FF0000"`);
  output = output.replace('color="5"', `style="color: #990000"`);
  fs.writeFileSync(htmlFile, output, 'utf8');
}

function traverse() {
  const mdDir = path.resolve(__dirname, '../src/markdown');
  const htmlDir = path.resolve(__dirname, '../assets/html');
  const markdown = {};
  fs.readdirSync(mdDir).forEach((lang) => {
    let langDir = path.resolve(mdDir, lang);
    if (fs.statSync(langDir).isDirectory()) {
      fs.mkdirpSync(path.resolve(htmlDir, lang));
      fs.readdirSync(langDir).forEach((file) => {
        const mdFilePath = path.resolve(langDir, file);
        if (mdFilePath.endsWith('.md')) {
          convert(
            mdFilePath,
            path.resolve(htmlDir, lang, file.replace('.md', '.html')),
          );
          
          const key = file.replace('.md', '');
          const byLang = markdown[key] || {};
          byLang[lang] = true;
          markdown[key] = byLang;
        }
      });
    }
  });

  let jsFile = path.resolve(__dirname, '../markdown', 'index.js');
  let tsFile = path.resolve(__dirname, '../markdown', 'index.d.ts');
  fs.ensureFileSync(jsFile);
  fs.writeFileSync(jsFile, (
    "Object.defineProperty(exports, '__esModule', { value: true });\nexports.default = " +
    stringify(markdown, null, null, { skipUndefinedProperties: true }) +
    ';'
  ), 'utf8');
  fs.ensureFileSync(tsFile);
  fs.writeFileSync(tsFile, `declare const _default: Record<string, Record<string, boolean>>;\nexport default _default;`, 'utf8');
}

traverse();
