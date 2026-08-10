import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ms } from 'react-native-size-matters';

interface UserAvatarProps {
    url?: string | null;
    source?: any;
    name?: string | null;
    size?: number;
    style?: StyleProp<ImageStyle | ViewStyle>;
    backgroundColor?: string;
    textColor?: string;
    iconColor?: string;
}

export function UserAvatar({
    url,
    source,
    name,
    size = ms(44),
    style,
    backgroundColor = '#8EA281',
    textColor = '#FFFFFF',
    iconColor = '#FFFFFF',
}: UserAvatarProps) {
    const imgSource = url ? { uri: url } : source;

    if (imgSource) {
        return (
            <Image
                source={imgSource}
                style={[
                    { width: size, height: size, borderRadius: size / 2 },
                    style as ImageStyle,
                ]}
            />
        );
    }

    const initial = name && name.trim().length > 0 ? name.trim().charAt(0).toUpperCase() : null;

    return (
        <View
            style={[
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                style as ViewStyle,
            ]}
        >
            {initial ? (
                <Text style={{ color: textColor, fontSize: size * 0.42, fontWeight: '600' }}>
                    {initial}
                </Text>
            ) : (
                <Feather name="user" size={size * 0.48} color={iconColor} />
            )}
        </View>
    );
}

export default UserAvatar;
