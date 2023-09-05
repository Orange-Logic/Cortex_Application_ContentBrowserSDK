import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  getMediaTypes,
  setMediaTypes,
} from '../../../../store/search/search.slice';
import { MediaType } from '../../../../types/search';
import { FilterMenuSection } from './FilterMenuSection';

export const TypesMenuSection: React.FC = () => {
  const mediaTypes = useAppSelector(getMediaTypes);
  const dispatch = useAppDispatch();

  const handleToggle = (value: MediaType) => () => {
    const currentIndex = mediaTypes.indexOf(value);
    const newChecked = [...mediaTypes];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    dispatch(setMediaTypes(newChecked));
  };

  return (
        <FilterMenuSection sectionName="Types">
            <List component="div" disablePadding>
                {Object.keys(MediaType).map((value) => {
                  const labelId = `checkbox-list-label-${value}`;
                  const valueAsEnum = MediaType[value as keyof typeof MediaType];

                  return (
                        <ListItem key={value} disablePadding>
                            <ListItemButton
                                role={undefined}
                                onClick={handleToggle(valueAsEnum)}
                                dense
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={mediaTypes.indexOf(valueAsEnum) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`${value}`} />
                            </ListItemButton>
                        </ListItem>
                  );
                })}
            </List>
        </FilterMenuSection>
  );
};

export default TypesMenuSection;
