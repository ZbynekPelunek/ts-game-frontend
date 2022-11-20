import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { ICharacter, StatsParams, StatType } from '../../../../../../../shared/src';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css']
})
export class CharacterDetailsComponent implements OnInit, OnChanges {
  @Input() characterData: ICharacter;
  primaryStats: StatsParams[];
  secondaryStats: StatsParams[];
  miscStats: StatsParams[];

  ngOnInit(): void {
    this.filterStats();
  }

  ngOnChanges(): void {
    this.filterStats();
  }

  private filterStats() {
    const statParams: StatsParams[] = Object.values(this.characterData.stats);
    this.primaryStats = statParams.filter(s => s.type === StatType.PRIMARY);
    this.secondaryStats = statParams.filter(s => s.type === StatType.SECONDARY);
    this.miscStats = statParams.filter(s => s.type === StatType.MISC);
  }

}
