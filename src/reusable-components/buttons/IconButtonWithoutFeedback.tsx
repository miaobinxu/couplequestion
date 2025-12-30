import React from 'react';
import {
    TouchableWithoutFeedback,
    Text,
    StyleSheet,
    View,
    ViewStyle,
    TextStyle,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { scaleFont, scaleWidth } from '@utilities/responsive-design';

interface IconButtonWithoutFeedbackProps {
    width?: number;
    backgroundColor?: string;
    text: string;
    textColor?: string;
    fontFamily?: string;
    fontSize?: number;
    marginTop?: number;
    onPress?: () => void;
    viewStyle?: ViewStyle;
    textStyle?: TextStyle;
    icon: React.ReactNode | null;
}

const IconButtonWithoutFeedback: React.FC<IconButtonWithoutFeedbackProps> = React.memo(({
    width = scaleWidth(362),
    backgroundColor = '#f8fcfa',
    text,
    textColor = '#121212',
    fontFamily = 'HelveticaRegular',
    fontSize = scaleFont(17),
    marginTop = hp(3),
    onPress,
    viewStyle,
    textStyle,
    icon,
}) => {

    const isIconNull = icon === null;

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View
                style={[
                    styles.button,
                    {
                        width,
                        backgroundColor,
                        marginTop,
                    },
                    viewStyle,
                ]}
            >
                <View
                    style={[
                        styles.contentRow,
                        isIconNull && { justifyContent: 'flex-start' },
                    ]}
                >
                    {icon !== null && (
                        <View style={styles.iconContainer}>
                            {icon}
                        </View>
                    )}
                    <View
                        style={[
                            styles.textContainer,
                            isIconNull && { marginLeft: hp(1) },
                        ]}
                    >
                        <Text
                            style={[
                                styles.text,
                                {
                                    color: textColor,
                                    fontFamily,
                                    fontSize,
                                },
                                textStyle,
                            ]}
                        >
                            {text}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
});

const styles = StyleSheet.create({
    button: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        height: hp(8),
        paddingHorizontal: wp(3),
    },
    iconContainer: {
        width: wp(10),
        justifyContent: 'center',
        alignItems: 'center',
        height: hp(8),
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        height: hp(8),
        marginLeft: wp(1),
    },
    text: {
        textAlignVertical: 'center',
    },
});

export default IconButtonWithoutFeedback;
