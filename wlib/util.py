# Copyright (c) 2013 - 2014 Jordon Mears.
#
# Web Application Scaffolding is made available under the MIT license.
# <http://opensource.org/licenses/MIT>
"""Utility methods for the task library."""

import subprocess

def find(name, path='.', exclude_paths=None):
  """Uses the find command to build a file list."""
  if exclude_paths is None:
    exclude_paths = []
  result = subprocess.check_output(' '.join([
    'find %s -name "%s"' % (path, name),
  ] + ['-and -not -path "%s"' % i for i in exclude_paths]), shell=True)
  if result:
    return result.split()
  else:
    return []
