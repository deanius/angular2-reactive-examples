import {Component} from 'angular2/core';
import {Control, ControlGroup} from 'angular2/common';
import {Http, Response} from 'angular2/http';
import {toParamsString} from './toParamsString';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import * as _ from 'lodash';

@Component({
  selector: 'pagination',
  template: require('./github-search.html'),
  providers: [],
  directives: [],
  pipes: []
})
export class GithubSearch {

  searchForm: ControlGroup;
  page: Control = new Control(1);
  pageValues: number[];
  perPage: Control = new Control(10);
  perPageValues: number[] = [10, 30, 50, 100];
  searchTerm$: Subject<string> = new Subject();
  params$: Observable<any>;
  results$: Observable<any>;
  loading: boolean;
  totalCount$: Observable<any>;
  items: any[];
  totalCount: number;
  error: any;

  constructor(public http: Http) {
    this.searchForm = new ControlGroup({
      term: new Control('ng2')
    });
  }

  ngOnInit() {
    this.params$ = this.searchTerm$.startWith(this.searchForm.controls['term'].value)
      .combineLatest(
        this.page.valueChanges.startWith(this.page.value),
        this.perPage.valueChanges.startWith(this.perPage.value),
        (q: string, page: number, per_page: number) => {
          return {q, page, per_page};
        }
      );

    this.results$ = this.params$
      .switchMap((params: any) => {
        if (!params.q) {
          return Observable.of({items: [], totalCount: 0});
        } else {
          this.loading = true;
          return this.http
            .get('https://api.github.com/search/repositories?' + toParamsString(params))
            .map((res: Response) => res.json())
            .catch((res: Response) => {
              return Observable.of({items: [], totalCount: 0, error: res.json()});
            })
            .finally(() => {
              this.loading = false;
            });
        }
      })
      .share();

    this.results$
      .subscribe((res: any) => {
        this.items = res.items;
        this.totalCount = res.total_count;
        this.error = res.error;
      });

    this.totalCount$ = this.results$
      .map((res: any) => res.total_count);

    this.totalCount$
      .combineLatest(
        Observable.of(this.perPage.value).concat(this.perPage.valueChanges.map((value: string) => parseInt(value, 10))),
        (totalCount: number, perPage: number) => {
          return _.times((totalCount + perPage - 1) / perPage).map((n: number) => n + 1);
        }
      )
      .subscribe((pageValues: number[]) => this.pageValues = pageValues);

    this.perPage.valueChanges
      .subscribe(() => {
        this.page.updateValue(1, {});
      });
  }

  onSearch() {
    this.searchTerm$.next(this.searchForm.value.term);
  }
}
