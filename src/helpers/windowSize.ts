import { StatusBar, Dimensions} from 'react-native';

export const getMinWindowSize = (): number => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    return Math.min(width, height);
}

export const getMinWindowSizeWithoutStatusBar = (): number => {
    let statusBarHeight = StatusBar.currentHeight;
    if (statusBarHeight === undefined) statusBarHeight = 0;
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const size = width > height ? height - statusBarHeight : width;
    return size;
}