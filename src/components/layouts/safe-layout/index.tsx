import { styling } from '@covid/themes';
import React from 'react';
import { SafeAreaView, StyleProp, ViewStyle } from 'react-native';

interface IProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

// Keep in mind that certain styling properties don't work on the SafeAreaView.
// For example setting a padding is ignored.

export default function SafeLayout(props: IProps) {
  return <SafeAreaView style={[styling.flex, props.style]}>{props.children}</SafeAreaView>;
}
