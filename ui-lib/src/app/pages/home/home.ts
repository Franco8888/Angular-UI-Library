import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '../../ui/components/button/button';
import { PromiseHelper } from '../../helpers/promise';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faAddressCard, faAnchor, faAmbulance, faArrowDownZA, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  imports: [Button, FontAwesomeModule],
  standalone: true,
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly faCoffee = faCoffee;
  protected readonly faAddressCard = faAddressCard;
  protected readonly faAnchor = faAnchor;
  protected readonly faAmbulance = faAmbulance;
  protected readonly faArrowDownZA = faArrowDownZA;
  data = 'initial';

  async ngOnInit() {

    // delay 2 seconds then log data
    await PromiseHelper.delay(2000);
    this.data = 'changed';

    console.log(this.data);
  }

  handleClick() {
    console.log('Button clicked!');
  }
}
