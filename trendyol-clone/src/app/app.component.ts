import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'trendyol-clone';

  isScrolled = false; // Scroll kontrolü için değişken

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10; 
    // Eğer scroll 10px üzerindeyse navbar'a farklı class vereceğiz
  }
}
