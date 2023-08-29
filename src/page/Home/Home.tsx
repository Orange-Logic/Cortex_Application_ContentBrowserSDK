import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppContext } from '../../AppContext';
import AssetImportedSnackbar from '../../components/AssetImportedSnackbar';
import Header from '../../components/Header/Header';
import Results from '../../components/Result/Result';
import SearchBar from '../../components/SearchBar';
import { useAppSelector } from '../../store';
import { getExtraFields } from '../../store/search/search.slice';
import { AssetImage, GetAssetLinkResponse } from '../../types/search';
import { cortexFetch } from '../../utils/api';
import { CortexColors } from '../../utils/constants';

type HomePageProps = {
  handleClose: () => void;
  multiSelect?: boolean;
};

const HomePage = ({ handleClose, multiSelect = false }: HomePageProps) => {
  const currentFolder = useAppSelector((state) => state.search.currentFolder);
  const searchText = useAppSelector((state) => state.search.imageSearchText);
  const onlyIIIFPrefix = useAppSelector((state) => state.assets.onlyIIIFPrefix);
  const { onImageSelected, onError } = useContext(AppContext);
  const extraFields = useSelector(getExtraFields);
  const [selectedAssets, setSelectedAssets] = useState<AssetImage[]>([]);
  const [isSeeThrough, setIsSeeThrough] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentCount, setCurrentCount] = useState<number>(0);

  const handleSelectItem = (selectedAsset: AssetImage) => {
    if (!multiSelect) { 
      setSelectedAssets([selectedAsset]);
      return;
    }
    if (selectedAssets.includes(selectedAsset)) {
      const newAssets = selectedAssets.filter((asset)=> {
        return asset.id !== selectedAsset.id;
      });
      setSelectedAssets(newAssets);
      return;
    }
    setSelectedAssets([...selectedAssets, selectedAsset]);
  };

  const handleClickConfirm = async () => {
    // TODO: Move the loop to a assets.slice.ts
    // Loop through all selected assets to replace Image url by IIIF urls
    const images = (await Promise.all(selectedAssets.map(async (asset) => {
      const response =  await cortexFetch(`webapi/extensibility/integrations/gab/assetbrowser/GetAssetLink_4by?RecordId=${asset.id}&ExtraFields=${extraFields?.join('&ExtraFields=') || ''}`);
      if (!response.ok) {
        onError(`Failed to retrive asset link and metadata for asset ${asset.id}.`);
        return {
          imageUrl: asset.imageUrl,
        } as GetAssetLinkResponse;
      }
      const responseData = (await response.json()) as GetAssetLinkResponse;
      responseData.imageUrl += onlyIIIFPrefix ? '' : '/full/max/0.0/default.jpg';
      return responseData;
    })));
    onImageSelected(images);
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
          key={currentFolder.id + searchText + ''}
          currentFolder={currentFolder}
          searchText={searchText}
          handleSelectItem={handleSelectItem}
          selectedAssets={selectedAssets}
          isSeeThrough={isSeeThrough}
          setTotalCount={setTotalCount}
          setCurrentCount={setCurrentCount}
        />
        <AssetImportedSnackbar />
      </Box>
      {selectedAssets && 
        <Box 
          sx={{
            position: 'absolute',
            boxSizing: 'border-box',
            width: '100%',
            bottom: 0,
            display: 'flex', 
            justifyContent: 'end',
            alignItems: 'center',
            padding: '8px 12px',
            gap:2,
            backgroundImage: `linear-gradient(to left, ${CortexColors.A0} 400px, transparent, transparent)`,
          }}
        >
          <Typography sx={{ color: CortexColors.A500 }} fontWeight='500' fontStyle='italic'>
            Selecting {multiSelect ? 'multiple assets' : 'a single asset'}
          </Typography>
          {(selectedAssets.length > 0 && multiSelect) &&
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <Typography sx={{ color: CortexColors.A500, fontWeight:'600' }}>
                  {selectedAssets.length} 
                </Typography>
                <Typography sx={{ color: CortexColors.A500, fontWeight:'500' }}>
                  Selected
                </Typography>
              </Box>
              <Button
                variant="outlined"
                sx={{
                  color: CortexColors.A500,
                  backgroundColor: CortexColors.A100,
                  borderColor: 'transparent',
                  '&:hover': {
                    backgroundColor: CortexColors.A200,
                    borderColor: 'transparent',
                  },
                  '&:active': {
                    backgroundColor: CortexColors.A300,
                    borderColor: 'transparent',
                  },
                  '&:focused': {
                    backgroundColor: CortexColors.A200,
                    borderColor: CortexColors.B300,
                  },
                }}
                onClick={()=> setSelectedAssets([])}
              >
                Deselect All
              </Button>  
            </Box>
          }
          <Button
            sx={{
              backgroundColor: CortexColors.B500,
              color: CortexColors.A0,
            }}
            onClick={handleClickConfirm}
          >
            Confirm
          </Button>
        </Box>
      }
    </Box>
  );
};

export default HomePage;
