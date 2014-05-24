# Copyright (c) 2013 - 2014 Jordon Mears.
#
# Web Application Scaffolding is made available under the MIT license.
# <http://opensource.org/licenses/MIT>
"""Clean methods for use in the scaffolding."""

import os
import shutil

import invoke

@invoke.task
def build(**kwargs):  # pylint: disable=unused-argument
  """Removes and replaces the build folder."""
  path = os.path.join(os.environ.get('WAS_BUILD_BASE'), 'build')
  if os.path.isdir(path):
    shutil.rmtree(path)

@invoke.task
def dist(**kwargs):  # pylint: disable=unused-argument
  """Removes and replaces the dist folder."""
  path = os.path.join(os.environ.get('WAS_BUILD_BASE'), 'dist')
  if os.path.isdir(path):
    shutil.rmtree(path)
