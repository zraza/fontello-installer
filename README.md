# Fontello CLI

Command line interface to easly integrate/manage Fontello fonts into your application.


## Installation
```sh
$ npm install fontello-installer
```

#Usage

```
var fontello = require('fontello-installer');
  fontello.run({
    config:'config.json',
    cssPath:'./src/app/styles/css',
    cssFiles:['animation.css','fontello.css'],
    cssFontPath:'/assets/fonts/',
    fontPath:'./src/app/assets/fonts'
  });
```  