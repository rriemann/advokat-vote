// from https://web-und-die-welt.de/web/authentifizierung-vue-app/

import router from '../router'
// import { API_ENDPOINT } from '@/constants/api.js'

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

export function login(redirect) {
  hello.login('google', {}, function() {
    var session = hello('google').getAuthResponse();
    console.log('session:', session);
  });
}

export function logout() {
  hello('google').logout().then(function() {
	   router.go('/');
  }, function(e) {
     console.log('Signed out error: ', e.error.message);
	   alert('Signed out error: ' + e.error.message);
  });
}

export function isLoggedIn() {
  // from https://adodson.com/hello.js/#hellogetauthresponse
  var currentTime = (new Date()).getTime() / 1000;
  var session = hello('google').getAuthResponse();
  console.log('session:', session);
  console.log('isLoggedIn', session && session.access_token && session.expires > currentTime);
  return !!session && session.access_toke && session.expires > currentTime;
}

export function requireAuth(to, from, next) {
  if (!isLoggedIn()) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
}

export function getAccessToken() {
  var session = hello('google').getAuthResponse();
  return session && session.access_token;
}
