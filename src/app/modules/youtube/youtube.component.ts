import { Component, OnInit } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/internal/operators';
import { throwError } from 'rxjs/index';
import { ActivatedRoute } from '@angular/router';

import { YoutubeService } from './service/youtube.service';
import { ContextService } from '@shared/context.service';
import { VideoClass } from './models/video.class';
import { LoadVidoesParam } from './models/load-videos-params';

@Component({
  selector   : 'app-youtube-component',
  templateUrl: './youtube.component.html',
  styleUrls  : [ './youtube.component.scss' ]
})

export class YoutubeComponent implements OnInit {
  public trendingVideos$: Observable<VideoClass[]>;
  private newVideos$ = new BehaviorSubject<VideoClass[]>([]);
  public loadingError$ = new Subject<boolean>();
  private videos: VideoClass[] = [];
  public params: LoadVidoesParam = new LoadVidoesParam();

  constructor(private youtubeService: YoutubeService,
              private appContext: ContextService,
              private route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.appContext.hideSideNavGear.next(false);
    this.appContext.moduleTitle.next('YOUTUBE');
    this.route.queryParams.subscribe((data) => this.videosfunc(data.count, data.country, data.category));

    this.trendingVideos$ = this.newVideos$.pipe(
      map((data) => {
         this.videos = [...this.videos, ...data];
        //  console.log(this.videos);
         return this.videos;
      }));
  }

  public videosfunc(count: number, country?: string, catg?: string) {
    this.videos = [];
    this.params.videosPerPage = count;
    this.params.saveToken = false;
    this.params.token = '';
    this.params.country = country;
    this.params.catg = catg;

    if (count <= 50) {
        this.loadVideos(this.params);
    } else {
        this.params.videosPerPage = 50;
        this.params.saveToken = true;

        this.loadVideos(this.params);
        this.appContext.pageToken.subscribe((token) => {
            count -= 50;
            this.params.videosPerPage = count > 50 ? 50 : count;
            this.params.token = token;
            if (count > 0) {
                this.loadVideos(this.params);
            }
        });
    }
  }

  private loadVideos(params: LoadVidoesParam) {
    // console.log(params);
    this.youtubeService.getTrendingVideos(params.videosPerPage, params.saveToken, params.token, params.country, params.catg)
      .pipe(
        catchError((error: any) => {
          this.loadingError$.next(true);
          return throwError(error);
        })
      ).subscribe((newVideos) => this.newVideos$.next(newVideos));
  }

}
