import _capitalize from 'lodash-es/capitalize';
import { FC } from 'react';

type Props = {
  facet: Record<string, number>;
  type: string;
  displayName: string;
  collections: string[];
  capitalize?: boolean;
  loading?: boolean;
};

const Facet: FC<Props> = ({
  facet,
  type,
  displayName,
  collections,
  capitalize = true,
  loading = false,
}) => {
  if (!facet || Object.values(facet).length === 0) {
    return null;
  }

  // The current facet value is flat. If a facet includes the ">>" character, it means it's a subtype, and the parent type is the value before ">>". We need to group them.
  // For example, "contact >> email", "contact >> phone", and "contact >> address" should be grouped as "contact" => { email: 10, phone: 5, address: 3 }
  const mappedSubtypes = Object.entries(facet).reduce((acc, [key, value]) => {
    const [parent, subtype] = key.split('>>');
    if (subtype) {
      if (!acc[parent]) {
        acc[parent] = {};
      }
      (acc[parent] as Record<string, number>)[subtype] = value;
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, Record<string, number> | number>);
  
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
        <cx-tree selection="multiple" data-facet={type}>
          {Object.entries(mappedSubtypes).map(([key, value]) => {
            if (typeof value === 'object') {
              const selected = collections.includes(key);

              return (
                <cx-tree-item
                  key={key}
                  data-value={key}
                  data-type={type}
                  readonly={loading}
                  selected={selected}
                >
                  {capitalize ? _capitalize(key) : key}
                  {Object.entries(value).map(([subtype, count]) => (
                    <cx-tree-item
                      key={subtype}
                      data-value={`${key}>>${subtype}`}
                      data-type={type}
                      readonly={loading}
                      selected={collections.includes(`${key}>>${subtype}`)}
                    >
                      {capitalize ? _capitalize(subtype) : subtype} ({count})
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
                {capitalize ? _capitalize(key) : key} ({value})
              </cx-tree-item>
            );
          })}
        </cx-tree>
      </cx-space>
    </cx-details>
  );
};

export default Facet;