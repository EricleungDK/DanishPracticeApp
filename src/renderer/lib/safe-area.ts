import { Capacitor } from '@capacitor/core';
import { SafeArea } from 'capacitor-plugin-safe-area';

function applyInsets(insets: { top: number; bottom: number; left: number; right: number }) {
  const root = document.documentElement;
  root.style.setProperty('--safe-area-top', `${insets.top}px`);
  root.style.setProperty('--safe-area-bottom', `${insets.bottom}px`);
  root.style.setProperty('--safe-area-left', `${insets.left}px`);
  root.style.setProperty('--safe-area-right', `${insets.right}px`);
}

export async function initSafeArea(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { insets } = await SafeArea.getSafeAreaInsets();
    applyInsets(insets);

    await SafeArea.addListener('safeAreaChanged', (data) => {
      applyInsets(data.insets);
    });
  } catch {
    // Plugin unavailable — CSS env() fallbacks will be used
  }
}
