import { Component, signal, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faTimes, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../../../services/theme.service';

interface NavLink {
  path: string;
  label: string;
}

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './navigation.html',
  host: {
    '[class]': '"w-full"'
  }
})
export class Navigation {
  private readonly themeService = inject(ThemeService);

  protected readonly faBars = faBars;
  protected readonly faTimes = faTimes;
  protected readonly faMoon = faMoon;
  protected readonly faSun = faSun;

  protected readonly mobileMenuOpen = signal(false);
  protected readonly isDarkMode = computed(() => this.themeService.theme() === 'dark');

  protected readonly navLinks: NavLink[] = [
    { path: '/', label: 'Home' },
    { path: '/ui-showcase', label: 'UI Showcase' }
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleDarkMode(): void {
    this.themeService.toggleTheme();
  }
}
