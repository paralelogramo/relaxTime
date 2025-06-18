import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'relaxTime';
  weatherType = 'sunset';
  @ViewChild('sunsetIcon') sunsetIconRef!: ElementRef;
  @ViewChild('cloudyIcon') cloudyIconRef!: ElementRef;
  @ViewChild('rainyIcon') rainyIconRef!: ElementRef;
  @ViewChild('shinyIcon') shinyIconRef!: ElementRef;

  highlightTop = 0;
  highlightLeft = 0;
  highlightWidth = 0;
  highlightHeight = 0;
  setWeatherType(type: string) {
    this.weatherType = type;
    setTimeout(() => this.updateWeatherHighlight());
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
}
