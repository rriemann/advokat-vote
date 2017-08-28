import sha256 from 'crypto-js/sha256';
import hex from 'crypto-js/enc-hex';


export function hash(json) {
  let string = JSON.stringify(json);
  return hex.stringify(sha256(string));
}

// from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
/*
export async function hash2(json) {
  var string = JSON.stringify(json);
  const msgBuffer = new TextEncoder('utf-8').encode(message);                     // encode as UTF-8
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);            // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                       // convert ArrayBuffer to Array
  const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join(''); // convert bytes to hex string
  return hashHex;
}
*/
