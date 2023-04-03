import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  isOpen = false;

  /**
   * Toggles the sidenav for the donor flow
   * @returns
   */
  toggleSidenav() {
    const elem = document.getElementById('slide-out-donor');
    if(elem != null) {
      const instance = M.Sidenav.init(elem);

      if(this.isOpen) {
        console.log("closing sidenav")
        //instance.close();
        this.isOpen = false;
        return;
      }
      console.log("opening sidenav");
      instance.open();
      this.isOpen = true;
    }
  }
}
