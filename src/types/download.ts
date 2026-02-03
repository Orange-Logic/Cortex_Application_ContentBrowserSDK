export type GetDownloadLinksResponse = {
  downloadLinks: DownloadLink[];
};

type DownloadLink = {
  downloadLink: string;
  recordID: string;
};
