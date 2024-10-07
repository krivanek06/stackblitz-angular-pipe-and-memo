import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { Observable, scan } from "rxjs";
import { ApiService } from "./api.service";
import { SearchAnimeComponent } from "./search-anime.component";
import { TableHeaderComponent } from "./table-header.component";
import { AnimeData, hardMathEquasion } from "./data.model";
import { HardMathEquasionMemoPipe } from "./example-pipes.pipe";
import { HardMathEquasionPipe } from "./example-pipes.pipe";
import { PurePipe } from "./example-pipes.pipe";

@Component({
  selector: "app-example-pipe",
  template: `
    <h2>Pipe call component</h2>

    <!-- search anime -->
    <app-search-anime [formControl]="animeSearchControl" />

    <!-- table header -->
    <app-table-header />

    <!-- table body -->
    <div
      *ngFor="let data of loadedAnime$ | async"
      class="grid grid-cols-5 gap-2 p-2 mb-1 border-b border-gray-400 border-solid"
    >
      <div>{{ data.title_english ?? data.title }}</div>
      <div>{{ data.source }}</div>
      <div>{{ data.duration }}</div>
      <div>{{ data.score }}</div>
      <!-- <div>{{ hardMathEquasionAsyncFunctionCallPipe | pure: data | async }}</div> -->
      <!-- <div>{{ hardMathEquasionFunctionCallPipe | pure : data }}</div> -->
      <div>{{ data | hardMathEquasionPipe | async }}</div>
      <!-- <div>{{ (data| hardMathEquasionMemoPipe) | async }}</div> -->
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    TableHeaderComponent,
    SearchAnimeComponent,
    ReactiveFormsModule,
    MatButtonModule,
    PurePipe,
    HardMathEquasionMemoPipe,
    HardMathEquasionPipe,
  ],
})
export class ExamplePipeComponent {
  private apiService = inject(ApiService);
  animeSearchControl: FormControl<AnimeData> = new FormControl<AnimeData>(
    {} as AnimeData,
    { nonNullable: true }
  );
  loadedAnime$ = this.animeSearchControl.valueChanges.pipe(
    scan((acc, curr) => [...acc, curr], [] as AnimeData[])
  );

  hardMathEquasionFunctionCallPipe(anime: AnimeData): number {
    console.log(`%c Function call ${anime.title}`, `color: #FEA42C`);
    return hardMathEquasion(anime.score);
  }

  hardMathEquasionAsyncFunctionCallPipe(anime: AnimeData): Observable<number> {
    console.log(`%c [Async] Function call ${anime.title}`, `color: #22A42C`);
    return this.apiService.hardMathEquasionAsync(anime);
  }
}
