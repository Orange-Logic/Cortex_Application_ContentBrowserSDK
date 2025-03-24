import { FC } from 'react';

type Props = {
  values: { key: string; value: string }[];
  onChange: (values: { key: string; value: string }[]) => void;
};

const TrackingParameters: FC<Props> = ({
  values,
  onChange,
}) => {
  const addParameter = () => {
    onChange([...values, { key: '', value: '' }]);
  };

  const removeParameter = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const updateParameter = (index: number, key: string, value: string) => {
    const newParameters = [...values];
    newParameters[index] = { key, value };
    onChange(newParameters);
  };

  return (
    <cx-space direction="vertical" spacing="medium" className="dialog__tracking">
      {values.map((param, index) => (
        <cx-space key={index} spacing="small" wrap="nowrap" align-items="center">
          <cx-input-group>
            <cx-input
              label="Key"
              size="small"
              value={param.key}
              onInput={(e) => updateParameter(index, (e.target as HTMLInputElement).value, param.value)}
            ></cx-input>
            <cx-input
              label="Value"
              size="small"
              value={param.value}
              onInput={(e) => updateParameter(index, param.key, (e.target as HTMLInputElement).value)}
            ></cx-input>
          </cx-input-group>
          <cx-icon-button
            name="close"
            onClick={() => removeParameter(index)}
          ></cx-icon-button>
        </cx-space>
      ))}
      <cx-button variant="neutral" onClick={addParameter}>
        <cx-icon slot="prefix" name="add"></cx-icon>
        Add parameter
      </cx-button>
    </cx-space>
  );
};


export default TrackingParameters;