#!/bin/bash
# Setup the development environment.
#
# This script should likely work on any Linux flavor that is managed by an APT
# based package manager (should be easy to modify for other non-deb flavors)
# and Mac.
#
# To reinstall any component of these base build tools, simply remove the
# folders and download files for the given product and re-execute this script.
#
# Copyright (c) 2013 - 2014 Jordon Mears.
#
# Web Application Scaffolding is made available under the MIT license.
# <http://opensource.org/licenses/MIT>

# It is likely you could comment out these lines and install these dependencies
# manually and get this scaffolding working on non-Debian flavors of Linux.
if [ `uname` == 'Linux' ]; then
  sudo apt-get update
  sudo apt-get -y upgrade
  sudo apt-get install -y openjdk-7-jre \
    python-pip python-setuptools python-virtualenv \
    unzip
fi

# It is assumed that the user has homebrew installed along with the JDK. Mac
# already has the jre and unzip installed.
if [ `uname` == 'Darwin' ]; then
  # Check for Homebrew on Mac machines.
  command -v brew >/dev/null 2>&1 || {
    echo 2>&1 "This installation requires homebrew";
    exit 1;
  }
  brew install wget
  brew install python
  pip install virtualenv
fi

################################################################################

cd `dirname $0`
SETUP_DIR=$PWD
source ./was.cfg

mkdir -p $WAS_DEPS

PWD=`pwd`

# This WILL error on a Macintosh, it can simply be ignored.
ARCH=86
CPUINFO=`grep flags /proc/cpuinfo`
if [[ "$CPUINFO" == *" lm "* ]]; then
  ARCH=64
fi

cd $WAS_DEPS

# Install node.js
FILE="node-$NODE_VERSION-linux-x$ARCH"
if [ `uname` == 'Darwin' ]; then
  FILE="node-$NODE_VERSION-darwin-x64"
fi
if [ ! -e "$FILE.tar.gz" ]; then
  wget http://nodejs.org/dist/$NODE_VERSION/$FILE.tar.gz
  tar -xzf $FILE.tar.gz
fi

# node.js and LESS are a bit of a beast and has to bring in a lot of stuff to
# install. If this step errors you should be able to just re-execute this
# script and it will re-attempt picking up from where it left off.

# Install LESS.
INSTALLED=`$WAS_DEPS/$FILE/bin/npm list --depth=0 2>/dev/null | grep less`
if [ -z "$INSTALLED" ]; then
  $WAS_DEPS/$FILE/bin/npm install less
fi

# Install the Closure compiler.
if [ ! -e "compiler-latest.zip" ]; then
  wget http://dl.google.com/closure-compiler/compiler-latest.zip
  unzip compiler-latest.zip -d compiler-latest
fi

if [ ! -d "py" ]; then
  virtualenv py
fi

$WAS_DEPS/py/bin/pip install invoke
$WAS_DEPS/py/bin/pip install pylint

# Install gflags.
FILE="python-gflags-2.0"
if [ ! -e "$FILE.tar.gz" ]; then
  wget http://python-gflags.googlecode.com/files/$FILE.tar.gz
  tar -xzf $FILE.tar.gz
  cd $FILE
  $WAS_DEPS/py/bin/python setup.py install
  cd ..
fi

# Install Closure linter.
FILE="closure_linter-2.3.11"
if [ ! -e "$FILE.tar.gz" ]; then
  wget http://closure-linter.googlecode.com/files/$FILE.tar.gz
  tar -xzf $FILE.tar.gz
  cd $FILE
  $WAS_DEPS/py/bin/python setup.py install
  cd ..
fi
