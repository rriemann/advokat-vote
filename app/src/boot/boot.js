import angular from 'angular';

import app from 'src/app';

/**
 * Manually bootstrap the application when AngularJS and
 * the application classes have been loaded.
 */
angular
  .element( document )
  .ready( function() {
    angular
      .module( 'advokat-bootstrap', [ app.name ] )
      .run(()=>{
        console.log(`Running the 'advokat-app-bootstrap' ES6 Material-Start Tutorial`);
      });

    let body = document.getElementsByTagName("body")[0];
    angular.bootstrap( body, [ 'advokat-bootstrap' ]);
  });
