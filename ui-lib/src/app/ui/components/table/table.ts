import { Component, input, signal, effect, TemplateRef, computed, untracked } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft, faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '../tooltip/tooltip';
import { NgTemplateOutlet } from '@angular/common';

// TODO: Make tbale more mobile friendly by making the search & paginator items wrap below each other

export interface TableColumn<T> {
    header: string;
    data: keyof T | ((row: T) => string) | TemplateRef<unknown>;
}

export interface TableRow {
    [key: string]: any;
}

export interface TableRowAction<T> {
    color: string;
    icon: IconDefinition;
    tooltip: string;
    action: (row: T) => Promise<void>;
    shown?: (row: T) => boolean;
}

export interface TableQuery<T> {
    key: keyof T,
    query: string
}

export interface TableManager<T> {
    columns: TableColumn<T>[];
    load?: (query? : TableQuery<T>) => Promise<T[]>;
    loadPage?: (page: number, pageSize: number, query? : TableQuery<T>) => Promise<T[]>;
    rowActions?: TableRowAction<T>[];
    onSelected?: (row: T) => Promise<void>;
    totalItems?: number;
    reloadData?: (page?: number) => Promise<void>;
    searchColumns?: (keyof T)[];
}

interface TableTheme {
    rowBackgroundColor: string;
    rowHoverColor: string;
    headerBackgroundColor: string;
    tableOptionsBackgroundColor: string;
    loaderBackground: string;
    textColor: string;
    controlBorderColor: string;
    controlHoverColor: string;
    controlFocusRingColor: string;
    clearIconColor: string;
    spinnerBorderColor: string;
    spinnerAccentColor: string;
    headerBorderColor: string;
    headerColumnBorderColor: string;
    rowBorderColor: string;
}

class TableTheme_Dark implements TableTheme {
    // Table Options
    tableOptionsBackgroundColor = 'bg-gray-800';
    controlBorderColor = 'border-gray-600';
    controlHoverColor = 'hover:bg-gray-700';
    controlFocusRingColor = 'focus:ring-blue-400';
    clearIconColor = 'text-red-500';
    // Table
    textColor = 'text-gray-100';
    rowBackgroundColor = 'bg-gray-900';
    rowHoverColor = 'hover:bg-gray-700';
    headerBackgroundColor = 'bg-gray-800';
    headerBorderColor = 'border-gray-500';
    headerColumnBorderColor = 'border-gray-600';
    rowBorderColor = 'border-gray-600';
    // Loader
    loaderBackground = 'bg-gray-900/50';
    spinnerBorderColor = 'border-gray-600';
    spinnerAccentColor = 'border-t-blue-400';
}

class TableTheme_Light implements TableTheme {
    // Table Options
    tableOptionsBackgroundColor = 'bg-gray-200';
    controlBorderColor = 'border-gray-300';
    controlHoverColor = 'hover:bg-gray-50';
    controlFocusRingColor = 'focus:ring-blue-500';
    clearIconColor = 'text-red-500';
    // Table
    textColor = 'text-gray-900';
    rowBackgroundColor = 'bg-gray-300';
    rowHoverColor = 'hover:bg-gray-200';
    headerBackgroundColor = 'bg-gray-200';
    headerBorderColor = 'border-gray-400';
    headerColumnBorderColor = 'border-gray-300';
    rowBorderColor = 'border-gray-200';
    // Loader
    loaderBackground = 'bg-white/50';
    spinnerBorderColor = 'border-gray-300';
    spinnerAccentColor = 'border-t-blue-500';
}

@Component({
    selector: 'app-table',
    imports: [FontAwesomeModule, Tooltip, NgTemplateOutlet],
    templateUrl: './table.html',
})
export class Table<T extends TableRow> {
    manager = input<TableManager<T>>();
    theme = input<'light' | 'dark'>('dark');

    protected selectable = signal<boolean>(false);
    protected page = signal<number>(1);
    protected pageSize = signal<number>(10);
    protected totalItems = signal<number>(0);
    protected loading = signal<boolean>(false);
    protected selectedQueryColumn = signal<keyof T | undefined>(undefined);
    protected queryText = signal<string>('');

    protected chevronLeftIcon = faChevronLeft;
    protected chevronRightIcon = faChevronRight;
    protected xMarkIcon = faXmark;

    rows = signal<T[]>([]);

    protected searchableColumns = computed(() => {
        const mgr = this.manager();
        if (!mgr || !mgr.searchColumns || mgr.searchColumns.length === 0) return [];

        return mgr.columns.filter(col => {
            const isKeyofT = typeof col.data === 'string' || typeof col.data === 'number' || typeof col.data === 'symbol';
            return isKeyofT && mgr.searchColumns!.includes(col.data as keyof T);
        }).map(col => ({
            header: col.header,
            key: col.data as keyof T
        }));
    });

    protected tableTheme = computed(() => {
        const currentTheme = this.theme();
        return currentTheme === 'dark' ? new TableTheme_Dark() : new TableTheme_Light();
    });

    constructor() {
        effect(async () => {
            const mgr = this.manager();
            if (mgr) {
                if (mgr.load === undefined && mgr.loadPage === undefined) {
                    throw new Error('A Load method must be selected');
                } else {
                    await this.loadData();
                }

                if (mgr.onSelected !== undefined) {
                    this.selectable.set(true);
                }

                if (mgr.totalItems !== undefined) {
                    this.totalItems.set(mgr.totalItems);
                }

                mgr.reloadData = async (page?: number) => {
                    this.page.set(page ?? 1);
                    await this.loadData();
                };
            }
        });
    }

    protected get totalPages(): number {
        return Math.ceil(this.totalItems() / this.pageSize());
    }

    protected get hasPreviousPage(): boolean {
        return this.page() > 1;
    }

    protected get hasNextPage(): boolean {
        return this.page() < this.totalPages;
    }

    protected goToPage(page: number): void {
        if (page < 1 || page > this.totalPages) return;
        this.page.set(page);
        this.loadData();
    }

    protected nextPage(): void {
        if (this.hasNextPage) {
            this.page.update(p => p + 1);
            this.loadData();
        }
    }

    protected previousPage(): void {
        if (this.hasPreviousPage) {
            this.page.update(p => p - 1);
            this.loadData();
        }
    }

    protected changePageSize(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const newPageSize = parseInt(target.value, 10);
        this.pageSize.set(newPageSize);
        this.page.set(1);
        this.loadData();
    }

    private async loadData(): Promise<void> {
        const mgr = this.manager();
        if (mgr) {
            this.loading.set(true);
            try {
                const query = untracked(() => this.getQuery());
                if (mgr.load !== undefined) {
                    const data = await mgr.load(query);
                    this.rows.set(data);
                }
                if (mgr.loadPage !== undefined) {
                    const data = await mgr.loadPage(this.page(), this.pageSize(), query);
                    this.rows.set(data);
                }
            } finally {
                this.loading.set(false);
            }
        }
    }

    private getQuery(): TableQuery<T> | undefined {
        const selectedCol = this.selectedQueryColumn();
        const text = this.queryText().trim();

        if (selectedCol && text) {
            return { key: selectedCol, query: text };
        }

        return undefined;
    }

    protected onQuerySubmit(): void {
        if (this.selectedQueryColumn() === undefined ||
            this.queryText() === undefined ||
            this.queryText() === null) {
            return;
        }
        this.page.set(1);
        this.loadData();
    }

    protected onClearQuery(): void {
        this.selectedQueryColumn.set(undefined);
        this.queryText.set('');
        this.page.set(1);
        this.loadData();
    }

    protected onQueryColumnChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const value = target.value as keyof T;
        this.selectedQueryColumn.set(value);
    }

    protected get columns(): TableColumn<T>[] {
        return this.manager()?.columns ?? [];
    }

    protected getRowData(row: T, data: keyof T | ((row: T) => string) | TemplateRef<unknown>): string | null {
        // If data is a function, call it with the row
        if (typeof data === 'function') {
            return data(row);
        }

        // If data is a TemplateRef, return null (template will be rendered separately)
        if (data instanceof TemplateRef) {
            return null;
        }

        // Otherwise, treat it as a keyof T
        return (row[data] ?? '') as string;
    }

    protected isTemplate(data: keyof T | ((row: T) => string) | TemplateRef<unknown>): boolean {
        return data instanceof TemplateRef;
    }

    protected getTemplate(data: keyof T | ((row: T) => string) | TemplateRef<unknown>): TemplateRef<unknown> | null {
        return data instanceof TemplateRef ? data : null;
    }

    protected onRowClicked(row: T): void {
        if (this.manager() !== undefined && this.manager()?.onSelected !== undefined) {
            this.manager()!.onSelected!(row);
        }
    }

    protected onRowActionClicked(row: T, action: TableRowAction<T>): void {
        action.action(row);
    }
}
