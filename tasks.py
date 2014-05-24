# Copyright (c) 2013 - 2014 Jordon Mears.
#
# Web Application Scaffolding is made available under the MIT license.
# <http://opensource.org/licenses/MIT>
"""Primary tasks for the scaffolding."""

import os

import invoke

from wlib import build
from wlib import clean
from wlib import lint

@invoke.task(
  'was.clean.build',
  'was.clean.dist',
  'was.build.mkdir_build',
  'was.build.lessc',
  'was.build.javascript',
  'was.build.mkdir_dist',
  'was.build.collect_dist'
)
def was_build(debug=False):  # pylint: disable=unused-argument
  """Executes a build."""
  pass

@invoke.task('was.clean.build', 'was.clean.dist')
def was_clean(**kwargs):  # pylint: disable=unused-argument
  """Cleans the build."""
  pass

@invoke.task(
  'was.clean.build',
  'was.clean.dist',
  'was.build.mkdir_build',
  'was.build.lessc',
  'was.build.javascript',
  'was.build.mkdir_dist',
  'was.build.collect_dist'
)
def was_deploy(debug=False):  # pylint: disable=unused-argument
  """Deploys the application."""
  invoke.run(' '.join([
    'cd ' + os.environ.get('WAS_BUILD_BASE') + '/dist/default/static',
    '&&',
    'erica push http://life.wm.m:5984/life'
  ]))

@invoke.task('was.lint.pylint', 'was.lint.lessc', 'was.lint.gjslint')
def was_lint():
  """Runs lint against the codebase."""
  pass

@invoke.task(
  'was.clean.build',
  'was.clean.dist',
  'was.build.mkdir_build',
  'was.build.lessc',
  'was.build.javascript',
  'was.build.mkdir_dist',
  'was.build.collect_dist'
)
def was_run(debug=False):  # pylint: disable=unused-argument
  """Runs the application."""
  pass

@invoke.task
def was_search(needle):
  """Searches the codebase excluding third party and build folders."""
  invoke.run(' '.join([
    'grep',
    '-rni',
    '--exclude-dir=thirdparty',
    '--exclude-dir=build',
    '--exclude-dir=dist',
    '--exclude-dir=.git',
    '--color=always',
    needle,
    '.'
  ]))

@invoke.task(
  'was.clean.build',
  'was.clean.dist',
  'was.build.mkdir_build',
  'was.build.lessc',
  'was.build.javascript',
  'was.build.mkdir_dist',
  'was.build.collect_dist'
)
def was_test(debug=False):  # pylint: disable=unused-argument
  """Executes tests."""
  pass

# pylint: disable=invalid-name

lib = invoke.Collection('was')
lib.add_collection(build)
lib.add_collection(clean)
lib.add_collection(lint)

namespace = invoke.Collection()
namespace.add_collection(lib)
namespace.add_task(was_build, 'build')
namespace.add_task(was_clean, 'clean')
namespace.add_task(was_deploy, 'deploy')
namespace.add_task(was_lint, 'lint')
namespace.add_task(was_run, 'run')
namespace.add_task(was_search, 'search')
namespace.add_task(was_test, 'test')
