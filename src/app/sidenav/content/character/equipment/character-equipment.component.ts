import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

import { CharacterEquipmentFrontend, UiPosition } from '../../../../../../../shared/src';
import { CharacterService } from '../character.service';

@Component({
  selector: 'app-character-equipment',
  templateUrl: './character-equipment.component.html',
  styleUrls: ['./character-equipment.component.css']
})
export class CharacterEquipmentComponent implements OnInit, OnDestroy {
  @Input() characterId: string;

  isLoading = true;

  characterEquipment: CharacterEquipmentFrontend[] = [];
  leftEquipment: CharacterEquipmentFrontend[] = [];
  rightEquipment: CharacterEquipmentFrontend[] = [];
  bottomEquipment: CharacterEquipmentFrontend[] = [];

  getAllCharEquipmentSub: Subscription;

  constructor(private characterService: CharacterService) { }

  ngOnInit(): void {
    this.getAllCharEquipmentSub = this.characterService.getCharacterEquipment(this.characterId).subscribe({
      next: (response) => {
        console.log('character equipment response: ', response);
        if (response.success) {
          this.characterEquipment = response.characterEquipment;
          this.filterUiPosition();
          this.isLoading = false;
        }
      }
    })
  }

  filterUiPosition() {
    this.leftEquipment = this.characterEquipment.filter(e => e.uiPosition === UiPosition.LEFT);
    this.rightEquipment = this.characterEquipment.filter(e => e.uiPosition === UiPosition.RIGHT);
    this.bottomEquipment = this.characterEquipment.filter(e => e.uiPosition === UiPosition.BOTTOM);
  }

  ngOnDestroy(): void {
    this.isLoading = true;
    this.getAllCharEquipmentSub.unsubscribe();
  }
}
