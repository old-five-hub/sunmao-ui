import React, { useCallback } from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import { Switch } from '@chakra-ui/react';
import { CORE_VERSION, BOOLEAN_FIELD_WIDGET_NAME } from '@sunmao-ui/shared';

export const BooleanField: React.FC<WidgetProps> = props => {
  const { value, onChange } = props;
  const onValueChange = useCallback(
    event => {
      onChange(event.currentTarget.checked);
    },
    [onChange]
  );

  return <Switch isChecked={value} onChange={onValueChange} />;
};

export default implementWidget({
  version: CORE_VERSION,
  metadata: {
    name: BOOLEAN_FIELD_WIDGET_NAME,
  },
})(BooleanField);
