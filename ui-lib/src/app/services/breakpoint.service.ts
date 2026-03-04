import { Injectable, signal, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable({ providedIn: 'root' })
export class BreakpointService {
    public readonly currentBreakpoint = signal<'mobile' | 'tablet' | 'desktop'>('desktop');

    private readonly breakpointObserver = inject(BreakpointObserver);

    private readonly BREAKPOINTS = {
        mobile: '(max-width: 767px)',
        tablet: '(min-width: 768px) and (max-width: 1199px)',
        desktop: '(min-width: 1200px)',
    };

    constructor() {
        this.breakpointObserver.observe([this.BREAKPOINTS.mobile, this.BREAKPOINTS.tablet, this.BREAKPOINTS.desktop]).subscribe(result => {
            if (result.breakpoints[this.BREAKPOINTS.desktop]) {
                this.currentBreakpoint.set('desktop');
            } else if (result.breakpoints[this.BREAKPOINTS.tablet]) {
                this.currentBreakpoint.set('tablet');
            } else if (result.breakpoints[this.BREAKPOINTS.mobile]) {
                this.currentBreakpoint.set('mobile');
            }
        });
    }
}
