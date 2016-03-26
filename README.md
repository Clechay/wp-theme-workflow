# Wordpress Theme Workflow

### with Gulp, Jade-PHP, Sass & Bootstrap

## THIS WORKFLOW IS UNDER DEVELOPMENT AND MUST *NOT* BE USED ON ANY COMPUTER SYSTEM THAT CONTAINS IMPORTANT DATA.

## I TAKE NO RESPONSIBILITY FOR ANY DAMAGE CAUSED BY LACK OF DOCUMENTATION OR SOFTWARE MALFUNCTIONING.

The MIT License (MIT)
Copyright (c) 2016 Łukasz Kleczaj

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Setup

You need git, node.js with npm and bower installed on your system.

Last one can be installed by ```npm i -g bower```

```
git clone <this repo url>
npm i
bower i
```

### you must specify theme directory inside wordpress installation in theme.json file

Reamember that theme directory must NOT be the source directory

After you double checked "dist" property inside theme.json file run ```gulp``` inside source dir.