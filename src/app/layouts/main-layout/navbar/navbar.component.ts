import { FontService } from './../../../core/services/font.service';
import { user } from './../../../core/models/post.interface';
import { Component, inject, OnInit, afterNextRender } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'; // 👈 ضفنا NgClass عشان الـ HTML الجديد يشتغل بسلاسة
import { AuthService } from '../../../core/auth/services/auth.service';
import { UsersService } from '../../../core/services/users.service';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectLangComponent } from '../../../features/select-lang/select-lang.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, SelectLangComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  profile!: user;
  private readonly authService = inject(AuthService);
  private readonly usersService = inject(UsersService);
  public readonly fontService = inject(FontService);

  isDark: boolean = false;
  selectedThemeColor: string = 'greenEmerald';
  selectedColor: string = '';
  body: HTMLElement | null = null;
  isMenuOpen = false;
  currentLang: string | null = localStorage.getItem('lang');

  toggleMenu() {
    this.isMenuOpen = true;
  }

  closeMenu() {
    this.currentLang = localStorage.getItem('lang');
    this.isMenuOpen = false;
  }

  constructor() {
    afterNextRender(() => {
      this.body = document.querySelector('body');
      this.setPrevMood();
      this.setPrevColors();
    });
  }

  logOut(): void {
    this.authService.signOut();
  }

  ngOnInit(): void {
    this.getProfilePhoto();
  }

  getProfilePhoto() {
    this.authService.getMyProfile().subscribe({
      next: (res) => {
        this.profile = res.data.user;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  themeColors = [
    { name: 'purpleBlue', value1: ' #6366f1', value2: ' #8b5cf6', value3: ' #4b48ec' },
    {
      name: 'pinkOrange',
      value1: 'var(--color-orange-400 )',
      value2: 'var(--color-orange-500 )',
      value3: 'var(--color-amber-500 )',
    },
    {
      name: 'greenEmerald',
      value1: 'var(--color-green-400 )',
      value2: 'var(--color-green-500 )',
      value3: 'var(--color-emerald-400 )',
    },
    {
      name: 'blueCian',
      value1: 'var(--color-blue-400 )',
      value2: 'var( --color-blue-500 )',
      value3: 'var(--color-indigo-400 )',
    },
    {
      name: 'redRose',
      value1: 'var(--color-red-400 )',
      value2: 'var(--color-red-500 )',
      value3: 'var(--color-red-600 )',
    },
    {
      name: 'amberOrange',
      value1: 'var(--color-yellow-500 )',
      value2: 'var(--color-yellow-400 )',
      value3: 'var(--color-yellow-500 )',
    },
  ];

  playDarkMood() {
    this.body?.classList.add('dark');
    this.isDark = true;
    localStorage.setItem('isDark', JSON.stringify(this.isDark));
    this.closeMenu();
  }

  stopDarkMood() {
    this.body?.classList.remove('dark');
    this.isDark = false;
    localStorage.setItem('isDark', JSON.stringify(this.isDark));
    this.closeMenu();
  }

  setColorProperty(selectedColor: string) {
    if (!selectedColor) return;

    for (var j = 0; j < this.themeColors.length; j++) {
      if (this.themeColors[j].name === selectedColor) {
        document.documentElement.style.setProperty('--color-primary', this.themeColors[j].value1);
        document.documentElement.style.setProperty('--via-secondary', this.themeColors[j].value2);
        document.documentElement.style.setProperty('--color-secondary', this.themeColors[j].value2);
        document.documentElement.style.setProperty('--color-accent', this.themeColors[j].value3);
        break;
      }
    }
    localStorage.setItem('selectedThemeColor', JSON.stringify(selectedColor));
  }

  setPrevMood() {
    const savedDark = localStorage.getItem('isDark');
    if (savedDark !== null) {
      this.isDark = JSON.parse(savedDark);
      if (this.isDark) this.playDarkMood();
      else this.stopDarkMood();
    }
  }

  setPrevColors() {
    const savedColor = localStorage.getItem('selectedThemeColor');
    if (savedColor !== null) {
      this.selectedThemeColor = JSON.parse(savedColor);
      this.selectedColor = this.selectedThemeColor;
      this.setColorProperty(this.selectedThemeColor);
    }
  }

  setAppFont(fontClass: string) {
    this.fontService.changeFont(fontClass);
    this.closeMenu();
  }
}
