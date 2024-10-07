import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-table-header",
  template: `<div
    class="grid grid-cols-5 mb-1 gap-2 p-2 rounded-lg bg-gray-300 font-semibold"
  >
    <div>Title</div>
    <div>Source</div>
    <div>Duration</div>
    <div>Score</div>
    <div>Custom</div>
  </div> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TableHeaderComponent {}
