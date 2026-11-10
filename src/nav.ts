import type {ComponentType} from 'react';
import {
  BeakerIcon,
  ChartBarIcon,
  CubeTransparentIcon,
  TableCellsIcon,
  BellAlertIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

import {Overview} from './sections/Overview';
import {Figures} from './sections/Figures';
import {Diagrams} from './sections/Diagrams';
import {TablesSection} from './sections/TablesSection';
import {Notices} from './sections/Notices';
import {Forms} from './sections/Forms';

export type NavItem = {
  id: string;
  label: string;
  icon: ComponentType<{className?: string}>;
  render: ComponentType;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

/** One nav entry per reading surface. The section is the page. */
export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Research',
    items: [
      {id: 'overview', label: 'Overview', icon: BeakerIcon, render: Overview},
      {id: 'figures', label: 'Figures & plots', icon: ChartBarIcon, render: Figures},
      {
        id: 'diagrams',
        label: 'Diagrams & ascii',
        icon: CubeTransparentIcon,
        render: Diagrams,
      },
      {id: 'tables', label: 'Data tables', icon: TableCellsIcon, render: TablesSection},
    ],
  },
  {
    title: 'Publishing',
    items: [
      {id: 'notices', label: 'Notices & status', icon: BellAlertIcon, render: Notices},
      {id: 'forms', label: 'Authoring', icon: PencilSquareIcon, render: Forms},
    ],
  },
];

export const ALL_ITEMS: NavItem[] = NAV_GROUPS.flatMap(group => group.items);
