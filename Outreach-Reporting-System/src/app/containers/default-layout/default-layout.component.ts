import { Component, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from './../../_nav';
import { OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {

  currentYear: number;
  public navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
    let menuItems = [];
    navItems.forEach(menu => menuItems.push(menu));
    if (this.authService.getUserRole() == 'Admin')
      this.navItems = menuItems;
    else
      this.navItems = menuItems.splice(0, 2);
  }

  ngAfterViewInit() {
    let x = document.getElementsByTagName('header')[0].getElementsByTagName('button')[2];
    x.hidden = true;
  }


  constructor(private authService: AuthService, @Inject(DOCUMENT) _document?: any) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
