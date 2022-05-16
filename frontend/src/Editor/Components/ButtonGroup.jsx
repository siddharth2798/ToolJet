import React, { useEffect, useState } from 'react';

export const ButtonGroup = function Button({ height, properties, styles, fireEvent, setExposedVariable }) {
  const { values, labels, label, defaultSelected, multiSelection } = properties;
  const {
    backgroundColor,
    textColor,
    borderRadius,
    visibility,
    disabledState,
    selectedBackgroundColor,
    selectedTextColor,
  } = styles;

  const computedStyles = {
    backgroundColor,
    color: textColor,
    borderRadius: `${borderRadius}px`,
    display: visibility ? '' : 'none',
  };

  const [defaultActive, setDefaultActive] = useState(defaultSelected);
  const [data, setData] = useState(
    values?.length <= labels?.length ? [...labels, ...values?.slice(labels?.length)] : labels
  );
  // data is used as state to show what to display , club of label+values / values
  useEffect(() => {
    setDefaultActive(defaultSelected);
  }, [defaultSelected]);

  useEffect(() => {
    if (labels?.length < values?.length) {
      setData([...labels, ...values?.slice(labels?.length)]);
    } else {
      setData(labels);
    }
  }, [labels, values]);

  useEffect(() => {
    multiSelection && setDefaultActive([]);
  }, [multiSelection]);

  useEffect(() => {
    return () => {
      console.log('fed', defaultActive, data);
    };
  }, [defaultActive, data]);

  useEffect(() => {
    console.log('value len', values.length);
    if (values.length == 0) {
      setData([]);
    }
  }, [values]);

  const buttonClick = (index) => {
    if (defaultActive?.includes(values[index]) && multiSelection) {
      const copyDefaultActive = defaultActive;
      console.log('copy', copyDefaultActive);
      copyDefaultActive?.splice(copyDefaultActive?.indexOf(values[index]), 1);
      console.log('copy', copyDefaultActive);
      setDefaultActive(copyDefaultActive);
      setExposedVariable('selected', copyDefaultActive.join(',')).then(() => fireEvent('onClick'));
    } else if (multiSelection) {
      setExposedVariable('selected', [...defaultActive, values[index]].join(',')).then(() => fireEvent('onClick'));
      setDefaultActive([...defaultActive, values[index]]);
    } else if (!multiSelection) {
      setExposedVariable('selected', [values[index]]).then(() => fireEvent('onClick'));
      setDefaultActive([values[index]]);
    }
    if (values?.length == 0) {
      console.log('running');
      setExposedVariable('selected', []).then(() => fireEvent('onClick'));
    }
  };
  return (
    <div className="widget-buttongroup" style={{ height }}>
      <p className="widget-buttongroup-label">{label}</p>
      <div>
        {data?.map((item, index) => (
          <button
            style={{
              ...computedStyles,
              backgroundColor: defaultActive?.includes(values[index]) ? selectedBackgroundColor : backgroundColor,
              color: defaultActive?.includes(values[index]) ? selectedTextColor : textColor,
              transition: 'all .1s ease',
            }}
            key={item}
            disabled={disabledState}
            className={'group-button overflow-hidden'}
            onClick={(event) => {
              event.stopPropagation();
              buttonClick(index);
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};