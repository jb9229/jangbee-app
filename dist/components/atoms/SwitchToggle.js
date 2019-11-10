import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});
function SwitchToggle(props) {
    const [animXValue] = useState(new Animated.Value(props.switchOn ? 1 : 0));
    const getStart = () => {
        // prettier-ignore
        return props.type === undefined
            ? 0
            : props.type === 0
                ? 0
                : props.containerStyle && props.containerStyle.padding
                    ? props.containerStyle.padding * 2
                    : {};
    };
    const runAnimation = () => {
        const animValue = {
            fromValue: props.switchOn ? 0 : 1,
            toValue: props.switchOn ? 1 : 0,
            duration: props.duration
        };
        Animated.timing(animXValue, animValue).start();
    };
    const endPos = props.containerStyle && props.circleStyle
        ? props.containerStyle.width -
            (props.circleStyle.width +
                props.containerStyle.padding * 2)
        : 0;
    const circlePosXEnd = endPos;
    const [circlePosXStart] = useState(getStart());
    const prevSwitchOnRef = useRef();
    const prevSwitchOn = !!prevSwitchOnRef.current;
    useEffect(() => {
        prevSwitchOnRef.current = props.switchOn;
        if (prevSwitchOn !== props.switchOn) {
            runAnimation();
        }
    }, [props.switchOn]);
    const generateRightText = () => {
        return (<Animated.View style={props.rightContainerStyle}>
        <Text style={props.textRightStyle}>{props.backTextRight}</Text>
      </Animated.View>);
    };
    const generateLeftText = () => {
        return (<Animated.View style={props.leftContainerStyle}>
        <Text style={props.textLeftStyle}>{props.backTextLeft}</Text>
      </Animated.View>);
    };
    return (<TouchableOpacity onPress={props.onPress} activeOpacity={0.5}>
      <Animated.View style={[
        styles.container,
        props.containerStyle,
        {
            backgroundColor: animXValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                    props.backgroundColorOff,
                    props.backgroundColorOn
                ]
            })
        }
    ]}>
        {generateLeftText()}
        <Animated.View style={[
        props.circleStyle,
        {
            backgroundColor: animXValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                    props.circleColorOff,
                    props.circleColorOn
                ]
            })
        },
        {
            transform: [
                {
                    translateX: animXValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                            circlePosXStart,
                            circlePosXEnd
                        ]
                    })
                }
            ]
        },
        props.buttonStyle
    ]}>
          <Animated.View style={props.buttonContainerStyle}>
            <Text style={props.buttonTextStyle}>{props.buttonText}</Text>
          </Animated.View>
        </Animated.View>
        {generateRightText()}
      </Animated.View>
    </TouchableOpacity>);
}
SwitchToggle.defaultProps = {
    switchOn: false,
    onPress: () => { },
    containerStyle: {
        width: 72,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgb(227,227,227)',
        padding: 3
    },
    circleStyle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'white' // rgb(102,134,205)
    },
    backgroundColorOn: 'rgb(227,227,227)',
    backgroundColorOff: 'rgb(215,215,215)',
    circleColorOff: 'white',
    circleColorOn: 'rgb(102,134,205)',
    duration: 300
};
export default SwitchToggle;
//# sourceMappingURL=SwitchToggle.js.map