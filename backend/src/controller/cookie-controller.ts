import Cookies from 'universal-cookie';

export function createCookie (key, value) {
  const cookies = new Cookies();
  cookies.set(key, value, { path: '/' });
}

export function removeCookie (key) {
  const cookies = new Cookies();
  cookies.remove(key);
}

export function changeCookie (key, value) {
  removeCookie(key);
  createCookie(key, value);
}
