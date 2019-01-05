import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/internal/operators';

import { appConfig } from 'appConfig';
import { VideoClass } from '../models/video.class';
import { VideoCategoryClass } from '../models/video-category.class';
import { ContextService } from '@shared/context.service';

@Injectable()
export class YoutubeService {

  constructor(private http: HttpClient, private appContext: ContextService) {
  }

  public checkVideoExist(vid: string) {
    const params: any = {
      part: 'id',
      id: vid,
      key: appConfig.youtubeApiKey
    };
    return this.http.get<any>(appConfig.getYoutubeEndPoint('videos'), { params });
  }

  public getTrendingVideos(
    videosPerPage?: number,
    nextToken?: boolean,
    token?: string,
    code?: string,
    catg?: string): Observable<VideoClass[]> {

    const params: any = {
      part           : appConfig.partsToLoad,
      chart          : appConfig.chart,
      videoCategoryId: catg ? catg : appConfig.defaultCategoryId,
      regionCode     : code ? code : appConfig.defaultRegion,
      maxResults     : videosPerPage ? videosPerPage : appConfig.maxVideosToLoad,
      key            : appConfig.youtubeApiKey,
      pageToken      : token ? token : ''
    };

    return this.http.get<any>(appConfig.getYoutubeEndPoint('videos'), { params })
      .pipe(
        map(
          (data) => {
            if (nextToken) { this.appContext.pageToken.next(data.nextPageToken); }
            return data.items
              .map((item: any) => new VideoClass(item))
              .filter((item: any) => item.id !== '');
          }),
        catchError(this.handleError('getTrendingVideos'))
      ) as Observable<VideoClass[]>;
  }

  public getVideoCategoriesByCountryCode(countryCode: string): Observable<VideoCategoryClass[]> {

    const params: any = {
      part          : 'id, snippet',
      chart         : appConfig.chart,
      regionCode    : countryCode,
      key           : appConfig.youtubeApiKey
    };

    return this.http.get<any>(appConfig.getYoutubeEndPoint('videoCategories'), { params })
      .pipe(
        map(
          (data) => data.items
            .filter((item) => item.id !== '' && item.snippet && item.snippet.assignable)
            .map((item) => new VideoCategoryClass(item))
        ),
        catchError(this.handleError('getVideoCategoriesByCountry'))
      ) as Observable<VideoCategoryClass[]>;
  }

  private handleError(operation: string = 'operation') {
    return (error: any) => {
      error.operation = operation;
      return throwError(error);
    };
  }
}
