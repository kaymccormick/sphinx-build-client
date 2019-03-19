.. highlight:: js

What it is
==========

This node.js module is an interface to the Sphinx_ *Python
Documentation Generator*.  It exists primarily to service the
`grunt-sphinx-plugin` and for testing purposes. It is a very immature
module and is missing key features. It does get the job done and it
provides a Promise-based interface to sphinx-build while abstracting
away some of the interprocess communication (IPC) details.

Feedback Wanted
---------------

You may think this module is silly or that it sucks. I might
agree. But I am interested in any features or changes that make sense
especially from the perspective of experienced JS developers.

Usage
-----

General usage::

  const sphinxBuildClient = require('sphinx-build-client');

  sphinxBuildClient.sphinxBuild(sourceDir, outputDir, {
		    defineSettings: {
			master_doc: 'index',
			extensions: 'my-sphinx-extension',
		    },
		    noConfig: true,
		    builder: 'xml',
		}).then(theOutputDir => {
		/* Do something with output */
		}).catch(err => {
		/* Do something with error */
		});

sphinxBuild returns a Promise which resolves to the 'outdir' argument.

Security
--------

The usual caveats apply. Also, any conf.py file in the source
directory will be evaluated by Sphinx and can execute arbitrary code.
All input validation and sanitizing must be performed by the
caller. Caveat emptor.

Performance
-----------

From the node docs:

On UNIX-like operating systems, the child_process.spawn() method
performs memory operations synchronously before decoupling the event
loop from the child. Applications with a large memory footprint may
find frequent child_process.spawn() calls to be a bottleneck. For more
information, see V8 issue 7381_.

Full documentation_.

.. _Sphinx: http://www.sphinx-doc.org
.. _7381: https://bugs.chromium.org/p/v8/issues/detail?id=7381
.. documentation_: https://static.kaymccormick.com/docs/sphinx-build-client/
