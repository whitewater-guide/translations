import i18next from 'i18next';
import commons from './commons';
import markdown from './markdown';
import mob from './mobile';
import yup from './yup';

function mergeTranslations(
  ...components: i18next.Resource[]
): i18next.Resource {
  const result: i18next.Resource = {};
  components.forEach((ns) =>
    Object.keys(ns).forEach(
      (lang) => (result[lang] = { ...result[lang], ...ns[lang] }),
    ),
  );
  return result;
}

export const mobile = mergeTranslations(commons, mob, markdown, yup);
export const web = mergeTranslations(commons, yup);
