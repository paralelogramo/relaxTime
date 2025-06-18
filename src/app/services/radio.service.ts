import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RadioService {

  constructor(
      private http: HttpClient
    ) {}

  getRadioURL(): string {
    return environment.radioAPIUrl;
  }

  getCurrentSongData() {
    return this.http.get(environment.radioCurrentSongAPIUrl);
  }
}
