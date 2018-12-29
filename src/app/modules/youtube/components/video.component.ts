import { Component, Input } from '@angular/core';
import { VideoClass } from '@modules/youtube/models/video.class';
import { ContextService } from '@shared/context.service';
import { appConfig } from 'appConfig';

@Component({
  selector   : 'app-video-component',
  templateUrl: './video.component.html',
  styleUrls  : [ './video.component.scss' ]
})

export class VideoComponent {
  @Input() public video: VideoClass;

  embedUrl: string;

  constructor(private appContext: ContextService) {}

  onSelect(videoId: string) {
    this.embedUrl = appConfig.getYoutubeEmbdedUrl(videoId);
    this.appContext.embedUrlInAppContext.next(this.embedUrl);
  }
}
