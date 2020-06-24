import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app-c';
  childApp = {
    sendHeight: function () {
      var that = this;
      var body = document.body, html = document.documentElement;

      /*
      var height = Math.max( body.scrollHeight, body.offsetHeight, 
          html.clientHeight, html.scrollHeight, html.offsetHeight );
      console.debug('heights', body.scrollHeight, body.offsetHeight, 
      html.clientHeight, html.scrollHeight, html.offsetHeight);
      */

      //var height = html.offsetHeight;
      var height = 500;
      parent.postMessage({ message: 'set-height', appPath: that.childConfig.appId, height: height }, '*');
    },
    config: function (config) {
      this.childConfig = config;
    },
    sendRoute: function (url) {
      parent.postMessage({ message: 'routed', appPath: this.childConfig.appId, route: url }, '*');
    },
    registerForRouteChange: function (callback) {
      window.addEventListener('message', (e) => {
        if (e.data && e.data.message === 'sub-route') {
          callback(e.data.route);
        }
      }, true);
    },
    init: function () {
      if (!parent) return;
      window.addEventListener('load', this.sendHeight.bind(this), true);
      window.addEventListener('resize', this.sendHeight.bind(this), true);
    }
  }

  constructor(private router: Router) {
    this.initChildRouter();
  }
    ngOnInit(): void {
      this.childApp.config({ appId: 'a' });
      this.childApp.init();
    }

  // Sync Subroutes
  initChildRouter() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      this.childApp.sendRoute(e.url);
    });

    this.childApp.registerForRouteChange(url => this.router.navigateByUrl(url));
  }

}
