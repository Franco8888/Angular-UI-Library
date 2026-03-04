import { AfterContentInit, AfterViewInit, Component, computed, ContentChildren, input, output, QueryList, TemplateRef, signal, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '../tooltip/tooltip';

@Component({
  selector: 'app-button',
  imports: [FontAwesomeModule, Tooltip],
  templateUrl: './button.html',
})
export class Button implements OnInit{
  protected readonly faSpinner = faSpinner;

  variant = input<'primary' | 'secondary' | 'ghost' | 'success' | 'error' | 'warn'>('primary');
  icon = input<IconDefinition | null>(null);
  text = input<string | null>(null);
  clicked = output();
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  textBold = input<boolean>(false);
  tooltip = input<string | null>(null);
  tooltipDirection = input<'top' | 'bottom' | 'right' | 'left'>('top');

  appliedClasses = computed(() => {
    let classes = '';

    // variants
    if (this.variant() === 'primary') {
      classes = 'bg-primary hover:opacity-80 text-white';
    }
    if (this.variant() === 'secondary') {
      classes = 'hover:opacity-80 outline-2 outline-primary -outline-offset-2';
    }
    if (this.variant() === 'ghost') {
      classes = 'text-primary';
    }
    if (this.variant() === 'success') {
      classes = 'bg-success hover:opacity-80 text-white';
    }
    if (this.variant() === 'error') {
      classes = 'bg-error hover:opacity-80 text-white';
    }
    if (this.variant() === 'warn') {
      classes = 'bg-warning hover:opacity-80 text-white';
    }

    // padding
    const buttonType = this.determineButtonType();
    if (buttonType !== ButtonType.TransparentIcon) {
      if (buttonType === ButtonType.Icon) {
        classes = classes + ' px-2 py-1.5';
      } else {

        classes = classes + ' px-3 py-1.5';
      }
    }

    // bold
    if (this.textBold()) {
      classes = classes + ' font-bold';
    }

    // disabled
    if (this.disabled()) {
      classes = classes + ' grayscale-50 opacity-60 pointer-events-none cursor-not-allowed';
    }

    return classes;
  });

  ngOnInit(): void {
    // this.onButtonDebug();
  }

  determineButtonType(): ButtonType {
    if (this.icon()) {
      if (this.text()) {
        return ButtonType.TextIcon
      }
      if (this.variant() === 'ghost') {
        return ButtonType.TransparentIcon
      }
      return ButtonType.Icon
    } else {
      return ButtonType.TextOnly;
    }
  }

  onClick() {
    if (this.loading() || this.disabled()) {
      return;
    }

    this.clicked.emit();
  }

  onButtonDebug() {
    console.log('button type', this.determineButtonType())

    console.log('text', this.text())

    console.log('tooltip', this.tooltip())

    console.log('generated classes', this.appliedClasses())

    console.log('generated classes', this.appliedClasses())
  }
}

enum ButtonType {
  TextOnly = 'TextOnly',
  TextIcon = 'TextIcon',
  Icon = 'Icon',
  TransparentIcon = 'TransparentIcon'
}
