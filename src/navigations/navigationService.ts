// navigationService.ts
import { createNavigationContainerRef , CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function resetRootToLogin() {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Loginotp' }],
        })
      );
    }
  }