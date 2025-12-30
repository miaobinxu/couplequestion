import React from 'react';
import {
    TouchableWithoutFeedback,
    Text,
    StyleSheet,
    View,
    ViewStyle,
    TextStyle,
    Platform,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { scaleFont, scaleWidth } from '@utilities/responsive-design';

interface LabelDescriptionButtonWithoutFeedbackProps {
    width?: number;
    backgroundColor?: string;
    label: string;
    description: string;
    textColor?: string;
    labelFontFamily?: string;
    descriptionFontFamily?: string;
    labelFontSize?: number;
    descriptionFontSize?: number;
    marginTop?: number;
    onPress?: () => void;
    viewStyle?: ViewStyle;
    textStyle?: TextStyle;
}

const LabelDescriptionButtonWithoutFeedback: React.FC<LabelDescriptionButtonWithoutFeedbackProps> = React.memo(({
    width = scaleWidth(362),
    backgroundColor = '#f8fcfa',
    label,
    description,
    textColor = '#121212',
    labelFontFamily = 'HelveticaBold',
    descriptionFontFamily = 'HelveticaRegular',
    labelFontSize = scaleFont(17),
    descriptionFontSize = scaleFont(14),
    marginTop = hp(3),
    onPress,
    viewStyle,
    textStyle,
}) => {
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
                <View style={styles.contentColumn}>
                    <Text
                        style={[
                            styles.text,
                            {
                                color: textColor,
                                fontFamily: labelFontFamily,
                                fontSize: labelFontSize,
                            },
                            textStyle,
                        ]}
                    >
                        {label}
                    </Text>
                    <Text
                        style={[
                            styles.text,
                            {
                                color: textColor,
                                fontFamily: descriptionFontFamily,
                                fontSize: descriptionFontSize,
                                marginTop: Platform.OS === 'ios' ? hp(0.5) : hp(-0.5),
                            },
                            textStyle,
                        ]}
                    >
                        {description}
                    </Text>
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
    contentColumn: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: wp(4),
    },
    text: {
        textAlignVertical: 'center',
    },
});

export default LabelDescriptionButtonWithoutFeedback;
