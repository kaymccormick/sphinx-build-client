module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	sphinxBuild: {
	    xmlDoc: {
		options: {
		    sourceRoot: 'doc',
		    destDir: 'doc-build/xml',
		    builder: 'xml'
		}
	    },
	    htmlDoc: {
		options: {
		    sourceRoot: 'doc',
		    destDir: 'doc-build/html',
		    builder: 'html'
		}
	    }
	},
    });

    grunt.loadNpmTasks('grunt-sphinx-plugin');
    grunt.registerTask('default', ['sphinxBuild:htmlDoc']);
};

