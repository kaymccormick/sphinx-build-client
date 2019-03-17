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
    const tailArgs = []
    if(options.forceAll) {
	args.push('-a');
    } else {
	/*  parser.add_argument('filenames', nargs='*', help=__('a list of specific files to rebuild. Ignored ' 'if -a is specified')) */
	if(options.filenames) {
	    tailArgs.push(options.filenames);
	}
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
    if(options.warningIsError) {
	args.push('-W');
    }

    if(options.htmlDefine) {
	for(let entry of Object.entries(options.htmlDefine)) {
	    args.push('-A', entry[0]+'='+entry[1]);
	}
    }
    if(options.defineTag) {
	var tags = [].push(options.defineTag);
	args.push(tags.flatMap(tag => ['-t', tag]));
    }
    if(options.nitpicky) {
	args.push('-n');
    }
    if(options.verbose) {
	args.push('-v');
    }
    if(options.quiet) {
	args.push('-q');
    }
    if(options.reallyQuiet) {
	args.push('-Q');
    }
    if(options.color) {
	args.push('--color');
    }
    if(options.color === false) {
	args.push('-N');
    }
    if(options.warnFile) {
	args.push('-w', options.warnFile);
    }
    if(options.warningIsError) {
	args.push('-W');
    }
    if(options.keepGoing) {
	args.push('--keep-going');
    }
    if(options.traceback) {
	args.push('-T');
    }
    if(options.pdb) {
	args.push('-P');
    }
    args.push(...tailArgs);
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
	childProc.on('error', (err) => {
	    console.log(`Error failure to start subprocess: ${err}`);
	    reject(err);
	});
	childProc.on('close', (code) => {
	    if(code) {
		reject(`child process exited with code ${code}`);
	    } else {
		resolve(outdir);
	    }
	});
    });
};

