import { AppBar, Box, Toolbar } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import Footer, { ImportingDialog } from '../../components/Footer';
import Header from '../../components/Header/Header';
import Results from '../../components/Result/Result';
import SearchBar from '../../components/SearchBar';
import SelectProxyModal from '../../components/SelectProxy';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectedAssetsSelector, setSelectedAssets } from '../../store/assets/assets.slice';
import { AssetImage } from '../../types/search';
import { CortexColors } from '../../utils/constants';

type HomePageProps = {
  multiSelect?: boolean;
};

const HomePage = ({ multiSelect = false }: HomePageProps) => {
  const selectedAssets = useAppSelector(selectedAssetsSelector);
  const [isSeeThrough, setIsSeeThrough] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const dispatch = useAppDispatch();

  const handleSelectItem = (selectedAsset: AssetImage) => {
    if (!multiSelect) { 
      dispatch(setSelectedAssets([selectedAsset]));
      return;
    }

    if (selectedAssets.includes(selectedAsset)) {
      // The asset already selected, now we need to remove it from the selected assets list
      dispatch(setSelectedAssets(selectedAssets.filter(asset => asset.id !== selectedAsset.id)));
    } else {
      // The asset is not selected, now we need to add it to the selected assets list
      dispatch(setSelectedAssets([...selectedAssets, selectedAsset]));
    }
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr"
      gridTemplateRows="max-content 1fr"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        backgroundColor: CortexColors.A0,
      }}
    >
      <AppBar
        component="nav"
        sx={{ backgroundColor: 'white' }}
        position="sticky"
      >
        <Toolbar sx={{ margin: 0, padding: 1 }}>
          <Box sx={{ width: '100%' }}>
            <Header />
            {/* Folder selector - Search bar - Template selector */}
            <SearchBar
              isSeeThrough={isSeeThrough}
              setIsSeeThrough={setIsSeeThrough}
              totalCount={totalCount}
              currentCount={currentCount}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        overflow="hidden"
        sx={{ position: 'relative', backgroundColor: grey[200] }}
      >
        <Results
          handleSelectItem={handleSelectItem}
          selectedAssets={selectedAssets}
          isSeeThrough={isSeeThrough}
          setTotalCount={setTotalCount}
          setCurrentCount={setCurrentCount}
        />
      </Box>
      {
        selectedAssets &&
        <Footer
          multiSelect={multiSelect}
          deselectAll={() => dispatch(setSelectedAssets([]))}
          selectedAssets={selectedAssets}
        />
      }
      {/* Need this component mounted to handle the stored default proxy */}
      <SelectProxyModal /> 
      <ImportingDialog />
    </Box>
  );
};

export default HomePage;
