import { StatusBar, Dimensions} from 'react-native';

export const getMinWindowSize = (): number => Math.min(Dimensions.get('window').width, Dimensions.get('window').height);

export const getMinWindowSizeWithoutStatusBar = (): number => {
    let statusBarHeight = StatusBar.currentHeight;
    if (statusBarHeight === undefined) statusBarHeight = 0;
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const size = width > height ? height - statusBarHeight : width;
    return size;
}