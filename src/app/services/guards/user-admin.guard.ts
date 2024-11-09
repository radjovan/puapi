import { CanActivateFn } from '@angular/router';

export const userAdminGuard: CanActivateFn = (route, state) => {
  return true;
};
