import { View, StyleSheet } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { TabRoutes } from '@/constants/Routes';
import Theme from '@/constants/Theme';


const TabBar = (props: BottomTabBarProps) => {
  const { buildHref } = useLinkBuilder();

  return (
    <View style={{ flexDirection: 'row', height: 70, alignItems: 'center', width: '100%' }}>
      {props.state.routes.map((route, index) => {
        const { options } = props.descriptors[route.key];
        const label = TabRoutes[route.name]

        const isFocused = props.state.index === index;

        const onPress = () => {
          const event = props.navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            props.navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          props.navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        return (
          <PlatformPressable
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >
            <FontAwesome
              name={route.name == 'projects' ? 'map' : route.name == 'new_area' ? 'plus-circle' : 'user'}
              size={25}
              color={isFocused ? Theme.colors?.primary : Theme.colors?.backdrop} />
            <Text style={{ color: isFocused ? Theme.colors?.primary : Theme.colors?.backdrop }}>
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4
  },
})

export default TabBar