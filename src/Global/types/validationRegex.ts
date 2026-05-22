// ========================================
// REGEX DE VALIDATION COMPLÈTES
// ========================================

export const ValidationRegex = {
  // ========== TEXTES & NOMS ==========
  
  // Chaînes avec lettres, chiffres, espaces, accents, apostrophes, tirets
  // Exemples valides: "Ogou1", "Jean-Paul", "O'Connor", "Société 2024"
  text: /^[a-zA-ZÀ-ÿ0-9\s'-]+$/,
  
  // Noms de personnes (lettres, espaces, tirets, apostrophes, accents)
  // Exemples: "Jean-Pierre", "O'Connor", "Marie-José"
  name: /^[a-zA-ZÀ-ÿ\s'-]+$/,
  
  // Noms stricts (que des lettres et accents, pas de chiffres)
  // Exemples: "Jean", "François", "Marie"
  nameStrict: /^[a-zA-ZÀ-ÿ\s'-]+$/,
  
  // Noms avec chiffres autorisés
  // Exemples: "Ogou1", "Société2024", "Team3"
  nameWithNumbers: /^[a-zA-ZÀ-ÿ0-9\s'-]+$/,
  
  // Alphanumérique simple (lettres + chiffres, pas d'espaces)
  // Exemples: "User123", "Code2024", "ID456"
  alphanumeric: /^[a-zA-Z0-9]+$/,
  
  // Alphanumérique avec accents et espaces
  // Exemples: "Référence 2024", "Numéro 123"
  alphanumericAccents: /^[a-zA-ZÀ-ÿ0-9\s]+$/,

  // ========== EMAILS ==========
  
  // Email standard (RFC 5322 simplifié)
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // Email strict (plus de validation)
  emailStrict: /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,

  // ========== TÉLÉPHONES ==========
  
  // Téléphone français (formats variés)
  // Exemples: "0612345678", "06 12 34 56 78", "06.12.34.56.78", "+33612345678"
  phoneFR: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
  
  // Téléphone international (format E.164)
  // Exemples: "+33612345678", "+14155552671"
  phoneInternational: /^\+[1-9]\d{1,14}$/,
  
  // Téléphone simple (que des chiffres, 10 à 15 chiffres)
  phoneSimple: /^\d{10,15}$/,
  
  // Mobile français
  // Exemples: "0612345678", "0712345678"
  mobileFR: /^0[6-7](?:[\s.-]*\d{2}){4}$/,

  // ========== MOTS DE PASSE ==========
  
  // Mot de passe faible (min 6 caractères)
  passwordWeak: /^.{6,}$/,
  
  // Mot de passe moyen (min 8 caractères, 1 lettre et 1 chiffre)
  passwordMedium: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
  
  // Mot de passe fort (min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre)
  passwordStrong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  
  // Mot de passe très fort (min 8 caractères, 1 maj, 1 min, 1 chiffre, 1 caractère spécial)
  passwordVeryStrong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,

  // ========== NOMBRES ==========
  
  // Entier positif
  integerPositive: /^\d+$/,
  
  // Entier (positif ou négatif)
  integer: /^-?\d+$/,
  
  // Décimal positif (avec virgule ou point)
  decimalPositive: /^\d+([.,]\d+)?$/,
  
  // Décimal (positif ou négatif)
  decimal: /^-?\d+([.,]\d+)?$/,
  
  // Prix (2 décimales max)
  // Exemples: "19.99", "1500", "0.50"
  price: /^\d+(\.\d{1,2})?$/,
  
  // Pourcentage (0-100)
  percentage: /^(100|[1-9]?\d)$/,

  // ========== URLS ==========
  
  // URL standard
  // Exemples: "https://example.com", "http://site.fr/page"
  url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  
  // URL stricte (avec protocole obligatoire)
  urlStrict: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,

  // ========== CODES POSTAUX ==========
  
  // Code postal français
  // Exemples: "75001", "13008", "97400"
  postalCodeFR: /^[0-9]{5}$/,
  
  // Code postal international (alphanumérique)
  postalCodeInternational: /^[A-Z0-9\s-]{3,10}$/i,

  // ========== DATES ==========
  
  // Date format JJ/MM/AAAA
  dateFR: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
  
  // Date format AAAA-MM-JJ (ISO)
  dateISO: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
  
  // Heure format HH:MM
  time: /^([01]\d|2[0-3]):([0-5]\d)$/,
  
  // Heure format HH:MM:SS
  timeWithSeconds: /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,

  // ========== IDENTIFIANTS ==========
  
  // Numéro de sécurité sociale français
  // Exemple: "1 89 05 49 588 157 80"
  socialSecurityFR: /^[12]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{3}\s?\d{3}\s?\d{2}$/,
  
  // SIRET (14 chiffres)
  siret: /^\d{14}$/,
  
  // SIREN (9 chiffres)
  siren: /^\d{9}$/,
  
  // TVA intracommunautaire française
  // Exemple: "FR12345678901"
  tvaFR: /^FR\d{11}$/,
  
  // Numéro de carte bancaire (format générique)
  creditCard: /^\d{13,19}$/,
  
  // IBAN (format simplifié)
  iban: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/,

  // ========== ADRESSES ==========
  
  // Adresse (caractères, chiffres, espaces, ponctuation courante)
  address: /^[a-zA-ZÀ-ÿ0-9\s,.''-]+$/,
  
  // Numéro de rue (chiffres, lettres, espaces, tirets)
  // Exemples: "10", "12bis", "14-16"
  streetNumber: /^[0-9]+[a-zA-Z\s-]*$/,

  // ========== DIVERS ==========
  
  // Slug (URL friendly)
  // Exemples: "mon-article-2024", "produit-123"
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  
  // Hexadécimal (couleurs)
  // Exemples: "#FFF", "#FF5733", "FF5733"
  hex: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
  
  // IPv4
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  
  // UUID
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  
  // Username (lettres, chiffres, underscore, tiret)
  // Exemples: "john_doe", "user-123", "admin2024"
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  
  // Pas d'espaces au début/fin
  noLeadingTrailingSpaces: /^\S.*\S$|^\S$/,
  
  // Que des lettres (pas de chiffres ni caractères spéciaux)
  lettersOnly: /^[a-zA-ZÀ-ÿ]+$/,
  
  // Que des chiffres
  numbersOnly: /^\d+$/,
};

// ========================================
// FONCTIONS DE VALIDATION HELPERS
// ========================================

export const ValidationHelpers = {
  /**
   * Valide un champ avec une regex
   */
  validate: (value: string, regex: RegExp): boolean => {
    return regex.test(value);
  },

  /**
   * Obtient un message d'erreur selon le type de validation
   */
  getErrorMessage: (fieldType: string): string => {
    const messages: Record<string, string> = {
      text: "Doit contenir uniquement des lettres, chiffres, espaces et - '",
      name: "Doit contenir uniquement des lettres et - '",
      email: "Format d'email invalide (exemple: user@domain.com)",
      phoneFR: "Format de téléphone français invalide (exemple: 06 12 34 56 78)",
      phoneInternational: "Format de téléphone invalide (exemple: +33612345678)",
      passwordMedium: "Minimum 8 caractères avec au moins 1 lettre et 1 chiffre",
      passwordStrong: "Minimum 8 caractères avec 1 majuscule, 1 minuscule et 1 chiffre",
      passwordVeryStrong: "Minimum 8 caractères avec 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial (@$!%*?&#)",
      url: "Format d'URL invalide (exemple: https://example.com)",
      postalCodeFR: "Code postal français invalide (5 chiffres)",
      dateFR: "Format de date invalide (JJ/MM/AAAA)",
      dateISO: "Format de date invalide (AAAA-MM-JJ)",
      time: "Format d'heure invalide (HH:MM)",
      siret: "SIRET invalide (14 chiffres)",
      siren: "SIREN invalide (9 chiffres)",
      username: "3-20 caractères (lettres, chiffres, _ et - uniquement)",
      slug: "Format slug invalide (lettres minuscules, chiffres et - uniquement)",
    };
    return messages[fieldType] || "Format invalide";
  },

  /**
   * Vérifie si une valeur est un email valide
   */
  isEmail: (value: string): boolean => {
    return ValidationRegex.email.test(value);
  },

  /**
   * Vérifie si une valeur est un téléphone français valide
   */
  isPhoneFR: (value: string): boolean => {
    return ValidationRegex.phoneFR.test(value);
  },

  /**
   * Vérifie si un mot de passe est fort
   */
  isStrongPassword: (value: string): boolean => {
    return ValidationRegex.passwordStrong.test(value);
  },

  /**
   * Nettoie les espaces en début et fin de chaîne
   */
  trim: (value: string): string => {
    return value.trim();
  },

  /**
   * Normalise un numéro de téléphone (supprime espaces, points, tirets)
   */
  normalizePhone: (value: string): string => {
    return value.replace(/[\s.-]/g, "");
  },
};
