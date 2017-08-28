import hello from 'hellojs';

/**
 * This service emulates an Authentication Service.
 */
export default class AuthService {
  constructor($rootScope) {
    this.$inject = ['$rootScope'];
    this.$rootScope = $rootScope;
    this.user = null;

    hello.init({
      // facebook: FACEBOOK_CLIENT_ID,
      // windows: WINDOWS_CLIENT_ID,
      // google:  'AIzaSyAPgAkZ7_xKEiM4kEErtN6zWVt-XKL30uI'
      google: '785009904705-65k7sf0dk54uetqs90p7gvn59on8288u.apps.googleusercontent.com',
    }, {
      redirect_uri: 'statics/redirect.html',
      scope: 'email',
      force: true // not clear what it does (insist on scope?)
    });

    hello.on('auth.login', (auth) => {
      console.log('auth', auth);
      this.user = {
        access_token: auth.authResponse.access_token
      };

      hello('google').api('me').then((data) => {
        $rootScope.$apply(() => {
          this.user.email = data.email;
          this.user.thumbnail = data.thumbnail;
        });
      }), function(e) {
    	   alert('api me error: ' + e.error.message);
      };
    });
  }

  /**
   * Returns true if the user is currently authenticated, else false
   */
  isAuthenticated() {
    var currentTime = (new Date()).getTime() / 1000;
    var session = hello('google').getAuthResponse();
    console.log('session:', session);
    console.log('isLoggedIn', session && session.access_token && session.expires > currentTime);
    return !!(session && session.access_toke && session.expires > currentTime);
  }

  /**
   * Fake authentication function that returns a promise that is either resolved or rejected.
   *
   * Given a username and password, checks that the username matches one of the known
   * usernames (this.usernames), and that the password matches 'password'.
   *
   * Delays 800ms to simulate an async REST API delay.
   */
  login() {
    return hello('google').login().then((data) => {
      console.log("in login chain", data);
    });
  }

  /** Logs the current user out */
  logout() {
    hello('google').logout().then(() => {
  	   console.log('signed out');
       this.user = null;
    }, function(e) {
  	   alert('Signed out error: ' + e.error.message);
    });
  }
}
