import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FontService {
  private readonly defaultFont = 'font-tajawal';
  constructor() {
    const savedFont = localStorage.getItem('selectedFont') || this.defaultFont;
    this.applyFont(savedFont);
  }
  changeFont(fontClass: string): void {
    localStorage.setItem('selectedFont', fontClass);
    this.applyFont(fontClass);
  }
  getCurrentFont(): string {
    return localStorage.getItem('selectedFont') || this.defaultFont;
  }

  private applyFont(fontClass: string): void {
    const body = document.body;
    body.classList.remove('font-alexandria', 'font-tajawal', 'font-cairo');
    body.classList.add(fontClass);
  }
}
