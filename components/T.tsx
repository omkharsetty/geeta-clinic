'use client';
import { useLang } from './LanguageProvider';

export function T({ k }: { k: string }) {
  const { t } = useLang();
  return <>{t(k)}</>;
}
