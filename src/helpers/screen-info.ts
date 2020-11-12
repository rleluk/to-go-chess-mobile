import { Dimensions } from 'react-native';

export const getMinWindowSize = (): number => Math.min(Dimensions.get('window').width, Dimensions.get('window').height);

export const getMaxWindowSize = (): number => Math.max(Dimensions.get('window').width, Dimensions.get('window').height);

export const getOrientation = (): string => Dimensions.get('window').width  > Dimensions.get('window').height ? 'landscape' : 'portrait';