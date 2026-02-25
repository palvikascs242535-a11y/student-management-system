import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const loggedIn = localStorage.getItem('loggedIn');

  if (loggedIn !== 'true') {
    alert("Please login first");
    window.location.href = '/';
    return false;
  }

  return true;
};