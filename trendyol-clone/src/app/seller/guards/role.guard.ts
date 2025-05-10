import {
  CanActivateFn,
  CanLoadFn,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

function checkRole(requiredRole: string): boolean {
  const auth = inject(AuthService);
  const router = inject(Router);

  const loggedIn = auth.isLoggedIn();
  const roles = auth.getUserRoles();
  console.log('[roleGuard] loggedIn:', loggedIn, 'roles:', roles, 'required:', requiredRole);

  if (!loggedIn) {
    router.navigate(['/login']);
    return false;
  }
  const ok =
    roles.includes(requiredRole) ||
    roles.includes(`ROLE_${requiredRole}`);
  if (!ok) {
    router.navigate(['/']);
  }
  console.log('[roleGuard] OK?', ok);
  return ok;
}

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  console.log('[roleGuard] trying to activate', state.url);
  const required = route.data['role'] as string;
  return checkRole(required);
};

export const roleLoadGuard: CanLoadFn = (route: Route, segments: UrlSegment[]) => {
  console.log('[roleLoadGuard] trying to load', route.path);
  const required = route.data?.['role'] as string;
  return checkRole(required);
};
