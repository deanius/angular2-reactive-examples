require('bootstrap/dist/css/bootstrap.css');
require('./app.css');

import {Component} from 'angular2/core';
import {RouteConfig, Router} from 'angular2/router';

import {GithubSearch} from './github-search/github-search';

@Component({
  selector: 'app',
  pipes: [ ],
  providers: [ ],
  directives: [ ],
  styles: [ ],
  template: require('./app.html')
})
@RouteConfig([
  { path: '/', name: 'GithubSearch', component: GithubSearch, useAsDefault: true }
])
export class App {}
