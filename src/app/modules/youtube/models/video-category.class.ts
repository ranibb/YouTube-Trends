export class VideoCategoryClass {
  public id = '';
  public name = '';

  constructor(data: any = {}) {
    if (!data || !data[ 'snippet' ]) {
      return;
    }

    this.id = data[ 'id' ];
    this.name = data[ 'snippet' ][ 'title' ];
  }
}
