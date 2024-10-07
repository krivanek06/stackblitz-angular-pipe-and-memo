import {
  ChangeDetectorRef,
  EmbeddedViewRef,
  Inject,
  Pipe,
  PipeTransform,
  inject,
} from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, of, tap } from "rxjs";
import { AnimeData } from "./data.model";

@Pipe({
  name: "hardMathEquasionPipe",
  standalone: true,
})
export class HardMathEquasionPipe implements PipeTransform {
  private apiService = inject(ApiService);

  transform(anime: AnimeData): Observable<number> {
    console.log(`Pipe running for ${anime.title}`);
    return this.apiService.hardMathEquasionAsync(anime);
  }
}

/** ------------------------------------ */
/** ------------------------------------ */
/** ------------------------------------ */

/**
 * Pipes are not singletons, this is why we need to use static cachedAnimeDataCalculations,
 * so that one cachedAnimeDataCalculations instance is shared accros every pipes instance
 */
@Pipe({
  name: "hardMathEquasionMemoPipe",
  standalone: true,
})
export class HardMathEquasionMemoPipe implements PipeTransform {
  private static cachedAnimeDataCalculations: { [id: string]: number } = {};

  constructor(private apiService: ApiService) {}

  transform(anime: AnimeData): Observable<number> {
    // return data from cache
    if (anime.title in HardMathEquasionMemoPipe.cachedAnimeDataCalculations) {
      console.log(`Pipe CACHE return ${anime.title}`);
      return of(
        HardMathEquasionMemoPipe.cachedAnimeDataCalculations[anime.title]
      );
    }

    // load data from API
    console.log(`Pipe running for ${anime.title}`);
    return this.apiService.hardMathEquasionAsync(anime).pipe(
      tap((res) => {
        HardMathEquasionMemoPipe.cachedAnimeDataCalculations[anime.title] = res;
        console.log(
          `Saving calculation ${HardMathEquasionMemoPipe.cachedAnimeDataCalculations} for ${anime.title}`
        );
      })
    );
  }
}

/** ------------------------------------ */
/** ------------------------------------ */
/** ------------------------------------ */
@Pipe({
  name: "pure",
  standalone: true,
})
export class PurePipe implements PipeTransform {
  /**
   * @Inject(ChangeDetectorRef) prevents: NullInjectorError: No provider for EmbeddedViewRef!
   *
   */
  constructor(
    @Inject(ChangeDetectorRef)
    private readonly viewRef: EmbeddedViewRef<unknown>
  ) {}

  /**
   *
   * @param fn is the function that will be executed in the template
   * @param args a list of arguments for the function
   * @returns
   */
  transform<T extends (...args: any) => any>(
    fn: T,
    ...args: [...Parameters<T>]
  ): ReturnType<T> {
    return fn.apply(this.viewRef.context, args);
  }
}
