import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

function useFade(from: number, toValue: number, duration: number) {
  const fade = useRef(new Animated.Value(from)).current;
  const fadeAnim = () => {
    Animated.timing(fade, {
      duration,
      toValue,
      useNativeDriver: true,
    }).start();
  };

  useEffect(fadeAnim);

  return fade;
}

export default useFade;
