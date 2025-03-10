import { IDietStudy, TDietStudyConsent } from '@covid/core/state/diet-study/types';
import { RootState } from '@covid/core/state/root';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IDietStudy = {
  consent: undefined,
};

const dietStudySlice = createSlice({
  initialState,
  name: 'DietStudyState',
  reducers: {
    setDietStudyConsent: (state, action: PayloadAction<TDietStudyConsent>) => {
      return {
        ...state,
        consent: action.payload,
      };
    },
  },
});

export const { setDietStudyConsent } = dietStudySlice.actions;
export const selectDietStudy = (state: RootState) => state.dietStudy;
export default dietStudySlice.reducer;
