import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ExamplePipeComponent } from "./example-pipe.component";
import { provideHttpClient } from "@angular/common/http";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ExamplePipeComponent],
  template: ` <div class="px-10"><app-example-pipe /></div>`,
})
export class App {}

bootstrapApplication(App, {
  providers: [provideHttpClient(), provideAnimations()],
});
