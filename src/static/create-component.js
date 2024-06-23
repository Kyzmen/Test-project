const fs = require('fs');
var path = require('path');

function getPugTemplate(scriptName) {
  return `
extends ../layout/main
block variable
  -
    var title_page = '${scriptName}'
    var id_page = 'id-page-${scriptName}'
    var class_page = 'class-page-${scriptName}'
    var breadcrumbsSubitem = [
      {
        label: 'About',
        link: pagesLink[0].about
      }
    ]
  
block meta
  title= title_page
  meta(name='description', content='')
block head
    link(rel='stylesheet', href="./assets/styles/main.min.css")
block scripts
  script(defer src='./assets/scripts/vendors.bundle.js')
  script(defer src='./assets/scripts/index.bundle.js')
  script(defer src='./assets/scripts/libs.js')
  script(defer src='./assets/scripts/index.js')
  script(defer src='./assets/scripts/header.js')
  script(defer src='./assets/scripts/${scriptName}.js')
block content
  h1 ${scriptName}
block footer
  include ../includes/footer.pug

block header
  include ../includes/header.pug
`
}
const tmplateName = process.argv[2];

if (!!tmplateName === false) {
    console.warn('You didn`t enter component name');
    return;
}

const pathesToComponentParts = {
    pug: 'src/pug/pages/',
    style: 'src/assets/styles/pages/',
    script: 'src/assets/scripts/gulp-modules/',
};
const formats = {
    pug: 'pug',
    style: 'scss',
    script: 'js',
};


const typesFile = Object.keys(pathesToComponentParts);

typesFile.forEach((type) => {
  const pathToFolder = pathesToComponentParts[type];
  console.log(pathesToComponentParts);
  fs.readdir(path.resolve(process.cwd(), pathToFolder), function(err, files) {
    let isFileExistInFolder = false;
    const componentName = `${tmplateName}.${formats[type]}`;
  
    const filesNameWithoutExt = files.map(el => el.replace(/\.(scss|pug|js)/, ''));
    const pathToFile = `${pathToFolder}/${componentName}`;

    if (filesNameWithoutExt.includes(tmplateName)) isFileExistInFolder = true;

    if (!isFileExistInFolder) {
      const contentTemplate = (type === 'pug') ? getPugTemplate(tmplateName) : '';

      fs.writeFile(pathToFile, contentTemplate, function(err) {
          console.log(`\x1b[32m`, `${componentName} создан`);
      });
      return;
    }
    console.log(`\x1b[33m%s\x1b[0m`, `${componentName} уже есть`);
  });
});

