// src/screens/DashboardScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card, Text, Icon, Layout } from '@ui-kitten/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');
const MARGIN = 12;
const CARD_SIZE = (width - MARGIN * 3) / 2;

type ModuleItem = {
  key: string;
  icon: string;
  screen?: keyof RootStackParamList;
  count?: number;
  submodules?: ModuleItem[];
};

const MODULES: ModuleItem[] = [
  { key: 'Home',       icon: 'home-outline',           screen: 'Dashboard' },
  { key: 'Users',      icon: 'people-outline',         screen: 'Users' as keyof RootStackParamList, count: 10 },
  { key: 'Titan',      icon: 'cube-outline',           screen: 'Titan' as keyof RootStackParamList },
  { key: 'Chat',       icon: 'message-square-outline', screen: 'Chat' as keyof RootStackParamList },
  { key: 'Dashboards', icon: 'pie-chart-outline',      screen: 'Dashboards' as keyof RootStackParamList, count: 10 },
  { key: 'Audits',     icon: 'file-text-outline',      screen: 'Audits' as keyof RootStackParamList },
  {
    key: 'Items',
    icon: 'cube-outline',
    submodules: [
      {
        key: 'Mobilization',
        icon: 'navigation-2-outline',
        screen: 'Mobilization' as keyof RootStackParamList,
      },
    ],
  },
  {
    key: 'Locations',
    icon: 'pin-outline',
    submodules: [
      {
        key: 'Warehouses',
        icon: 'archive-outline',
        screen: 'Warehouses' as keyof RootStackParamList,
      },
    ],
  },
  {
    key: 'Operations',
    icon: 'layers-outline',
    submodules: [
      {
        key: 'Partial Picking',
        icon: 'shopping-cart-outline',
        screen: 'PickingPartial' as keyof RootStackParamList,
        count: 27,
      },
      {
        key: 'Packing',
        icon: 'truck-outline',
        screen: 'Packing' as keyof RootStackParamList,
        count: 10,
      },
      {
        key: 'Putaway',
        icon: 'archive-outline',
        screen: 'Putaway' as keyof RootStackParamList,
        count: 10,
      },
    ],
  },
];

type NavProp = NavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const navigation = useNavigation<NavProp>();
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  const toggleExpand = (key: string) =>
    setExpandedKeys(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const listData = useMemo(() => {
    return MODULES.flatMap(module => {
      const items: ModuleItem[] = [module];
      if (module.submodules && expandedKeys.has(module.key)) {
        module.submodules.forEach(sub =>
          items.push({ ...sub, key: `${module.key}>${sub.key}` })
        );
      }
      return items;
    });
  }, [expandedKeys]);

  const renderItem = ({ item }: { item: ModuleItem }) => {
    const isSub = item.key.includes('>');
    const displayKey = isSub ? item.key.split('>')[1] : item.key;

    return (
      <TouchableOpacity
        style={[styles.cardWrapper, isSub && { marginLeft: CARD_SIZE + MARGIN }]}
        activeOpacity={0.8}
        onPress={() => {
          if (item.submodules) {
            toggleExpand(item.key);
          } else if (item.screen) {
            navigation.navigate(item.screen);
          }
        }}
      >
        <Card style={[styles.card, isSub && styles.subCard]}>
          <Layout style={styles.iconContainer}>
            <Icon pack="eva" name={item.icon} animation="zoom" style={styles.icon} />
          </Layout>
          <Text category="s1" style={styles.title}>
            {displayKey}
          </Text>
          {typeof item.count === 'number' && (
            <Text category="h6" style={styles.count}>
              {item.count}
            </Text>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <Layout style={styles.container}>
      <Text category="h4" style={styles.greeting}>
        Hello, Juli!
      </Text>
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={i => i.key}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: MARGIN,
    backgroundColor: '#F5F9FF',
  },
  greeting: {
    marginBottom: 16,
    marginLeft: MARGIN,
  },
  list: {
    paddingBottom: 24,
  },
  cardWrapper: {
    margin: MARGIN / 2,
    width: CARD_SIZE,
  },
  card: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  subCard: {
    backgroundColor: '#FAFCFE',
  },
  iconContainer: {
    backgroundColor: '#E4F9FF',
    borderRadius: 28,
    padding: 10,
    marginBottom: 12,
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: '#009BD3',
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
  },
  count: {
    textAlign: 'center',
    color: '#666',
  },
});
