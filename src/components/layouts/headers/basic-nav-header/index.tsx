import { RoundIconButton } from '@covid/components/buttons';
import { useTheme } from '@covid/themes';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface IProps {
  backgroundColor?: string;
  children?: React.ReactNode;
  paddingHorizontal?: number;
  style?: StyleProp<ViewStyle>;
}

export default function BasicNavHeader(props: IProps) {
  const { goBack } = useNavigation();
  const { colors, grid } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: props.backgroundColor ?? 'transparent',
          paddingBottom: grid.m,
          paddingHorizontal: props.paddingHorizontal ?? grid.gutter,
          paddingTop: grid.l,
        },
        props.style,
      ]}
    >
      <View style={styles.row}>
        <View style={styles.flex}>
          <RoundIconButton
            backgroundColor={colors.ui.dark.bgColor}
            iconColor="black"
            iconName="arrow_back_ios"
            iconStyle={styles.icon}
            onPress={() => goBack()}
          />
        </View>
        {props.children ? <View>{props.children}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  icon: {
    transform: [{ translateX: 4 }],
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
