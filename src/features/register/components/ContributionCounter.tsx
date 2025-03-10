import { RegularBoldText, RegularText } from '@covid/components/Text';
import { ITest } from '@covid/components/types';
import { ILocalisationService } from '@covid/core/localisation/LocalisationService';
import i18n from '@covid/locale/i18n';
import { useInjection } from '@covid/provider/services.hooks';
import { Services } from '@covid/provider/services.types';
import { colors } from '@theme';
import I18n from 'i18n-js';
import React from 'react';
import { StyleSheet } from 'react-native';
import reactStringReplace from 'react-string-replace';

interface IProps extends ITest {
  variant: number;
  count: number | null;
}

export function ContributionCounter(props: IProps) {
  const localisationService = useInjection<ILocalisationService>(Services.Localisation);

  if (props.count) {
    const features = localisationService.getConfig();
    const delimiter = features ? features.thousandSeparator : ',';

    const countValue = I18n.toNumber(props.count, { delimiter, precision: 0 });
    return props.variant === 1 ? (
      <RegularText style={styles.contributingText}>
        {reactStringReplace(
          i18n.t('join-total-people-contributing', { total: '{{TOTAL}}' }),
          '{{TOTAL}}',
          (match, i) => (
            <RegularBoldText key={i} style={styles.contributingTextValue}>
              {countValue}
            </RegularBoldText>
          ),
        )}
      </RegularText>
    ) : props.variant === 2 ? (
      <RegularText style={styles.contributingText2}>
        {reactStringReplace(i18n.t('total-people-contributing', { total: '{{TOTAL}}' }), '{{TOTAL}}', (match, i) => (
          <RegularBoldText key={i} style={styles.contributingTextValue2}>
            {countValue}
          </RegularBoldText>
        ))}
      </RegularText>
    ) : null;
  }
  return null;
}

const styles = StyleSheet.create({
  contributingText: {
    color: colors.lightBrand,
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
  },
  contributingText2: {
    color: colors.lightBrand,
    fontSize: 14,
    lineHeight: 32,
    marginTop: 16,
    textAlign: 'center',
  },
  contributingTextValue: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
  },
  contributingTextValue2: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 32,
    textAlign: 'center',
  },
});
