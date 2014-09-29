# Fontello CLI

Command line interface to easily integrate/manage Fontello fonts into your application.


## Installation
```sh
$ npm install fontello-installer
```

##Usage

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

##Configurations:

 

**config: (Required)**

File path to your config.json, you should specify the path, if file does not exits, system will create empty file for you during the installation.

*config.json*
 
**cssPath: (Required)**

Folder path, where you want to save your CSS files (This path should phycical exits)

*'./src/app/styles/css'*

 
**cssFiles: (Optional)**

Fontello create four different files, but most of the time we don't need all of them, provide array of file name need, skipping this option will copy all CSS files

*['animation.css','fontello.css']*


**cssFontPath:**

Folder path, where you want to save your CSS files (This path should physical exits)

*'/assets/fonts/'*


**fontPath:**

Fontello CSS files include fonts from '../font/' path, provide the differ prefix if required to load fonts for your project.

*'./src/app/assets/fonts'*

