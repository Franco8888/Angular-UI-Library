import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { Button } from '../../ui/components/button/button';
import { Table, TableColumn, TableManager, TableRow } from '../../ui/components/table/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCoffee,
  faAddressCard,
  faAnchor,
  faAmbulance,
  faArrowDownZA,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Tooltip } from '../../ui/components/tooltip/tooltip';
import { PromiseHelper } from '../../helpers/promise';
import { ThemeService } from '../../services/theme.service';
import { AppColors } from '../../../styles';

@Component({
  selector: 'app-ui-showcase',
  imports: [Button, Table, FontAwesomeModule, Tooltip],
  standalone: true,
  templateUrl: './ui-showcase.html',
})
export class UIShowcaseComponent implements AfterViewInit {
  @ViewChild('avatar') avatarTemplate!: TemplateRef<any>;

  protected readonly faCoffee = faCoffee;
  protected readonly faAddressCard = faAddressCard;
  protected readonly faAnchor = faAnchor;
  protected readonly faAmbulance = faAmbulance;
  protected readonly faArrowDownZA = faArrowDownZA;
  data = 'initial';

  protected userService = inject(UserService);
  protected themeService = inject(ThemeService);

  userTableManager = signal<TableManager<User> | null>(null);

  async ngAfterViewInit() {
    this.userTableManager.set({
      columns: [
        { header: '', data: this.avatarTemplate },
        { header: 'Name', data: 'name' },
        { header: 'Email', data: 'email' },
        { header: 'Role', data: 'role' },
        { header: 'Status', data: 'status' },
        {
          header: 'Extra',
          data: (user) => {
            if (user.name.startsWith('J')) {
              return 'Start with J';
            }
            return '';
          },
        },
      ],
      loadPage: (page, pageSize, query) =>
        this.userService.getUsersPaged(page, pageSize, query?.key, query?.query),
      totalItems: 100,
      rowActions: [
        {
          icon: this.faCoffee,
          color: AppColors.PRIMARY_400,
          tooltip: 'coffee',
          action: async (row) => console.log(row),
        },
        {
          icon: this.faAddressCard,
          color: '',
          tooltip: 'address',
          action: async (row) => console.log(row),
          shown: (row) => false,
        },
        {
          icon: this.faArrowDownZA,
          color: AppColors.SUCCESS,
          tooltip: 'down',
          action: async (row) => console.log(row),
        },
      ],
      onSelected: async (row) => {
        console.log(row);
      },
      searchColumns: ['name', 'role', 'status'],
    });
  }

  async ngOnInit() {}

  handleClick() {
    console.log('Button clicked!');
  }

  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  async getUsersPaged(
    page: number,
    pageSize: number,
    searchColumn: keyof User | undefined,
    queryString: string | undefined,
  ): Promise<User[]> {
    return this.userService.getUsersPaged(page, pageSize, searchColumn, queryString);
  }
}
