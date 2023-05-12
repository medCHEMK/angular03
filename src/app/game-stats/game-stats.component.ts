import { Component } from '@angular/core';
import { Team, Conference } from '../data.models';
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
  conference : string  | null= null;
  division: string | null = null;
  conferences : Conference[] = [
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
    if (value == "null") {
      let divisionsList: string[] = [];
      this.conferences.map((conference) => {
        divisionsList = divisionsList.concat(conference.divisions);
      });
      this.divisions = divisionsList;
      this.teams$ = this.nbaService.getAllTeams(null, this.division);
      this.conference = null;
      return;
    }

    this.divisions =this.conferences.find((conference: Conference) => conference.name === value)?.divisions ||[];
    this.conference = value;
    this.division = null;
    this.teams$ = this.nbaService.getAllTeams(this.conference, null);
  }

  selectDivision(value: string): void {
    let division : string | null = value;
    if(value == "null"){division = null}
    this.division = division;
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
