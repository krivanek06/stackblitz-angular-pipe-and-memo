import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  OnInit,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  switchMap,
} from "rxjs";
import { ApiService } from "./api.service";
import { AnimeData } from "./data.model";

@Component({
  selector: "app-search-anime",
  template: `
    <mat-form-field>
      <mat-label>search anime</mat-label>
      <input matInput [formControl]="searchControl" [matAutocomplete]="auto" />
      <mat-hint>At least 3 characters</mat-hint>

      <!-- display options -->
      <mat-autocomplete
        #auto="matAutocomplete"
        [displayWith]="animeDisplayWith"
      >
        <mat-option
          *ngFor="let option of searchedData$ | async"
          [value]="option"
          (onSelectionChange)="onSelectionChange(option, $event)"
        >
          [{{ option.source }}]: {{ option.title_english ?? option.title }} ({{
            option.duration
          }})
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchAnimeComponent),
      multi: true,
    },
  ],
})
export class SearchAnimeComponent implements OnInit, ControlValueAccessor {
  searchedData$!: Observable<AnimeData[]>;
  searchControl: FormControl<string> = new FormControl<string>("", {
    nonNullable: true,
  });

  onChange: (dateRange?: AnimeData | null) => void = () => {};
  onTouched = () => {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.searchedData$ = this.searchControl.valueChanges.pipe(
      filter((x) => x.length > 3),
      distinctUntilChanged(),
      debounceTime(300),
      switchMap((name) => this.apiService.searchAnime(name))
    );
  }

  animeDisplayWith(animeData: AnimeData): string {
    return animeData.title_english ?? animeData.title;
  }

  /**
   * notify parent component that a value has been selected
   */
  onSelectionChange(animeData: AnimeData, event: any): void {
    // ignore on deselection of the previous option
    if (event.isUserInput) {
      this.onChange(animeData);
      this.searchControl.patchValue("", { emitEvent: false });
    }
  }

  // unsed
  writeValue(_?: null): void {}

  /**
   * Register Component's ControlValueAccessor onChange callback
   */
  registerOnChange(fn: SearchAnimeComponent["onChange"]): void {
    this.onChange = fn;
  }

  /**
   * Register Component's ControlValueAccessor onTouched callback
   */
  registerOnTouched(fn: SearchAnimeComponent["onTouched"]): void {
    this.onTouched = fn;
  }
}
