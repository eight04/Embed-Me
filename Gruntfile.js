/* eslint strict: 0 */
/* globals module */

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			js: {
				src: ["embed-me.user.js", "modules/*.js"],
				dest: "dist/embed-me.user.js"
			}
		},
		watch: {
			grunt: {
				files: ["Gruntfile.js"]
			},
			js: {
				files: ["*.js", "modules/*.js"],
				tasks: ["default"]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask("default", ["concat"]);

};
