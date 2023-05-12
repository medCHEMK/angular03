import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { NbaService } from '../nba.service';
import { Game, Stats, Team } from '../data.models';

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css'],
})
export class TeamStatsComponent implements OnInit {
  @Input()
  team!: Team;
  @Input() numberDays!: number;

  showPopup: boolean = false;

  displayPopup(): void {
    this.showPopup = true;
  }
  hidePopup(): void {
    this.showPopup = false;
  }

  games$!: Observable<Game[]>;
  stats!: Stats;
  constructor(protected nbaService: NbaService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.games$ = this.nbaService
      .getLastResults(this.team)
      .pipe(
        tap(
          (games) =>
            (this.stats = this.nbaService.getStatsFromGames(games, this.team))
        )
      );
  }

  ngOnInit(): void {
    this.games$ = this.nbaService
      .getLastResults(this.team)
      .pipe(
        tap(
          (games) =>
            (this.stats = this.nbaService.getStatsFromGames(games, this.team))
        )
      );
  }
}
