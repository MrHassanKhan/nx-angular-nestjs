import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@ngx-starter-kit/animations';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { untilDestroy } from '@ngx-starter-kit/ngx-utils';
import { WINDOW } from '@ngx-starter-kit/core';
import { MatPaginator } from '@angular/material';
// import * as Trianglify from 'trianglify';
declare var Trianglify: any;

/** @dynamic */
@Component({
  selector: 'ngx-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, OnDestroy, AfterViewInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  @ViewChild('trianglify', {static: true}) trianglifyCanvasRef: ElementRef;
  color = 'YlGnBu'; // 'random'
  private _sub: Subscription;
  constructor(private elementRef: ElementRef, @Inject(WINDOW) private window: Window) {}

  ngOnInit() {
    fromEvent<Event>(this.window, 'resize')
      .pipe(
        debounceTime(100),
        map(event => [(<Window>event.target).innerWidth, (<Window>event.target).innerHeight]),
        distinctUntilChanged(),
        untilDestroy(this),
      )
      .subscribe(res => {
        // setTimeout(() => {this.renderCanvas() }, 1000)
        this.renderCanvas();
      });
  }

  ngOnDestroy() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderCanvas();
    }, 500);
  }

  renderCanvas() {
    if (!this.elementRef.nativeElement.parentNode) {
      return;
    }
    const width = this.elementRef.nativeElement.children[0].offsetWidth;
    // const height = this.elementRef.nativeElement.children[0].offsetHeight;
    const height = this.elementRef.nativeElement.parentNode.offsetHeight;

    const pattern = Trianglify({
      cell_size: width / 50 + Math.random() * 100,
      variance: Math.random(),
      x_colors: this.color,
      // x_colors: 'Blues',
      y_colors: 'match_x',
      palette: Trianglify.colorbrewer,
      color_space: 'lab',
      color_function: false,
      stroke_width: 1.51,
      width,
      height,
      seed: Math.random(),
    });
    pattern.canvas(this.trianglifyCanvasRef.nativeElement);
  }
}
