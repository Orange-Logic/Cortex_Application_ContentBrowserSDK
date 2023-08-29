import { Typography } from '@mui/material';

type ResultEmptyProps = {
  query: string;
};

const ResultEmpty = ({ query }: ResultEmptyProps) => {
  return (
    <Typography align="center" width="100%">
      Your search on
      <Typography fontWeight="600"> &lsquo;{query}&rsquo; </Typography>
      had no results.
    </Typography>
  );
};

export default ResultEmpty;
