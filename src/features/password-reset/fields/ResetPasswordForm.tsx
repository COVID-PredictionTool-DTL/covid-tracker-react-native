import { BrandedButton } from '@covid/components';
import { ErrorText, HeaderText } from '@covid/components/Text';
import { ValidatedTextInput } from '@covid/components/ValidatedTextInput';
import i18n from '@covid/locale/i18n';
import { Form } from 'native-base';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface IResetPasswordForm {
  values: {
    email: string;
  };
  touched: {
    email?: boolean;
  };
  errors: {
    email?: string;
  };
  errorMessage?: string;
  handleChange: (field: string) => (text: string) => void;
  handleBlur: (field: string) => () => void;
  handleSubmit: () => void;
}

function ResetPasswordForm({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  errorMessage,
}: IResetPasswordForm) {
  return (
    <View>
      <View style={styles.formItem}>
        <HeaderText>{i18n.t('reset-password.title')}</HeaderText>
        <Form>
          <ValidatedTextInput
            autoCapitalize="none"
            autoCompleteType="email"
            error={touched.email && errors.email}
            keyboardType="email-address"
            onBlur={handleBlur('email')}
            onChangeText={handleChange('email')}
            placeholder={i18n.t('reset-password.email-label')}
            returnKeyType="go"
            value={values.email}
          />

          {touched.email && errors.email ? <ErrorText> {i18n.t('reset-password.email-error')}</ErrorText> : null}
        </Form>
      </View>
      <View>
        <ErrorText>{errorMessage}</ErrorText>
      </View>

      <View>
        <BrandedButton onPress={handleSubmit}>{i18n.t('reset-password.button')}</BrandedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formItem: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
});

export default React.memo(ResetPasswordForm);
