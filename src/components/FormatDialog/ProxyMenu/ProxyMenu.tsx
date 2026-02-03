import { ReactNode, CSSProperties } from 'react';
import { Container } from './ProxyMenu.styled';
import { MediaType } from '@/types/search';

type MenuItemProps = {
  cdnName?: string | null;
  docType?: string;
  extension?: string;
  height?: string;
  image?: string;
  name: string;
  value: string;
  width?: string;
};

type Props = {
  items?: MenuItemProps[];
  selectedItem?: string;
  children?: ReactNode;
  style?: CSSProperties;
  selectedDisabled?: boolean;
};

const ProxyMenu = ({ items, selectedItem, children, style, selectedDisabled }: Props) => {
  return (
    <Container style={style}>
      {items?.map((item) => {
        const selected = selectedItem === item.value && !selectedDisabled;
        const showDimensions = Boolean(Number(item.width)) && Boolean(Number(item.height)) && item.docType !== MediaType.Audio && item.docType !== MediaType.Multimedia;

        return (
          <cx-menu-item key={item.value} value={item.value} className={selected ? 'disable-hover' : ''}>
            {item.image && (
              <div slot="prefix" className="proxy__thumbnail">
                <img src={item.image} alt={item.name} />
              </div>
            )}
            <div>
              <cx-typography
                variant="body3"
                className={`proxy__name ${selected ? 'selected' : ''}`}
              >
                {item.name}
              </cx-typography>
              <cx-typography variant="body3" className="proxy__details">
                {showDimensions && `${item.width} x ${item.height}`}
                {showDimensions && item.extension && (
                  <div className="proxy__extension-dot"></div>
                )}
                {item.extension?.replace(/^\./, '').toUpperCase()}
                {item.cdnName && (
                  <>
                    <div className="proxy__extension-dot"></div>
                    <span className="proxy__cdn-name">{item.cdnName}</span>
                  </>
                )}
              </cx-typography>
            </div>
            <cx-icon
              slot="suffix"
              name={selected ? 'check' : ''}
              style={{
                color: 'var(--cx-color-primary)',
              }}
            ></cx-icon>
          </cx-menu-item>
        );
      })}
      {children}
    </Container>
  );
};

export default ProxyMenu;
