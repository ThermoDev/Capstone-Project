import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import GlobalNavigation from '@atlaskit/global-navigation';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import GearIcon from '@atlaskit/icon/glyph/settings';
import PersonIcon from '@atlaskit/icon/glyph/person';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import {
  LayoutManager,
  NavigationProvider,
  GroupHeading,
  Item,
  ItemAvatar,
  ContainerHeader,
  HeaderSection,
  MenuSection,
  Separator,
} from '@atlaskit/navigation-next';

const navLinks = [
  ['/', 'Home', DashboardIcon],
  ['/portfolios', 'Portfolios', FolderIcon],
  ['/profile', 'Profile', PersonIcon],
  ['/settings', 'Settings', GearIcon],
];

const MyGlobalNavigation = () => (
  <GlobalNavigation
    productIcon={() => <GraphLineIcon size="large" />}
    productTooltip="TradiE"
    onProductClick={() => {}}
  />
);

const MyContainerNavigation = () => (
  <>
    <HeaderSection>
      {({ css }) => (
        <div style={{ ...css, paddingBottom: 20 }}>
          <ContainerHeader
            before={itemState => (
              <ItemAvatar
                itemState={itemState}
                appearance="square"
                size="large"
              />
            )}
            text="Welcome"
            subText="Martin Le"
          />
        </div>
      )}
    </HeaderSection>
    <MenuSection>
      {({ className }) => (
        <div className={className}>
          {navLinks.map(link => {
            const [url, title, icon] = link;
            return (
              <Link key={title} href={url}>
                <Item before={icon} text={title} />
              </Link>
            );
          })}
          <Separator />
          <GroupHeading>Shortcuts</GroupHeading>
          <Item before={ShortcutIcon} text="Create new portfolio" />
          <Item before={ShortcutIcon} text="Purchase stocks" />
          <Item before={ShortcutIcon} text="Leaderboard" />
          <Item before={ShortcutIcon} text="Help" />
        </div>
      )}
    </MenuSection>
  </>
);

const Navigation = ({ children }) => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={MyGlobalNavigation}
      productNavigation={() => null}
      containerNavigation={MyContainerNavigation}
    >
      {children}
    </LayoutManager>
  </NavigationProvider>
);

Navigation.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Navigation;
