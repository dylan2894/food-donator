import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  /**
   * Toggles the sidenav for the donor flow
   */
  toggleSidenav(isDonor: boolean): void {
    let elem;
    if(isDonor) {
      elem = document.getElementById('slide-out-donor');
    } else {
      elem = document.getElementById('slide-out-donee');
    }

    if(elem != null) {
      const instance = M.Sidenav.init(elem);

      if(instance.isOpen) {
        instance.close();
        return;
      }
      instance.open();
    }
  }

  /**
   * Clears the darkened overlay which is visible when the sidenav is open
   */
  clearOverlay(): void {
    $(".sidenav-overlay").trigger("click");
  }
}
