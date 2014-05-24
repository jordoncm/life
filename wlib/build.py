# Copyright (c) 2013 - 2014 Jordon Mears.
#
# Web Application Scaffolding is made available under the MIT license.
# <http://opensource.org/licenses/MIT>
"""Build methods for the scaffolding."""

import os
import subprocess

import invoke

def mkdir(path):
  """Create a folder at the given target."""
  try:
    os.mkdir(path)
  except OSError, e:  # pylint: disable=invalid-name
    # Don't error if the file already exists.
    if e.errno != 17:
      raise e

@invoke.task
def mkdir_build(**kwargs):  # pylint: disable=unused-argument
  """Creates the build folder."""
  mkdir(os.path.join(os.environ.get('WAS_BUILD_BASE'), 'build'))

@invoke.task
def mkdir_dist(**kwargs):  # pylint: disable=unused-argument
  """Creates the build folder."""
  mkdir(os.path.join(os.environ.get('WAS_BUILD_BASE'), 'dist'))

@invoke.task
def collect_dist(**kwargs):  # pylint: disable=unused-argument
  """Collects artifacts out of src and build and places them in dist."""
  base = os.environ.get('WAS_BUILD_BASE')
  # This is a little wasteful but works fine.
  invoke.run('cp -r src ' + base + '/dist/default')
  invoke.run('rm -rf ' + base + '/dist/default/static/css')
  invoke.run('rm -rf ' + base + '/dist/default/static/js')
  invoke.run('rm -rf ' + base + '/dist/default/static/thirdparty/externs')
  invoke.run('cp -r ' + base + '/build/css ' + base + '/dist/default/static/')
  invoke.run('cp -r ' + base + '/build/js ' + base + '/dist/default/static/')
  invoke.run(' '.join([
    'find ' + base + '/dist/default/.',
    '-name "readme.md"',
    '-and -not -path "*/thirdparty/*"',
    '| xargs rm'
  ]))

@invoke.task
def lessc(debug=False):
  """Builds LESS files into compiled CSS."""
  base = os.environ.get('WAS_BUILD_BASE')
  src_folder = 'src/static/css'
  targets = os.listdir(src_folder)
  build_folder = os.path.join(base, 'build/css')
  os.mkdir(build_folder)
  for target in targets:
    src = os.path.join(src_folder, target)
    if os.path.isfile(src):
      dest = os.path.join(build_folder, target.replace('.less', '.css'))
      # Process both LESS and CSS files. CSS files will at least benefit from
      # minification.
      if target.endswith('.less') or target.endswith('.css'):
        if debug:
          subprocess.call(['lessc', src, dest])
        else:
          subprocess.call(['lessc', '--clean-css', src, dest])

@invoke.task
def javascript(debug=False):
  """Compiles Javascript."""
  base = os.environ.get('WAS_BUILD_BASE')
  deps = os.environ.get('WAS_DEPS')
  src_folder = 'src/static/js'
  targets = os.listdir(src_folder)
  build_folder = os.path.join(base, 'build/js')
  os.mkdir(build_folder)

  extra_args = []

  optimization_level = 'ADVANCED_OPTIMIZATIONS'
  if debug:
    optimization_level = 'SIMPLE_OPTIMIZATIONS'
    extra_args.append('--formatting')
    extra_args.append('PRETTY_PRINT')
    extra_args.append('--define=\'__DEBUG__=true\'')

  externs = recurse_build_args(
    'src/static/thirdparty/externs',
    '--externs'
  )
  externs = externs + recurse_build_args(
    os.path.join(src_folder, 'externs'),
    '--externs'
  )
  js_args = recurse_build_args(os.path.join(src_folder, 'lib'))

  for target in targets:
    src = os.path.join(src_folder, target)
    is_file = os.path.isfile(src)
    if is_file and target.endswith('.js') and target != 'typedefs.js':
      dest = os.path.join(build_folder, target)
      command = [
        'java', '-jar', os.path.join(deps, 'compiler-latest/compiler.jar'),
        '--compilation_level', optimization_level,
        '--manage_closure_dependencies',
        '--process_closure_primitives',
        '--js', 'src/static/js/typedefs.js',
        '--js', src,
        '--js_output_file', dest
      ] + extra_args + externs + js_args
      subprocess.call(command)

def recurse_build_args(base_path, arg_name='--js'):
  """Recurses a directory structure generating a list of Closure arguments."""
  args = []
  files = os.listdir(base_path)
  for filename in files:
    path = os.path.join(base_path, filename)
    if os.path.isdir(path):
      args = args + recurse_build_args(path, arg_name)
    elif os.path.isfile(path) and filename.endswith('.js'):
      args.append(arg_name)
      args.append(path)

  return args
