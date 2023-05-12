import { Component } from '@angular/core';
import { Team } from '../data.models';
import { Observable, tap } from 'rxjs';
import { NbaService } from '../nba.service';

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.css'],
})
export class GameStatsComponent {
  teams$: Observable<Team[]>;
  allTeams: Team[] = [];

  numberDays():number{
    return this.nbaService.numberDays ;
  }  

  changeDays(value : string){
    this.nbaService.numberDays = parseInt(value);
  }
  conference : string = "West";
  division: string = "Northwest";
  conferences = [
    {
      name: 'West',
      divisions: ['Northwest', 'Pacific', 'Southwest'],
    },
    {
      name: 'East',
      divisions: ['Atlantic', 'Central', 'Southeast'],
    },
  ];

  divisions: string[] = [
    'Northwest',
    'Pacific',
    'Southwest',
    'Atlantic',
    'Central',
    'Southeast',
  ];

  selectConference(value: string): void {
    if (!value) {
      let divisionsList: string[] = [];
      this.conferences.map((conference) => {
        divisionsList = divisionsList.concat(conference.divisions);
      });
      this.divisions = divisionsList;
      return;
    }

    this.divisions =
      this.conferences.find((division: any) => division.name === value)!
        .divisions;
    this.conference = value;
    this.teams$ = this.nbaService.getAllTeams(this.conference, this.division);
  }

  selectDivision(value: string): void {
    this.division = value;
    this.teams$ = this.nbaService.getAllTeams(this.conference, this.division);
  }

  constructor(protected nbaService: NbaService) {
    this.teams$ = nbaService
      .getAllTeams()
      .pipe(tap((data) => (this.allTeams = data)));
  }

  trackTeam(teamId: string): void {
    let team = this.allTeams.find((team) => team.id == Number(teamId));
    if (team) this.nbaService.addTrackedTeam(team);
  }
}
