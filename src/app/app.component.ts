import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { LocationService } from './services/location.service';
import { WeatherService } from './services/weather.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Howl } from 'howler';
import { RadioService } from './services/radio.service';
import { Song } from './models/song.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Time to Relax';

  weatherType = 'sunset';
  cityAndCountry = 'Unknown';
  currentTemperature = 0;

  @ViewChild('sunsetIcon') sunsetIconRef!: ElementRef;
  @ViewChild('cloudyIcon') cloudyIconRef!: ElementRef;
  @ViewChild('rainyIcon') rainyIconRef!: ElementRef;
  @ViewChild('shinyIcon') shinyIconRef!: ElementRef;

  highlightTop = 0;
  highlightLeft = 0;
  highlightWidth = 0;
  highlightHeight = 0;

  currentTimeString: string = '';
  private clockInterval: any;

  private radioPlayer: Howl;
  isRadioPlaying = false;
  radioVolume = 0.05;
  currentSong: Song = {} as Song;

  constructor(
    private cdr: ChangeDetectorRef,
    private locationService: LocationService,
    private weatherService: WeatherService,
    private radioService: RadioService,
  ){
    this.radioPlayer = new Howl({
      src: this.radioService.getRadioURL(),
      volume: this.radioVolume,
      html5: true
    });

  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateWeatherHighlight();
  }

  ngOnInit() {
    this.startClock();
    this.loadWeatherData();
    this.subscribeToCurrentSong();
  }

  ngAfterViewInit() {
    this.updateWeatherHighlight();
  }

  ngOnDestroy() {
    this.radioPlayer.stop();
    if (this.clockInterval) clearInterval(this.clockInterval);
  }

  setWeatherType(type: string) {
    this.weatherType = type;
    setTimeout(() => this.updateWeatherHighlight());
  }

  async loadWeatherData() {
    try {
      const cachedWeather = localStorage.getItem('ttr_weather');
      if (cachedWeather) {
        const { data, timestamp } = JSON.parse(cachedWeather);
        const now = Date.now();
        if (now - timestamp < 60 * 60 * 1000) {
          this.cityAndCountry = data.cityCountryName;
          this.currentTemperature = data.temperature;
          return;
        }
      }

      const { lat, lon } = await this.locationService.getCurrentPosition();
      this.weatherService.getWeather(lat, lon).subscribe({
        next: (data: any) => {
          this.cityAndCountry = `${data.location.name}, ${data.location.country}`;
          this.currentTemperature = data.current.temp_c;

          localStorage.setItem('ttr_weather', JSON.stringify({
            data: {
              cityCountryName: this.cityAndCountry,
              temperature: this.currentTemperature
            },
            timestamp: Date.now()
          }));
        },
        error: () => {}
      });
    } catch {}
  }

  updateWeatherHighlight() {
    let iconRef: ElementRef;
    switch (this.weatherType) {
      case 'sunset': iconRef = this.sunsetIconRef; break;
      case 'cloudy': iconRef = this.cloudyIconRef; break;
      case 'rainy': iconRef = this.rainyIconRef; break;
      case 'shiny': iconRef = this.shinyIconRef; break;
      default: return;
    }
    const el = iconRef.nativeElement;
    this.highlightTop = el.offsetTop;
    this.highlightLeft = el.offsetLeft;
    this.highlightWidth = el.offsetWidth;
    this.highlightHeight = el.offsetHeight;
    this.cdr.detectChanges();
  }

  private startClock() {
    this.updateCurrentTimeString();
    this.clockInterval = setInterval(() => this.updateCurrentTimeString(), 1000);
  }

  private updateCurrentTimeString() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    this.currentTimeString = `${hours}:${minutes}:${seconds}`;
  }

  toggleRadioPlayback() {
    if (this.isRadioPlaying) {
      this.isRadioPlaying = false;
      this.radioPlayer.pause();
    } else {
      this.isRadioPlaying = true;
      this.radioPlayer.play();
    }
  }

  updateRadioVolume(event: Event) {
    const target = event.target as HTMLInputElement;
    this.radioVolume = parseFloat(target.value);
    this.radioPlayer.volume(this.radioVolume);
  }

  get radioVolumeIcon(): string {
    if (this.radioVolume === 0) return '../assets/icons/mute.svg';
    if (this.radioVolume <= 0.33) return '../assets/icons/volume-0.svg';
    if (this.radioVolume <= 0.66) return '../assets/icons/volume-1.svg';
    return '../assets/icons/volume-2.svg';
  }

  subscribeToCurrentSong() {
    this.radioService.getCurrentSongData().subscribe({
      next: (data: any) => {
        this.currentSong = new Song(
          data.title,
          data.artist.name,
          data.length,
          new Date(data.started_at),
          new Date(data.ends_at),
          data.album ? data.album.title : undefined
        );
      },
      error: () => {}
    });
  }

}
