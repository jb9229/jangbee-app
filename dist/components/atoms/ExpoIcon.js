import * as Icon from '@expo/vector-icons';
import * as React from 'react';
export default function ExpoIcon(props) {
    if (props.type && props.type === 'MaterialIcons') {
        return (<Icon.MaterialIcons name={props.name} size={props.size || 26} style={{}} color={props.focused ? props.activeColor : props.color}/>);
    }
    if (props.type && props.type === 'MaterialCommunityIcons') {
        return (<Icon.MaterialCommunityIcons name={props.name} size={props.size || 26} style={{}} color={props.focused ? props.activeColor : props.color}/>);
    }
    return (<Icon.Ionicons name={props.name} size={props.size || 26} style={{}} color={props.focused ? props.activeColor : props.color}/>);
}
//# sourceMappingURL=ExpoIcon.js.map