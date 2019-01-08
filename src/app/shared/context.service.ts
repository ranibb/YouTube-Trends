import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import { appConfig } from 'appConfig';
import { VideoCategoryClass } from '@modules/youtube/models/video-category.class';

@Injectable()
export class ContextService {
  public moduleTitle: Subject<string> = new Subject<string>();
  public selectedCountry: BehaviorSubject<string> = new BehaviorSubject<string>(appConfig.defaultRegion);
  public selectedCategory: BehaviorSubject<number> = new BehaviorSubject<number>(appConfig.defaultCategoryId);
  public videosCountPerPage: BehaviorSubject<number> = new BehaviorSubject<number>(appConfig.maxVideosToLoad);
  public hideSideNavGear: Subject<boolean> = new Subject<boolean>();
  public embedUrlInAppContext: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public pageToken: Subject<string> = new Subject<string>();
  public videosCategoryList: Subject<VideoCategoryClass[]> = new Subject<VideoCategoryClass[]>();
  public scrollPageToken: Subject<string> = new Subject<string>();
}
