// copy the file at src/components/CodeInput/styles.module.css
// to dist/source/components/CodeInput/styles.module.css

// Path: scripts/copy.js

function copyCSSModuleFile() {
  const fs = require('fs');
  const path = require('path');
  const cssModuleFile = path.resolve(
    __dirname,
    '../src/components/CodeInput/styles.module.css',
  );
  const distCSSModuleFile = path.resolve(
    __dirname,
    '../dist/source/components/CodeInput/styles.module.css',
  );
  fs.copyFile(cssModuleFile, distCSSModuleFile, (err) => {
    if (err) throw err;
    console.log('CSS Module file was copied to dist');
  });
}

copyCSSModuleFile();
