# Copyright (c) 2013 - 2014 Jordon Mears.
#
# Web Application Scaffolding is made available under the MIT license.
# <http://opensource.org/licenses/MIT>
"""Linting methods for use in the scaffolding."""

import os

import invoke

from wlib import util

@invoke.task
def lessc():
  """Runs LESS CSS linter."""
  files = util.find('*.less', './src/static/css')
  if files:
    invoke.run(' '.join(['lessc', '--lint'] + files), warn=True)
  else:
    print 'No LESS files to lint.'

@invoke.task
def pylint():
  """Runs pylint across Python in the application."""
  files = util.find('*.py', exclude_paths=[
    '*/thirdparty/*',
    '*/build/*',
    '*/dist/*'
  ])
  invoke.run(' '.join([
    'pylint',
    '--msg-template=\"{C}:{line:3d},{column:2d}: {msg} ({symbol}) {path}\"',
    '--rcfile=wlib/pylint.rcfile'
  ] + files), warn=True)

@invoke.task
def gjslint():
  """Runs Closure linter across Javascript in the application."""
  if os.environ.get('WAS_JS_NAMESPACE') == '':
    print 'WARNING: Javascript application namespace is not set.'
  invoke.run(' '.join([
      'gjslint',
      '--check_html',
      '--closurized_namespaces=%s' % (os.environ.get('WAS_JS_NAMESPACE')),
      '--disable=2,6,233',
      '--jslint_error=all',
      '--recurse=src/static/js',
      '--strict',
      '--unix_mode'
    ]), warn=True)
