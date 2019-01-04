interface ILoadVidoesParam {
  videosPerPage: number;
  saveToken: boolean;
  token: string;
  country: string;
  catg: string;
}

export class LoadVidoesParam implements ILoadVidoesParam {
  videosPerPage = 50;
  saveToken = false;
  token = '';
  country = '';
  catg = '';
}
