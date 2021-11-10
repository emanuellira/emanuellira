/** [# version: 6.0.0 #] */
import { Component, Input, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-item-menu-options',
  templateUrl: './item-menu-options.component.html',
  styleUrls: ['./item-menu-options.component.css'],
})
export class ItemMenuOptionsComponent implements OnInit {
  @Input() Label = '';
  @Input() Btn = '';
  @Input() Icon = '';
  @Input() Nav = '';

  constructor(private _navigate_: NavigationService) {}

  ngOnInit(): void {}

  View = () => (this._navigate_.Next_View = { path: this.Nav });
}
