import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class ContextService {
  public moduleTitle: Subject<string> = new Subject<string>();
  public videosCountPerPage: Subject<number> = new Subject<number>();
  public hideSideNavGear: Subject<boolean> = new Subject<boolean>();
  public embedUrlInAppContext: BehaviorSubject<string> = new BehaviorSubject<string>(null);
}
