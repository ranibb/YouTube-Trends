import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import { appConfig } from 'appConfig';

@Injectable()
export class ContextService {
  public moduleTitle: Subject<string> = new Subject<string>();
  public videosCountPerPage: BehaviorSubject<number> = new BehaviorSubject<number>(appConfig.maxVideosToLoad);
  public hideSideNavGear: Subject<boolean> = new Subject<boolean>();
  public embedUrlInAppContext: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public pageToken: Subject<string> = new Subject<string>();
}
