import { TColorPalette, TColorShade, TGridSizes } from '@covid/themes';
import styled from '@covid/themes/styled-components';
import { TouchableOpacity } from 'react-native';

interface SProps {
  colorPalette: TColorPalette;
  colorShade: TColorShade;
  disabled: boolean;
  outline: boolean;
  rhythm: TGridSizes;
  simple: boolean;
}

export const STouchableOpacity = styled(TouchableOpacity)<SProps>`
  ${(props) => `
    align-items: center;
    background-color: ${
      props.outline || props.simple ? 'transparent' : props.theme.colors[props.colorPalette][props.colorShade].bgColor
    };
    border-color: ${
      props.outline && !props.simple ? props.theme.colors[props.colorPalette][props.colorShade].bgColor : 'transparent'
    };
    border-radius: ${props.theme.grid.xl}px;
    justify-content: center;
    margin-bottom: ${props.rhythm}px;
    padding: ${props.theme.grid.s}px ${props.theme.grid.l}px;
  `}
`;
