/// <reference types="cypress" />

import { Filter, GridView, SortDirection } from '@/types/search';
import ControlBar from './ControlBar';
import { useState } from 'react';

const defaultFiltes = {
  mediaTypes: ['Images'],
  visibilityClasses: ['Published'],
  statuses: ['Not started'],
  extensions: ['.jpg', '.png', '.gif'],
};

const ControlBarWrapper = () => {
  const [searchText, setSearchText] = useState('');
  const onSearchChange = (value: string) => {
    setSearchText(value);
  };

  const [isSeeThrough, setIsSeeThrough] = useState(false);
  const [view, setView] = useState(GridView.Medium);
  const [appliedFilter, setAppliedFilter] = useState<Filter>(defaultFiltes);
  const [sortOrder, setSortOrder] = useState('date created');
  const [sortDirection, setSortDirection] = useState(SortDirection.Descending);
  const [facets, setFacets] = useState<Record<string, any> | undefined>({
    status: {
      'Not started': 7,
      'Completed': 3,
    },
    visibilityClass: {
      'Published': 7,
      'Pending': 3,
    },
    extension: {
      '.png': 3,
      '.gif': 2,
      '.jpg': 2,
      '.jpeg': 2,
    },
    type: {
      'Images': 7,
      'Videos': 3,
    },
  });

  const onSettingChange = (
    setting: string,
    value: GridView | SortDirection | Filter | string | boolean | string[],
  ) => {
    if (setting === 'view') {
      setView(value as GridView);
    } else if (setting === 'isSeeThrough') {
      setIsSeeThrough(value as boolean);
    } else if (setting === 'filter') {
      setAppliedFilter(value as Filter);
    } else if (setting === 'sortOrder') {
      setSortOrder(value as string);
    } else if (setting === 'sortDirection') {
      setSortDirection(value as SortDirection);
    }
  };



  return (
    <div>
      <ControlBar
        allowSorting={true}
        currentCount={10}
        loading={false}
        extensions={appliedFilter.extensions}
        facets={facets}
        isMobile={false}
        isSeeThrough={isSeeThrough}
        mediaTypes={appliedFilter.mediaTypes}
        onSearchChange={onSearchChange}
        onSettingChange={onSettingChange}
        searchValue=""
        sortDirection={sortDirection}
        sortOrder={sortOrder}
        sortOrders={{
          relevancy: [
            {
              name: 'Relevancy',
              description:
                'Uses an algorithm to determine a score for each asset related to the search terms, then sorts these assets from highest to lowest score',
              id: 'OR4ND000000063444',
              legacyValue: 'Sort1',
              sortDirection: 'Mono',
              sortDirectionGroupKey: '',
              sortType: 'Manual',
              sortDirectionDisplayName: '',
            },
          ],
          'editor choice': [
            {
              name: 'Editor Choice',
              description:
                'Sorts assets based on the Editor’s Rating, from highest to lowest ranking',
              id: 'OR4ND000000063457',
              legacyValue: 'Sort2',
              sortDirection: 'Mono',
              sortDirectionGroupKey: '',
              sortType: 'Manual',
              sortDirectionDisplayName: '',
            },
          ],
          'date created': [
            {
              name: 'Newest First',
              description: "Sorts assets from latest to oldest, based on asset's created date",
              id: 'OR4ND000000063460',
              legacyValue: 'Sort3',
              sortDirection: 'Descending',
              sortDirectionGroupKey: 'Date Created',
              sortType: 'Manual',
              sortDirectionDisplayName: 'Newest First',
            },
            {
              name: 'Oldest First',
              description: "Sorts assets from oldest to latest, based on asset's created date",
              id: 'OR4ND000000063464',
              legacyValue: 'Sort4',
              sortDirection: 'Ascending',
              sortDirectionGroupKey: 'Date Created',
              sortType: 'Manual',
              sortDirectionDisplayName: 'Oldest First',
            },
          ],
          filename: [
            {
              name: 'File name',
              description:
                'Displays assets based on the assets Original File Name, alphabetically from A to Z',
              id: 'OR4ND000000063467',
              legacyValue: 'Sort5',
              sortDirection: 'Ascending',
              sortDirectionGroupKey: 'Filename',
              sortType: 'Manual',
              sortDirectionDisplayName: 'A-Z',
            },
            {
              name: 'File name DESC',
              description:
                'Displays assets based on the assets Original File Name, alphabetically from Z to A',
              id: 'OR4ND000000077974',
              legacyValue: 'Sort9',
              sortDirection: 'Descending',
              sortDirectionGroupKey: 'Filename',
              sortType: 'Manual',
              sortDirectionDisplayName: 'Z-A',
            },
          ],
          'file size': [
            {
              name: 'File size',
              description: "Sorts assets from smallest to largest, based on asset's file size",
              id: 'X1YND000000005020',
              legacyValue: 'Sort6',
              sortDirection: 'Ascending',
              sortDirectionGroupKey: 'File Size',
              sortType: 'Manual',
              sortDirectionDisplayName: 'Smallest first',
            },
            {
              name: 'File size DESC',
              description: "Sorts assets from largest to smallest, based on asset's file size",
              id: 'X1YND000000005034',
              legacyValue: 'Sort10',
              sortDirection: 'Descending',
              sortDirectionGroupKey: 'File Size',
              sortType: 'Manual',
              sortDirectionDisplayName: 'Largest first',
            },
          ],
          'date last edited': [
            {
              name: 'Last changed',
              description:
                'Sorts assets based on the date in which assets were last edited (called Edit Date), from latest to oldest',
              id: 'OR1ND000001895792',
              legacyValue: 'Sort7',
              sortDirection: 'Descending',
              sortDirectionGroupKey: 'Date Last Edited',
              sortType: 'Manual',
              sortDirectionDisplayName: 'Newest First',
            },
            {
              name: 'Last changed ASC',
              description:
                'Sorts assets based on the date in which assets were last edited (called Edit Date), from oldest to latest',
              id: 'X07ND000000000971',
              legacyValue: 'Sort8',
              sortDirection: 'Ascending',
              sortDirectionGroupKey: 'Date Last Edited',
              sortType: 'Manual',
              sortDirectionDisplayName: 'Oldest First',
            },
          ],
          'most popular': [
            {
              name: 'Most Popular',
              description:
                'Sorts assets by how often assets have been downloaded, from the most downloaded asset to the least',
              id: 'X0END000000013511',
              legacyValue: 'Sort11',
              sortDirection: 'Mono',
              sortDirectionGroupKey: '',
              sortType: 'Manual',
              sortDirectionDisplayName: '',
            },
          ],
        }}
        statuses={appliedFilter.statuses}
        totalCount={200}
        view={view}
        visibilityClasses={appliedFilter.visibilityClasses}
      />
      {searchText && <span data-cy="search-text">{searchText}</span>}
      <span data-cy="isSeeThrough">{isSeeThrough ? 'See Through On' : 'See Through Off'}</span>
      <span data-cy="view">{view}</span>
      <button data-cy="reset-facet" onClick={() => {
        setFacets(undefined);
      }}>Reset facet</button>
    </div>
  );
};

describe('ControlBar', () => {
  beforeEach(() => {
    cy.mount(<ControlBarWrapper />);
    cy.waitForCustomElement('cx-space');
    cy.waitForCustomElement('cx-input');
    cy.waitForCustomElement('cx-dropdown');
    cy.waitForCustomElement('cx-tag');
    cy.waitForCustomElement('cx-icon-button');
  });

  it('Should render ControlBar component', () => {
    cy.get('cx-space').should('exist');
  });

  it('should call onSearchChange when search input changes', () => {
    cy.get('cx-input').shadow().find('input').type('test search');
    cy.get('cx-input').shadow().find('input').blur(); // Trigger blur event to simulate losing focus
    cy.get('[data-cy="search-text"]').should('contain', 'test search');
  });

  it('Should change isSeeThrough state when checkbox is clicked', () => {
    cy.get('cx-icon-button[data-cy="view-button"]').click();
    cy.get('cx-switch').click();
    cy.get('[data-cy="isSeeThrough"]').should('contain', 'See Through On');
  });

  it('Should remove filter when click the close icon', () => {
    cy.get('[data-cy="filter-button"]').click();
    cy.get('[data-cy="applied-filters"]').should('exist');
    cy.get('[data-cy="applied-filters"] cx-tag').eq(0).shadow().find('cx-icon-button[name="close"]').click();
    cy.get('[data-cy="applied-filters"]').find('cx-tag').contains('image').should('not.exist');
  });

  it('Should remove Published filter when click the close icon', () => {
    cy.get('[data-cy="filter-button"]').click();
    cy.get('[data-cy="applied-filters"] cx-tag').eq(1).shadow().find('cx-icon-button[name="close"]').click();
    cy.get('[data-cy="applied-filters"]').find('cx-tag').contains('Published').should('not.exist');
  });

  it('Should remove Not started filter when click the close icon', () => {
    cy.get('[data-cy="filter-button"]').click();
    cy.get('[data-cy="applied-filters"] cx-tag').eq(2).shadow().find('cx-icon-button[name="close"]').click();
    cy.get('[data-cy="applied-filters"]').find('cx-tag').contains('Not started').should('not.exist');
  });

  it('Should remove JPG filter when click the close icon', () => {
    cy.get('[data-cy="filter-button"]').click();
    cy.get('[data-cy="applied-filters"] cx-tag').eq(3).shadow().find('cx-icon-button[name="close"]').click();
    cy.get('[data-cy="applied-filters"]').find('cx-tag').contains('.jpg').should('not.exist');
  });

  it('Should remove Images filter when un-check', () => {
    cy.get('[data-cy="filter-button"]').click();
    cy.get('cx-tree-item[data-value="Images"]').click();
    cy.get('[data-cy="applied-filters"]').find('cx-tag').contains('images').should('not.exist');
  });

  it('Should add Videos filter when checked', () => {
    cy.get('[data-cy="filter-button"]').click();
    cy.get('cx-tree-item[data-value="Videos"]').click();
    cy.get('[data-cy="applied-filters"]').find('cx-tag').contains('videos').should('exist');
  });

  it('Should add Pending filter when checked', () => {
    cy.get('[data-cy="filter-button"]').click();
    cy.get('cx-tree-item[data-value="Pending"]').click();
    cy.get('[data-cy="applied-filters"]').find('cx-tag').contains('pending').should('exist');
  });

  it('Should add .jpeg filter when checked', () => {
    cy.get('[data-cy="filter-button"]').click();
    cy.get('cx-tree-item[data-value=".jpeg"]').click();
    cy.get('[data-cy="applied-filters"]').find('cx-tag').contains('.jpeg').should('exist');
  });

  it('Should add Completed filter when checked', () => {
    cy.get('[data-cy="filter-button"]').click();
    cy.get('cx-tree-item[data-value="Completed"]').click();
    cy.get('[data-cy="applied-filters"]').find('cx-tag').contains('completed').should('exist');
  });

  it('Should checked another sort order when click the sort order button', () => {
    cy.get('[data-cy="sort-button"]').click();
    cy.get('cx-menu-item[data-type="sort-order"]').eq(0).click();
    cy.get('cx-menu-item[data-type="sort-order"]').eq(0).should('have.class', 'selected');
  });

  it('Should checked another sort direction when click the sort direction button', () => {
    cy.get('[data-cy="sort-button"]').click();
    cy.get('cx-menu-item[data-type="sort-direction"]').eq(0).click();
    cy.get('cx-menu-item[data-type="sort-direction"]').eq(0).should('have.class', 'selected');
  });

  it('Should have --empty class when no filters applied', () => {
    cy.get('[data-cy="filter-button"]').click();
    cy.get('cx-button.clear-all-button').click();
    cy.get('cx-details').should('have.class', 'filter-details--empty');
  });

  it('Should not show any facets when faces is empty', () => {
    cy.get('[data-cy="filter-button"]').click();
    cy.get('cx-button.clear-all-button').click();
    cy.get('button[data-cy="reset-facet"]').click();
    cy.get('[data-cy="filter-button"]').click();
    cy.get('cx-tree-item').should('not.exist');
  });
});