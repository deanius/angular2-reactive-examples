import {URLSearchParams} from 'angular2/http';

export function toParamsString(params: any) {
  let urlSearchParams = new URLSearchParams();
  for (let key in params) {
    urlSearchParams.append(key, params[key]);
  };
  return urlSearchParams.toString();
}
