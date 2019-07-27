export interface Translation {
  [key: string]: string | Translation;
}

export interface Translations {
  de?: Translation;
  en?: Translation;
  es?: Translation;
  fr?: Translation;
  ru?: Translation;
}
