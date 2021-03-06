import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { first } from 'rxjs/internal/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { appConfig } from 'appConfig';
import { ContextService } from '@shared/context.service';
import { YoutubeService } from '../service/youtube.service';

@Component({
  selector   : 'app-player',
  templateUrl: './player.component.html',
  styleUrls  : [ './player.component.scss' ]
})
export class PlayerComponent implements OnInit {
  public embedUrl: string;
  public videoLoader: boolean;

  public countryCode: string;
  public categoryId: number;
  public count: number;

  @ViewChild('videoFrame')
  videoFrame: ElementRef;

  constructor(private appContext: ContextService,
              private route: ActivatedRoute,
              private router: Router,
              private youtubeService: YoutubeService) {}

  public ngOnInit() {
    this.appContext.hideSideNavGear.next(true);
    this.appContext.selectedCountry.subscribe((countryCode) => this.countryCode = countryCode);
    this.appContext.selectedCategory.subscribe((categoryId) => this.categoryId = categoryId);
    this.appContext.videosCountPerPage.subscribe((count) => this.count = count);
    this.appContext.embedUrlInAppContext
      .pipe(first())
      .subscribe((embedUrl) => {
        if (embedUrl) {
          this.videoLoader = true;
          this.embedUrl = embedUrl;
        } else {
          this.videoLoader = true;
          const id = this.route.snapshot.paramMap.get('videoId');
          if (!id.length) { this.goBack(); }
          this.youtubeService.checkVideoExist(id)
            .subscribe((data) => {
              if (data.items.length > 0) {
                this.embedUrl = appConfig.getYoutubeEmbdedUrl(id);
              } else { this.goBack(); }
            });
        }
      });
  }

  /* On video ready hide loader */
  public loadVideo(): void {
    const src = this.videoFrame.nativeElement.src;
    if (src.includes('undefined')) {
      return;
    } else {
      this.videoLoader = false;
    }
  }

  public goBack() {
    this.router.navigate(['/youtube'], { queryParams: { count: this.count, country: this.countryCode, category: this.categoryId } });
  }

}
