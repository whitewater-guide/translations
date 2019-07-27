import commons from './commons';
import markdown from './markdown';
import mob from './mobile';
import { Translations } from './types';
import yup from './yup';

function mergeTranslations(...namespaces: Translations[]) {
  const result: Translations = {};
  namespaces.forEach((ns) =>
    Object.keys(ns).forEach(
      (lang: keyof Translations) =>
        (result[lang] = { ...result[lang], ...ns[lang] }),
    ),
  );
  return result;
}

export const mobile = mergeTranslations(commons, mob, markdown, yup);
export const web = mergeTranslations(commons, yup);
