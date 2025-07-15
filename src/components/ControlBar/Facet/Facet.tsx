import LoadMoreButton from '@/components/Browser/LoadMoreButton';
import { FC, useMemo, useState } from 'react';

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
    return values.reduce((acc, { value: key, displayValue: value }) => {
      acc[key] = value;

      return acc;
    }, {} as Record<string, string>);
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
                  <cx-tree-item
                    key={key}
                    data-value={key}
                    data-type={type}
                    readonly={loading}
                    selected={selected}
                    partial-sync-checkboxes={totalCount < all ? true : undefined}
                  >
                    {mappedDisplayNames[key]} {!!all && `(${all})`}
                    {Object.entries(rest).map(([subtype, count]) => (
                      <cx-tree-item
                        key={subtype}
                        data-value={`${key}>>${subtype}`}
                        data-type={type}
                        readonly={loading}
                        selected={collections.includes(`${key}>>${subtype}`)}
                      >
                        {mappedDisplayNames[`${key}>>${subtype}`]} ({count})
                      </cx-tree-item>
                    ))}
                  </cx-tree-item>
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
