import { View, StyleSheet } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import Theme from '@/constants/Theme';

const TabBar = (props: BottomTabBarProps) => {
  const { buildHref } = useLinkBuilder();

  const tabs = [
    { name: '(app)', label: 'Projetos', icon: 'map' as const },
    { name: 'saved', label: 'Salvos', icon: 'bookmark' as const },
    { name: 'settings', label: 'Config', icon: 'gear' as const },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isFocused = props.state.index === index;

        const onPress = () => {
          const event = props.navigation.emit({
            type: 'tabPress',
            target: props.state.routes[index]?.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            props.navigation.navigate(tab.name as never);
          }
        };

        const onLongPress = () => {
          props.navigation.emit({
            type: 'tabLongPress',
            target: props.state.routes[index]?.key,
          });
        };

        return (
          <PlatformPressable
            key={tab.name}
            href={buildHref(tab.name)}
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >
            <FontAwesome
              name={tab.icon}
              size={25}
              color={isFocused ? Theme.colors?.primary : Theme.colors?.backdrop}
            />
            <Text style={{ color: isFocused ? Theme.colors?.primary : Theme.colors?.backdrop }}>
              {tab.label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
});

export default TabBar;
