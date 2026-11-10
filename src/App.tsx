import {useState} from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';
import {Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import {NavIcon} from '@astryxdesign/core/NavIcon';
import {Icon} from '@astryxdesign/core/Icon';
import {Badge} from '@astryxdesign/core/Badge';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {BeakerIcon, FolderOpenIcon} from '@heroicons/react/24/outline';

import {ALL_ITEMS, NAV_GROUPS, type NavItem} from './nav';

export function App() {
  const [activeId, setActiveId] = useState<string>('overview');
  const active: NavItem = ALL_ITEMS.find(item => item.id === activeId) ?? ALL_ITEMS[0];
  const Section = active.render;

  return (
    <AppShell
      contentPadding={0}
      sideNav={
        <SideNav
          collapsible
          resizable={{defaultWidth: 288, minWidth: 220, maxWidth: 420}}
          header={
            <SideNavHeading
              heading="Research Portal"
              icon={<NavIcon icon={<Icon icon={BeakerIcon} size="sm" />} />}
              headingHref="#overview"
            />
          }
          footer={
            <SideNavSection title="Build" isHeaderHidden>
              <SideNavItem
                label="Compiler source"
                icon={FolderOpenIcon}
                href="legacy/index.html"
              />
            </SideNavSection>
          }>
          {NAV_GROUPS.map(group => (
            <SideNavSection key={group.title} title={group.title}>
              {group.items.map(item => (
                <SideNavItem
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  href={`#${item.id}`}
                  isSelected={item.id === activeId}
                  endContent={
                    item.id === 'figures' ? (
                      <Badge label="6" variant="neutral" />
                    ) : item.id === 'diagrams' ? (
                      <StatusDot variant="success" label="Rendered" />
                    ) : undefined
                  }
                  onClick={event => {
                    event.preventDefault();
                    setActiveId(item.id);
                  }}
                />
              ))}
            </SideNavSection>
          ))}
        </SideNav>
      }>
      {/* width 1280, not a text measure: plots and tables need the room. */}
      <Layout
        height="fill"
        contentWidth={1280}
        content={
          <LayoutContent padding={6}>
            <Section />
          </LayoutContent>
        }
      />
    </AppShell>
  );
}
