import { Component, OnInit } from '@angular/core';
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

  constructor(private appContext: ContextService,
              private route: ActivatedRoute,
              private router: Router,
              private youtubeService: YoutubeService) {}

  public ngOnInit() {
    this.appContext.hideSideNavGear.next(true);
    this.appContext.embedUrlInAppContext
      .pipe(first())
      .subscribe((embedUrl) => {
        if (embedUrl) {
          this.videoLoader = true;
          this.embedUrl = embedUrl;
        } else {
          this.videoLoader = true;
          const id = this.route.snapshot.paramMap.get('videoId');
          if (!id.length) { this.router.navigate(['/youtube']); }
          this.youtubeService.checkVideoExist(id)
            .subscribe((data) => {
              if (data.items.length > 0) {
                this.embedUrl = appConfig.getYoutubeEmbdedUrl(id);
              } else { this.router.navigate(['/youtube']); }
            });
          this.embedUrl = appConfig.getYoutubeEmbdedUrl(id);
        }
      });
  }

  /* On video ready hide loader */
  public loadVideo(): void {
    this.videoLoader = false;
  }

}
