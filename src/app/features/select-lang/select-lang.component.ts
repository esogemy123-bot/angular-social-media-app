import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from '../../core/services/my-translate.service';

@Component({
  selector: 'app-select-lang',
  imports: [TranslatePipe],
  templateUrl: './select-lang.component.html',
  styleUrl: './select-lang.component.css',
})
export class SelectLangComponent {
  public translate = inject(TranslateService);
  langs: string[] = [];
  isListOpen: boolean = false;
  private myTranslateService = inject(MyTranslateService);
  currentLang: string = this.translate.getCurrentLang();
  changeLang(lang: string): void {
    this.myTranslateService.changeLang(lang);
    this.currentLang = this.translate.getCurrentLang();
    this.closeList();
  }
  toggleList() {
    this.isListOpen = !this.isListOpen;
  }
  closeList() {
    this.isListOpen = false;
  }
}
