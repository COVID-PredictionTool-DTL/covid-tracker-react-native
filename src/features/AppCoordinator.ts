import Analytics, { events } from '@covid/core/Analytics';
import assessmentCoordinator from '@covid/core/assessment/AssessmentCoordinator';
import { ConfigType } from '@covid/core/Config';
import { ConsentService, IConsentService } from '@covid/core/consent/ConsentService';
import { IContentService } from '@covid/core/content/ContentService';
import {
  fetchDismissedCallouts,
  fetchFeaturedContent,
  fetchLocalTrendLine,
  FetchLocalTrendlinePayload,
  fetchStartUpInfo,
  fetchUKMetrics,
} from '@covid/core/content/state/contentSlice';
import { Coordinator, IEditableProfile, ISelectProfile } from '@covid/core/Coordinator';
import { IDietScoreRemoteClient } from '@covid/core/diet-score/DietScoreApiClient';
import {
  homeScreenName,
  ILocalisationService,
  isGBCountry,
  isUSCountry,
  LocalisationService,
} from '@covid/core/localisation/LocalisationService';
import patientCoordinator from '@covid/core/patient/PatientCoordinator';
import { PatientData } from '@covid/core/patient/PatientData';
import { IPatientService } from '@covid/core/patient/PatientService';
import { Profile } from '@covid/core/profile/ProfileService';
import store from '@covid/core/state/store';
import { StartupInfo, UserResponse } from '@covid/core/user/dto/UserAPIContracts';
import { IUserService } from '@covid/core/user/UserService';
import dietStudyPlaybackCoordinator from '@covid/features/diet-study-playback/DietStudyPlaybackCoordinator';
import editProfileCoordinator from '@covid/features/multi-profile/edit-profile/EditProfileCoordinator';
import { ScreenParamList } from '@covid/features/ScreenParamList';
import NavigatorService from '@covid/NavigatorService';
import { lazyInject } from '@covid/provider/services';
import { Services } from '@covid/provider/services.types';
import { assessmentService } from '@covid/Services';
import { StackNavigationProp } from '@react-navigation/stack';

type ScreenName = keyof ScreenParamList;
type ScreenFlow = {
  [key in ScreenName]: () => void;
};

export type NavigationType = StackNavigationProp<ScreenParamList, keyof ScreenParamList>;

export class AppCoordinator extends Coordinator implements ISelectProfile, IEditableProfile {
  @lazyInject(Services.User)
  private readonly userService: IUserService;

  @lazyInject(Services.Patient)
  private readonly patientService: IPatientService;

  @lazyInject(Services.Content)
  contentService: IContentService;

  @lazyInject(Services.Consent)
  consentService: IConsentService;

  @lazyInject(Services.Localisation)
  localisationService: ILocalisationService;

  @lazyInject(Services.DietScore)
  dietScoreService: IDietScoreRemoteClient;

  navigation: NavigationType;

  patientData: PatientData;

  shouldShowCountryPicker: boolean = false;

  screenFlow: Partial<ScreenFlow> = {
    // added to make available to gotoNextscreen
    Anniversary: () => {
      NavigatorService.navigate('Anniversary');
    },

    ArchiveReason: () => {
      NavigatorService.navigate('SelectProfile'); // Go back to SelectProfile with last used params
    },

    Consent: () => {
      NavigatorService.navigate('Register');
    },

    Dashboard: () => {
      // UK only so currently no need to check config.enableMultiplePatients
      NavigatorService.navigate('SelectProfile', { assessmentFlow: true });
    },

    DashboardUS: () => {
      NavigatorService.navigate('SelectProfile', { assessmentFlow: true });
    },

    Login: () => {
      NavigatorService.reset([{ name: homeScreenName() }]);
    },

    OptionalInfo: () => {
      this.startPatientFlow(this.patientData);
    },

    Register: () => {
      const config = appCoordinator.getConfig();

      let askPersonalInfo = config.enablePersonalInformation;
      if (isUSCountry() && ConsentService.consentSigned.document !== 'US Nurses') {
        askPersonalInfo = false;
      }

      if (askPersonalInfo) {
        NavigatorService.replace('OptionalInfo');
      } else if (this.patientData) {
        this.startPatientFlow(this.patientData);
      } else {
        // eslint-disable-next-line no-console
        console.error('[ROUTE] Missing patientId parameter for gotoNextPage(Register)');
      }
    },

    Splash: () => {
      if (this.userService.hasUser && this.patientData && this.shouldShowCountryPicker) {
        NavigatorService.replace('CountrySelect', {
          onComplete: () => {
            NavigatorService.replace(homeScreenName());
          },
        });
      } else if (this.userService.hasUser && this.patientData) {
        NavigatorService.replace(homeScreenName());
      } else {
        NavigatorService.replace('Welcome');
      }
    },

    WelcomeRepeat: () => {
      const config = this.getConfig();
      if (config.enableMultiplePatients) {
        NavigatorService.navigate('SelectProfile', { assessmentFlow: true });
      } else {
        this.startAssessmentFlow(this.patientData);
      }
    },
  };

  async init(setUsername: (username: string) => void, setPatients: (patients: string[]) => void) {
    let user: UserResponse | null = null;
    let patientId: string | null = null;

    await this.userService.loadUser();

    if (this.userService.hasUser) {
      user = await this.userService.getUser();
      patientId = user?.patients[0] ?? null;
      setUsername(user?.username ?? '');
      setPatients(user?.patients ?? []);
    }

    if (patientId && user) {
      this.patientData = await this.patientService.getPatientDataById(patientId);
      this.shouldShowCountryPicker = user!.country_code !== LocalisationService.userCountry;
    }

    await this.fetchInitialData();

    const { startupInfo } = store.getState().content;

    if (startupInfo?.app_requires_update) {
      this.goToVersionUpdateModal();
    }

    // Setup Amplitude analytics
    if (startupInfo?.mh_insight_cohort) {
      // Identity Mental Health Insights experiment cohort
      Analytics.identify({
        Experiment_mhip: startupInfo.mh_insight_cohort,
      });
    } else {
      Analytics.identify();
    }

    if (this.shouldShowCountryPicker) {
      Analytics.track(events.MISMATCH_COUNTRY_CODE, { current_country_code: LocalisationService.userCountry });
    }
  }

  async fetchInitialData(): Promise<void> {
    await store.dispatch(fetchStartUpInfo());
    await store.dispatch(fetchDismissedCallouts());
    await store.dispatch(fetchFeaturedContent());
    if (isGBCountry()) {
      await store.dispatch(fetchUKMetrics());
    }
  }

  getConfig(): ConfigType {
    return this.localisationService.getConfig();
  }

  resetToProfileStartAssessment() {
    NavigatorService.navigate('SelectProfile', { assessmentFlow: true });
    this.startAssessmentFlow(this.patientData);
  }

  startPatientFlow(patientData: PatientData) {
    patientCoordinator.init(this, patientData, this.userService);
    patientCoordinator.startPatient();
  }

  async startAssessmentFlow(patientData: PatientData) {
    // TODO: Does not need to be async
    assessmentCoordinator.init(this, { patientData }, assessmentService);
    assessmentCoordinator.startAssessment();
  }

  async startEditProfile(profile: Profile) {
    await this.setPatientByProfile(profile);

    editProfileCoordinator.init(this.patientData, this.userService);
    editProfileCoordinator.startEditProfile();
  }

  async startEditLocation(profile: Profile, patientData?: PatientData) {
    if (!patientData) await this.setPatientByProfile(profile);
    editProfileCoordinator.init(patientData ?? this.patientData, this.userService);
    editProfileCoordinator.goToEditLocation();
  }

  async profileSelected(profile: Profile) {
    await this.setPatientByProfile(profile);
    this.startAssessmentFlow(this.patientData);
  }

  async setPatientById(patientId: string) {
    this.patientData = await this.patientService.getPatientDataById(patientId);
  }

  async setPatientByProfile(profile: Profile) {
    this.patientData = await this.patientService.getPatientDataByProfile(profile);
  }

  async setPatientToPrimary() {
    const user = await this.userService.getUser();
    const patientId = user?.patients[0] ?? null;

    if (patientId) {
      await this.setPatientById(patientId);
    }
  }

  goToVersionUpdateModal() {
    NavigatorService.navigate('VersionUpdateModal');
  }

  async goToDietStudy() {
    // Reset the current PatientData to the primary user.
    // We can get here if by viewing DietScores after reporting from a secondary profile
    if (this.patientData.patientState.isReportedByAnother) {
      await this.setPatientToPrimary();
    }
    dietStudyPlaybackCoordinator.init(this, this.patientData, this.contentService, this.dietScoreService);
    NavigatorService.navigate('DietStudy');
  }

  goToArchiveReason(patientId: string) {
    NavigatorService.navigate('ArchiveReason', { patientId });
  }

  goToPreRegisterScreens() {
    if (isUSCountry()) {
      NavigatorService.navigate('BeforeWeStartUS');
    } else {
      NavigatorService.navigate('Consent', { viewOnly: false });
    }
  }

  goToResetPassword() {
    NavigatorService.navigate('ResetPassword');
  }

  goToCreateProfile(avatarName: string) {
    NavigatorService.navigate('CreateProfile', { avatarName });
  }

  goToTrendline(lad?: string) {
    NavigatorService.navigate('Trendline', { lad });
  }

  async shouldShowTrendLine(): Promise<boolean> {
    const { startupInfo } = store.getState().content;

    // Check feature flag (BE should check does user have LAD, is missing LAD will return false)
    if (startupInfo && !startupInfo.show_trendline) {
      return false;
    }

    if (!startupInfo?.local_data?.lad) {
      return false;
    }

    // Check does local trendline has enough data
    try {
      const result = await store.dispatch(fetchLocalTrendLine());

      // TODO: Warning this is not typed. Need to look into typing with async thunk
      const { localTrendline } = result.payload as FetchLocalTrendlinePayload;

      // Double check local trendline results
      if (!result || !localTrendline) {
        return false;
      }

      return !!localTrendline.timeseries && localTrendline.timeseries?.length > 0;
    } catch (error) {
      return false;
    }
  }

  goToMentalHealthStudy() {
    NavigatorService.navigate('MentalHealthChanges');
  }

  goToMentalHealthStudyPlayback(startupInfo: StartupInfo | undefined) {
    if (startupInfo?.mh_insight_cohort === 'MHIP-v1-cohort_c') {
      NavigatorService.navigate('MentalHealthPlaybackBlogPost');
    } else {
      NavigatorService.navigate('MentalHealthPlaybackIntroduction');
    }
  }

  goToMentalHealthModal() {
    NavigatorService.navigate('MentalHealthModal');
  }

  goToAnniversary() {
    NavigatorService.navigate('Anniversary');
  }
}

const appCoordinator = new AppCoordinator();
export default appCoordinator;
