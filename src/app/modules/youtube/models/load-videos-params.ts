interface ILoadVidoesParam {
  videosPerPage: number;
  saveToken: boolean;
  token: string;
}

export class LoadVidoesParam implements ILoadVidoesParam {
  videosPerPage = 50;
  saveToken = false;
  token = '';
}
