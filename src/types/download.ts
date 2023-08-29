export type GetDownloadLinksResponse = {
  downloadLinks: DownloadLink[];
};

type DownloadLink = {
  recordID: string;
  downloadLink: string;
};
