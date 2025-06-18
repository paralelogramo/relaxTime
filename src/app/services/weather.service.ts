import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(
    private http: HttpClient
  ) {}

  getWeather(lat: number, lon: number) {
    return this.http.get(
      `${environment.weatherAPIUrl}?key=${environment.weatherAPIKey}&q=${lat},${lon}`
    );
  }

}
