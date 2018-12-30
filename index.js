const util = require('util');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const stat = util.promisify(fs.stat);

// this only checks for existence so is of limited value.
function sanityCheckConfPy(srcdir, outdir, options) {
    return stat(path.join(srcdir, 'conf.py')).then(s => {
	if(!s.isFile()) {
	    throw new Error('conf.py is not a file');
	}
    });
}

function buildOptions(srcdir, outdir, options) {
    const args = []
    if(options.forceAll) {
	args.push('-a');
    }
    if(options.builder) {
	args.push('-b', options.builder);
    }
    if(options.freshEnv) {
	args.push('-E');
    }
    if(options.doctreeDir) {
	args.push('-d', options.doctreeDir);
    }
    if(options.jobs) {
	args.push('-j', `${options.jobs}`);
    }
    if(options.confDir) {
	args.push('-c', options.confDir);
    }
    if(options.noConfig) {
	args.push('-C');
    }
    if(options.defineSettings) {
	for(let entry of Object.entries(options.defineSettings)) {
	    args.push('-D', entry[0]+'='+entry[1]);
	}
    }
    /*
      group.add_argument('-A', metavar='name=value', action='append',
      dest='htmldefine', default=[],
      help=__('pass a value into HTML templates'))
      group.add_argument('-t', metavar='TAG', action='append',
      dest='tags', default=[],
      help=__('define tag: include "only" blocks with TAG'))
      group.add_argument('-n', action='store_true', dest='nitpicky',
      help=__('nit-picky mode, warn about all missing '
      'references'))

      group = parser.add_argument_group(__('console output options'))
      group.add_argument('-v', action='count', dest='verbosity', default=0,
      help=__('increase verbosity (can be repeated)'))
      group.add_argument('-q', action='store_true', dest='quiet',
      help=__('no output on stdout, just warnings on stderr'))
      group.add_argument('-Q', action='store_true', dest='really_quiet',
      help=__('no output at all, not even warnings'))
      group.add_argument('--color', action='store_const', const='yes',
      default='auto',
      help=__('do emit colored output (default: auto-detect)'))
      group.add_argument('-N', '--no-color', dest='color', action='store_const',
      const='no',
      help=__('do not emit colored output (default: '
      'auto-detect)'))
      group.add_argument('-w', metavar='FILE', dest='warnfile',
      help=__('write warnings (and errors) to given file'))
      group.add_argument('-W', action='store_true', dest='warningiserror',
      help=__('turn warnings into errors'))
      group.add_argument('--keep-going', action='store_true', dest='keep_going',
      help=__("With -W, Keep going when getting warnings"))
      group.add_argument('-T', action='store_true', dest='traceback',
      help=__('show full traceback on exception'))
      group.add_argument('-P', action='store_true', dest='pdb',
      help=__('run Pdb on exception'))

    */
    return args;
}

exports.buildOptions = buildOptions;
exports.sphinxBuild = function(srcdir, outdir, options) {
//    return sanityCheckConfPy(srcdir, outdir, options).then(() => {
	return new Promise((resolve, reject) => {
	    const opts = buildOptions(srcdir, outdir, options);
	    const args = [...opts, srcdir, outdir]
/*
	    console.log(`final args : ${args}`);
*/
	    const childProc = spawn('sphinx-build', [...opts, srcdir, outdir]);
/*
	    childProc.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	    });
*/
	    childProc.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
	    });
	    childProc.on('close', (code) => {
		if(code) {
		    reject(`child process exited with code ${code}`);
		} else {
		    resolve(outdir);
		}
	    });
	});
//    });
};
