import { Injectable } from '@angular/core';
import { KeycloakService } from "keycloak-angular";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private keycloakService: KeycloakService) { }

  getRoles() {
    return this.keycloakService.getUserRoles();
  }

  isAdmin() {
    let roles =  this.getRoles().filter(rol => rol == "admin");
    return roles.length > 0;
  }
}
