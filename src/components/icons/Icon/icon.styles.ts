import styled from '@covid/themes/styled-components';
import { View } from 'react-native';

import IconSet from './IconSet';

interface IIconSetProps {
  color: string;
  disabled: boolean | undefined;
  inverted: boolean;
}

export const SIconSet = styled(IconSet)<IIconSetProps>`
  ${(props) => `
    color: ${props.color};
    textAlign: center;
  `}
`;

interface IIconViewProps {
  size: number;
}

export const SIconView = styled(View)<IIconViewProps>`
  ${(props) => `
    height: ${props.size + 2}px;
    width: ${props.size + 2}px;
    align-Items: center;
    justifyContent: center;
  `}
`;
