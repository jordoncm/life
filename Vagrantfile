# This is a simple Vagrant configuration to run the scaffolding within (if you
# choose to do so).
#
# Copyright (c) 2013 Jordon Mears.
#
# Web Application Scaffolding is made available under the MIT license.
# <http://opensource.org/licenses/MIT>

Vagrant::Config.run do |config|
  # You can replace this box with any deb based box you may have around (i.e.
  # Debian, Ubuntu, Mint, etc).
  config.vm.box = 'ubuntu-12.04-amd64'

  # The url from where the 'config.vm.box' box will be fetched if it doesn't
  # already exist on the user's system.
  config.vm.box_url = [
    'http://cloud-images.ubuntu.com',
    'vagrant/precise/current',
    'precise-server-cloudimg-amd64-vagrant-disk1.box'
  ].join('/')

  # This makes symlinks in the shared /vagrant folder work correctly on
  # VirtualBox. In general avoid symlinks in code as they do not work right in
  # Windows hosts.
  config.vm.customize [
    'setextradata',
    :id,
    'VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root',
    '1'
  ]

  # This causes VirtualBox to proxy DNS into the VM otherwise lookups will
  # fail.
  config.vm.customize ['modifyvm', :id, '--natdnshostresolver1', 'on']

  # RAM for the VM.
  config.vm.customize ['modifyvm', :id, '--memory', 2048]

  # List of ports to forward to the host.
  # config.vm.forward_port 5000, 5000

  # Execute a script to configure build environment.
  # NOTE: This is currently disabled as I have been having issues with vagrant
  # up exiting cleaning after running a shell script. Run this manually to
  # install the base environment (this only needs ran once).
  # config.vm.provision :shell, :path => 'setup-dev.sh'
end
