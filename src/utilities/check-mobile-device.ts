import { Dimensions } from 'react-native';

export const isIphone16ProMax = () => {
    return Dimensions.get('window').height === 956 ? true : false;
}

export const isIphone16Pro = () => {
    return Dimensions.get('window').height === 874 ? true : false;
}

export const isIphoneSE = () => {
    return Dimensions.get('window').height === 667 ? true : false;
}

export const isIphone13Mini = () => {
    return Dimensions.get('window').height === 812 ? true : false;
}