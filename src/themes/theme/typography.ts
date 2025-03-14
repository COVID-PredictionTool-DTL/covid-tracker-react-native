import { ITextClass, TFontFamily, TText, TTypeSizes } from '@covid/themes/types/typography';

const getTextProperties = (
  fontSize: TTypeSizes,
  lineHeight: TTypeSizes,
  fontFamily: TFontFamily = 'SofiaProRegular',
): TText => {
  return {
    fontFamily,
    fontSize,
    fontStyle: 'normal',
    letterSpacing: 0,
    lineHeight,
    textAlign: 'left',
    textDecorationLine: 'none',
  };
};

export const text: ITextClass = {
  button: {
    fontFamily: 'SofiaPro-Bold',
    fontSize: 16,
    fontStyle: 'normal',
    letterSpacing: 1,
    lineHeight: 16,
    textAlign: 'center',
    textDecorationLine: 'none',
  },
  default: getTextProperties(16, 24),
  h0: getTextProperties(40, 48),
  h1: getTextProperties(32, 48, 'SofiaPro-Light'),
  h1Regular: getTextProperties(32, 48),
  h2: getTextProperties(28, 40),
  h3: getTextProperties(24, 32, 'SofiaPro-Medium'),
  h3Bold: getTextProperties(24, 32, 'SofiaPro-SemiBold'),
  h3Regular: getTextProperties(24, 32),
  h4: getTextProperties(20, 24),
  h4Light: getTextProperties(20, 24, 'SofiaPro-Light'),
  h4Medium: getTextProperties(20, 24, 'SofiaPro-Medium'),
  h5: getTextProperties(18, 24, 'SofiaPro-SemiBold'),
  h5Light: getTextProperties(18, 24, 'SofiaPro-Light'),
  h5Medium: getTextProperties(18, 24, 'SofiaPro-Medium'),
  h5Regular: getTextProperties(18, 24),
  h6: getTextProperties(12, 16, 'SofiaPro-SemiBold'),
  h6Light: getTextProperties(12, 16, 'SofiaPro-Light'),
  h6Medium: getTextProperties(12, 16, 'SofiaPro-Medium'),
  h6Regular: getTextProperties(12, 16),
  label: getTextProperties(10, 12),
  p: getTextProperties(16, 24),
  pBold: getTextProperties(16, 24, 'SofiaPro-SemiBold'),
  pLight: getTextProperties(16, 24, 'SofiaPro-Light'),
  pMedium: getTextProperties(16, 24, 'SofiaPro-Medium'),
  pSmall: getTextProperties(14, 20),
  pSmallBold: getTextProperties(14, 20, 'SofiaPro-SemiBold'),
  pSmallLight: getTextProperties(14, 20, 'SofiaPro-Light'),
  pXSmall: getTextProperties(12, 16),
  pXSmallMedium: getTextProperties(12, 16, 'SofiaPro-Medium'),
};
