import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { ContextService } from '../context.service';

@Component({
  selector   : 'app-page-header',
  templateUrl: './header.component.html',
  styleUrls  : [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {

  @Input()
  public filterSlide: any;

  public sideNavGear = false;

  public title$: Subject<string> = this.appContext.moduleTitle;

  constructor(private appContext: ContextService) {
  }

  public ngOnInit(): void {
    this.appContext.hideSideNavGear.subscribe((hide) => this.sideNavGear = !hide);
  }
}
