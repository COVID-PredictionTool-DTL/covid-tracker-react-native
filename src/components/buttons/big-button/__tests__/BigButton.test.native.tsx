import { BigButton } from '@covid/components';
import React from 'react';
import renderer from 'react-test-renderer';

describe('Button', () => {
  it('should match snapshot', () => {
    const component = renderer.create(<BigButton onPress={() => {}}>Button Text</BigButton>);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
