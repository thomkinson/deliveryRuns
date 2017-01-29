module.exports = function() {
  var client = './src/client/';
  var lib = client + 'lib/';

  var config = {
    /**
     * File paths
     */
    // all javascript that we want to vet
    client: client,
    lib: lib,
    // app js, with no specs
    source: 'src/',
    sass:"./bower_components/bootstrap/scss/bootstrap.scss",
    /**
     * browser sync
     */
    browserReloadDelay: 1000,
  }

  return config;

  ////////////////

};
