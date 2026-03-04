import { Component, input, signal, computed} from '@angular/core';

@Component({
  selector: 'app-tooltip',
  imports: [],
  templateUrl: './tooltip.html',
})
export class Tooltip {
  text = input<string | null>(null);
  color = input<string>('#1e2939');
  direction = input<'top' | 'bottom' | 'left' | 'right'>('top');
  isHovering = signal(false);

  protected tooltipClasses(): string {
    let classes = `absolute px-2 py-1 text-white text-sm rounded whitespace-nowrap pointer-events-none z-50 opacity-100`;

    switch (this.direction()) {
      case 'top':
        classes += ' bottom-full left-1/2 -translate-x-1/2 mb-2';
        break;
      case 'bottom':
        classes += ' top-full left-1/2 -translate-x-1/2 mt-2';
        break;
      case 'left':
        classes += ' right-full top-1/2 -translate-y-1/2 mr-2';
        break;
      case 'right':
        classes += ' left-full top-1/2 -translate-y-1/2 ml-2';
        break;
    }

    return classes;
  }

  arrowClasses = computed(() => {
    let classes = 'absolute border-4 border-transparent';

    switch (this.direction()) {
      case 'top':
        classes += ` top-full left-1/2 -translate-x-1/2`;
        break;
      case 'bottom':
        classes += ` bottom-full left-1/2 -translate-x-1/2`;
        break;
      case 'left':
        classes += ` left-full top-1/2 -translate-y-1/2`;
        break;
      case 'right':
        classes += ` right-full top-1/2 -translate-y-1/2`;
        break;
    }

    return classes;
  });

  
}
