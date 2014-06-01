Life
====

Life is a CouchApp that deploys to CouchDB and allows users to define simple
Javascript document structures (apps) and manage documents based on these
structures in a easy to use web interface.

Core Features
-------------

**Client side encryption.**

Life supports AES encryption on any document property and the encryption is
handled on the CLIENT side. This means the decryption key stays with the user
and is never shared out.

**Distributed by default.**

Being deployed on CouchDB gives you the great replication and syncing
capabilities of CouchDB out of the box. This means you can run the Life
application and your document store on many devices and sync as needed.

**Document templates are apps.**

A document structure definition defines how various documents are structured
and grouped. These structures can be thought of as a model definition in
programming terms. The web interface treats these these structures (or
templates) as the mode of the interface, colloquially know as an app.

**Markdown support.**

Document properties that are defined as rich text support Markdown syntax.

**Non-destructive document updates.**

Documents created or edited in Life will only modify the properties within the
documents template. This means you can freely add and remove other parts of the
document inside of CouchDB's Futon or any other application.

**Tagging**

All documents support tagging for easy filtering of documents.

Default Apps
------------

Right now there are a handful default applications that come with Life out of
the box. They include:

  - **Notes**: A simple note taking application.
  - **Passwords**: A simple password manager.
  - **Links**: A simple link manager.

NOTE: Also for now in order to add new apps you have to add their definitions
in the Javascript.

Near Term Goals
---------------

Life so far is just a simple web applications, but I have big plans. Some of
which are listed here.

  - Document templates stored in the database.
  - PouchDB based mobile application.
  - Database syncing user interface.
  - Support for document attachments.

Deploying
---------

Deploying Life is not straightforward at the moment, but the basic process is:

  1. Install and configure CouchDB wherever you intend to deploy to.
  2. Create a database for Life in your CouchDB instance.
  3. Install [Erica](https://github.com/benoitc/erica).
  4. Run `./setup-dev.sh`.
  5. Edit `tasks.py` and set the URL for your CouchDB instance (around line 47).
  6. Run `./was deploy`.

Life should be installed and accessible by loading the design document. On an
unconfigured local installation of CouchDB this URL would be:

    http://localhost:5984/life/_design/static/_rewrite/

Developing
----------

Life uses Less.js and Closure Compiler to build the source into a deployable
CouchApp.

To develop

--------------------------------------------------------------------------------

Copyright (c) 2014 Jordon Mears.

Web Application Scaffolding is made available under the MIT license.
<http://opensource.org/licenses/MIT>
