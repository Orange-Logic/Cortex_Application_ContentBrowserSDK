import { AppBar, Box, Toolbar } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header/Header';
import Results from '../../components/Result/Result';
import SearchBar from '../../components/SearchBar';
import SelectProxyModal from '../../components/SelectProxy';
import { useAppDispatch, useAppSelector } from '../../store';
import { isImportingSelector, isProxyModalOpenSelector, selectedAssetsSelector, setSelectedAssets } from '../../store/assets/assets.slice';
import { AssetImage } from '../../types/search';
import { CortexColors } from '../../utils/constants';

type HomePageProps = {
  multiSelect?: boolean;
};

const HomePage = ({ multiSelect = false }: HomePageProps) => {
  const currentFolder = useAppSelector((state) => state.search.currentFolder);
  const searchText = useAppSelector((state) => state.search.imageSearchText);
  const selectedAssets = useAppSelector(selectedAssetsSelector);
  const isProxyModalOpen = useAppSelector(isProxyModalOpenSelector);
  const isImporting = useAppSelector(isImportingSelector);
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
      const newAssets = selectedAssets.filter((asset)=> {
        return asset.id !== selectedAsset.id;
      });
      dispatch(setSelectedAssets(newAssets));
      return;
    }
    dispatch(setSelectedAssets([...selectedAssets, selectedAsset]));
  };

  return (
    <>
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
            key={currentFolder.id + searchText + ''}
            currentFolder={currentFolder}
            searchText={searchText}
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
        {!isImporting && isProxyModalOpen && <SelectProxyModal open={isProxyModalOpen} />}
      </Box>
    </>
  );
};

export default HomePage;
