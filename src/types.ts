export interface FlutterFile {
  path: string;
  name: string;
  category: 'config' | 'app' | 'core' | 'widgets' | 'auth' | 'screens' | 'android' | 'docs';
  description: string;
  content: string;
}

export interface PhaseItem {
  number: number;
  title: string;
  status: 'active' | 'completed' | 'upcoming';
  description: string;
}

export type DeviceMode = 'pixel_7' | 'tablet' | 'compact';
export type AppThemeMode = 'dark' | 'light';
