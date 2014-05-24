WAS: src/static/js
==============

Keep all application Javascript files in this directory. Each of these files
should represent a target Javascript file that will be used as the src in a
script tag in HTML; keep all other Javascript files inside of `static/js/lib`.
Files with a `.js` extension will be processed by the Closure compiler.

static/js/typedefs.js
---------------------

Place all application typedefs into this file. See the comments in the source
for details.

static/js/externs
-----------------

Keep all application extern definition Javascript files in this directory
(there is also an externs folder available in `static/thirdparty`). Each file
with a `.js` extension will be identified to the compiler as an externs file.
Extern definitions are an important part of compiling Javascript code; see:
https://developers.google.com/closure/compiler/docs/api-tutorial3#externs

Note About \_\_was\_\_.js Files
-------------------------------

These special files contain basic methods to make the Closure Compiler function
as expected. These mostly work out details to make the Closure Compiler
function properly doing advanced optimization without requiring the Closure
Library as well. See comments in thier source for details. Do not remove them
unless you knowwhat you are doing.

--------------------------------------------------------------------------------

Copyright (c) 2013 Jordon Mears.

Web Application Scaffolding is made available under the MIT license.
<http://opensource.org/licenses/MIT>
