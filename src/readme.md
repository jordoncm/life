WAS: src
========

All application source code files go here. Use the `was build`, `was run` and
`was deploy` commands to compile and transfer the source files here into the
desired destination.

CSS and Javascript
------------------

All application CSS and Javascript should be kept in `static/css` or
`static/js` and by default will be processed and compiled before execution in
the browser. These folders also maintain a specifc structure so the compiler
knows how to treat application code properly (see the readme.md files in the
folders).

Third Party Code
----------------

It is good practice to keep all third party code separated in some way from the
rest of your application source. By default any folder named `thirdparty` in
this directory structure will be ingnored and left unchaged by any of the build
steps. However these folders will get transfered to the distribution package
unchanged on build. This allows you to isolate outside code and be
conscientious about its use in your application.

--------------------------------------------------------------------------------

Copyright (c) 2013 Jordon Mears.

Web Application Scaffolding is made available under the MIT license.
<http://opensource.org/licenses/MIT>
