import LoadMoreButton from '@/components/Browser/LoadMoreButton';
import { CxTreeItem } from '@orangelogic-private/design-system';
import { FC, useMemo, useRef, useState } from 'react';

const ITEMS_PER_PAGE = 20;

type Props = {
  values: {
    count: number;
    displayValue: string;
    value: string;
  }[];
  type: string;
  displayName: string;
  collections: string[];
  loading?: boolean;
};

const FacetTreeItemWithSubtypes: FC<{
  itemKey: string;
  type: string;
  loading: boolean;
  selected: boolean;
  all: number;
  rest: Record<string, number>;
  mappedDisplayNames: Record<string, string>;
  collections: string[];
  partialSyncCheckbox?: boolean;
}> = ({
  itemKey,
  type,
  loading,
  selected: originalSelected,
  all,
  rest,
  mappedDisplayNames,
  collections,
  partialSyncCheckbox,
}) => {
  const ref = useRef<CxTreeItem>(null);

  const selected = useMemo(() => {
    const treeItem = ref.current;

    if (!treeItem) {
      return;
    }

    const hasSelectedChildren = Object.keys(rest).some(subtype => collections.includes(`${itemKey}>>${subtype}`));

    if (!originalSelected && !hasSelectedChildren) {
      treeItem.previouslySelected = false;
      treeItem.indeterminate = false;
      return false;
    } else if (hasSelectedChildren) {
      treeItem.indeterminate = true;
      return false;
    }
    return true;
  }, [originalSelected, collections, rest, itemKey]);

  return (
    <cx-tree-item
      ref={ref}
      data-value={itemKey}
      data-type={type}
      readonly={loading}
      selected={selected}
      partial-sync-checkboxes={partialSyncCheckbox}
    >
      {mappedDisplayNames[itemKey]} {!!all && `(${all})`}
      {Object.entries(rest).map(([subtype, count]) => (
        <cx-tree-item
          key={subtype}
          data-value={`${itemKey}>>${subtype}`}
          data-type={type}
          readonly={loading}
          selected={collections.includes(`${itemKey}>>${subtype}`)}
        >
          {mappedDisplayNames[`${itemKey}>>${subtype}`]} ({count})
        </cx-tree-item>
      ))}
    </cx-tree-item>
  );
};

const Facet: FC<Props> = ({
  values,
  type,
  displayName,
  collections,
  loading = false,
}) => {
  const [page, setPage] = useState(1);

  /* 
    The current facet value is flat. If a facet includes the ">>" character, it means it's a subtype, and the parent type is the value before ">>". We need to group them.
    For example, "contact >> email", "contact >> phone", and "contact >> address" should be grouped as "contact" => { email: 10, phone: 5, address: 3 }
    The "all" key will contain the total count of all subtypes for that parent type.
    Sometimes there are some asset belongs to the parent type but not to any subtype. In that case, we need to add the parent type to the result as well.
    For example, "contact" => { all: 12, email: 5, phone: 3 } means that 5 of them are emails, 3 are phones, and 2 are just contacts that are directly of the parent's type.
  */

  const mappedSubtypes = useMemo(() => {
    return values.reduce((acc, { value: key, count: value }) => {
      const [parent, subtype] = key.split('>>');

      if (!acc[parent] || typeof acc[parent] !== 'object') {
        if (acc[parent]) {
          acc[parent] = {
            all: acc[parent],
          };
        } else {
          acc[parent] = {};
        }
      }
      if (subtype) {
        acc[parent][subtype] = value;
      }
      acc[parent].all = (acc[parent].all || 0) + value;

      return acc;
    }, {} as Record<string, Record<string, number> | number>);
  }, [values]);

  const mappedDisplayNames = useMemo(() => {
    const acc: Record<string, string> = {};
    values.forEach((facetName) => {
      acc[facetName.value] = facetName.displayValue;
    });
    // iterate through the values again, spliting them by ">>" and checking if the parent is already in the acc
    values.forEach((facetName) => {
      const parts = facetName.value.split('>>');
      if (parts.length > 1) {
        // For multi-level hierarchies, get the immediate parent (everything except the last part)
        const parent = parts.slice(0, -1).join('>>');
        if (!acc[parent]) {
          acc[parent] = parent.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
      }
    });
    return acc;
  }, [values]);

  const hasNextPage = useMemo(
    () => Object.keys(mappedSubtypes).length > page * ITEMS_PER_PAGE,
    [mappedSubtypes, page],
  );

  if (values.length === 0) {
    return null;
  }

  return (
    <cx-details open className="filter-details">
      <cx-space
        slot="summary"
        align-items="center"
        spacing="x-small"
        wrap="nowrap"
      >
        <span>{displayName}</span>
        {loading && <cx-spinner></cx-spinner>}
      </cx-space>
      <cx-space direction="vertical">
        <cx-tree selection="multiple" label-select-single data-facet={type}>
          {Object.entries(mappedSubtypes)
            .slice(0, page * ITEMS_PER_PAGE)
            .map(([key, value]) => {
              if (typeof value === 'object') {
                const selected = collections.includes(key);

                const { all, ...rest } = value;

                const totalCount = Object.values(rest).reduce(
                  (sum, count) => sum + count,
                  0,
                );

                return (
                  <FacetTreeItemWithSubtypes
                    key={key}
                    itemKey={key}
                    type={type}
                    loading={loading}
                    selected={selected}
                    all={all}
                    rest={rest}
                    mappedDisplayNames={mappedDisplayNames}
                    collections={collections}
                    partialSyncCheckbox={
                      totalCount < all ? true : undefined
                    }
                  />
                );
              }
              return (
                <cx-tree-item
                  key={key}
                  data-value={key}
                  data-type={type}
                  readonly={loading}
                  selected={collections.includes(key)}
                >
                  {mappedDisplayNames[key]} ({value})
                </cx-tree-item>
              );
            })}
          {hasNextPage && (
            <LoadMoreButton
              loadMore={() => setPage((prev) => prev + 1)}
              isLoading={loading}
              disabled={loading}
            />
          )}
        </cx-tree>
      </cx-space>
    </cx-details>
  );
};

export default Facet;
