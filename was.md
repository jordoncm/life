Web Application Scaffolding
===========================

This project provides a basic set of tools, code and folder structure to
develop a full web based application.

The scaffolding selects a couple basic tools to help ease the process of
compiling and deploying CSS and Javascript for a production application. The
scaffolding was designed to be simple and easy to customize and extend;
`readme.md` files can be found throughout the folder structure explaining the
purpose of each part of the scaffolding.

The scaffolding is setup to build and deploy Python based web applications by
default but it should be general and easy enough to remove the Python specific
stuff and replace it for another server side technology (also works well for
static Javascript applications).

Setting Up the Development Environment
--------------------------------------

The scaffolding uses the following components by default for CSS and Javascript
compilation (and lint):

  - Closure Compiler <https://developers.google.com/closure/compiler/>
  - LESS <http://lesscss.org/>

The scaffolding will also use things like pylint and other Python utilities
unless they are disabled.

To setup the development environment you can either execute `setup-dev.sh` on
any Debian based machine (Debian, Ubuntu, Mint, etc) or use Vagrant to create
virtual machine to contain your application.

**NOTE for Vagrant**: Once the virtual machine is running you will still need
to execute `setup-dev.sh` within the virtual machine.

**NOTE for Mac**: This should on Mac as long as you have Homebrew working.

Deploying the Scaffolding
-------------------------

It is possible to just git clone or copy this repository and start customizing
and build your application. However if you want to deploy a clean copy of this
scaffolding to a new location, use `was clone TARGET` from within the your copy
of the scaffolding. See below for more details.

was Command
-----------

In the scaffolding root is a script called `was`. This is the main script to
run to execute all scaffolding actions (like `build` and `run`). The format of
the command is as follows:

    was ACTION [OPTION]...

### was build ###

Builds the application. This will create a folder called `dist` in the root of
the project containing a folder of built application and an archive of that
folder.

Options:

  - --debug: If this flag is present the CSS and Javascript will only be
    optimized slightly. No obfuscation or minification will be performed.

### was clean ###

Cleans the `build` and `dist` files out of the project.

### was deploy ###

Deploys the application into production. This is only a blank stub and would
have to be implemented for each project manually.

### was lint ###

Executes code linting scripts on the entire project (including scaffolding
files). It will avoid third party code folders.

### was run ###

Builds and runs the application locally. This is only a blank stub and would
have to be implemented for each project manually.

Options:

  - By default accepts same options as the `build` action.

### was search ###

A simple `grep` alias to search the codebase. It will avoid `build`, `dist` and
all third party code folders.

Usage: `was search SEARCHEXP`

Example: `was search foo`

### was test ###

Execute tests. This currently is a blank stub that will be expanded in future
updates. For now can be used to implement custom testing workflows.

--------------------------------------------------------------------------------

Note About Third Party Code
---------------------------

One of the fundamental aspects of this scaffolding is to isolate all third
party application code away from the rest of the source code for projects built
on this scaffolding. This helps make code isolation and usage an intrinsic part
of the software process and help identify code that may be untrusted or have
licensing issues in your project.

All third party code should be placed (unmodified) into folders named
`thirdparty` throughout the code base. The default build rules will treat this
source differently and skip steps like minification or compiling into the main
source. Use custom build rules to handle this code by placing preflight and
postflight scripts into the scaffolding workflow (see `scripts/readme.md`).

--------------------------------------------------------------------------------

Copyright (c) 2013 - 2014 Jordon Mears.

Web Application Scaffolding is made available under the MIT license.
<http://opensource.org/licenses/MIT>
