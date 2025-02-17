import { Children } from 'react';

import { Folder } from '@/types/search';
import FolderIcon from '@mui/icons-material/Folder';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';

type DumbBrowserItemProps = React.PropsWithChildren<{
  isExpanded: boolean;
  onExpandClick: React.MouseEventHandler;
  onSelect: React.MouseEventHandler;
  isSelected: boolean;
  folder: Folder;
  isLoading: boolean;
  isUninitialized: boolean;
}>;

export const DumbBrowserItem = ({
  isExpanded,
  onExpandClick,
  onSelect,
  isSelected,
  folder,
  children,
  isLoading,
  isUninitialized,
}: DumbBrowserItemProps) => {
  const mayHaveChildren =
    Children.count(children) > 0 || isLoading || isUninitialized;
  const hasChildren =
    Children.count(children) > 0 && !(isLoading || isUninitialized);

  let iconColor = '#82b3fb';
  if (folder.docType === 'Album') {
    iconColor = '#a8dc9b';
  }

  return (
    <>
      <Tooltip title={folder.fullPath} placement="right" arrow>
        <ListItemButton
          onClick={onSelect}
          disableRipple
          selected={isSelected}
          sx={{ px: 2 }}
        >
          {isExpanded && !(isLoading || isUninitialized) ? (
            <KeyboardArrowDownIcon
              className="showOnHover"
              onClick={onExpandClick}
              sx={{ visibility: hasChildren ? undefined : 'hidden' }}
            />
          ) : (
            <KeyboardArrowRightIcon
              className="showOnHover"
              onClick={onExpandClick}
              sx={{ visibility: mayHaveChildren ? undefined : 'hidden' }}
            />
          )}
          <ListItemIcon sx={{ minWidth: 28, color: iconColor }}>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary={folder.title} />
        </ListItemButton>
      </Tooltip>
      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ ml: 2 }}>
            {children}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default DumbBrowserItem;
