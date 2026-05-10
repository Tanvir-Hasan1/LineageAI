import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme } from '@/constants/theme';

/**
 * Dynamic Hook to determine current Application Color Schema based on OS preference.
 * Usage: const colors = useAppTheme();
 */
export function useAppTheme() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? DarkTheme : LightTheme;
}

export default useAppTheme;
