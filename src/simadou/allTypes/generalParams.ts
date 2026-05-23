export interface GeneralParams {
  id: string

  // App branding
  appName: string
  logoUrl?: string | null
  logoPublicId?: string | null
  primaryColor?: string | null

  // Contacts structure
  contactEmail?: string | null
  contactPhone?: string | null
  address?: string | null
  website?: string | null

  // Structure CEP / système
  systemSigle?: string | null 
  systemTitle?: string | null  

  structureSigle?: string | null 
  structureName?: string | null  
  structureLogo?: string | null
  structureAddress?: string | null 
  structureEmail?: string | null
  structurePhone?: string | null
  structureWhatsapp?: string | null

  // Finance
  currencyCode?: string | null 
  baseCurrency?: string | null  
  exchangeRate?: number | null  

  // Sécurité / système
  maintenanceMode?: boolean
  inactivityDelayMinutes?: number 
  maxSessions?: number 
  loginAttemptsLimit?: number 
  tpCodeDelayMinutes?: number 
  passwordChangeDelayMonths?: number 
  deleteOrUpdateDelaySeconds?: number 

  // WhatsApp / email / SMTP
  whatsappInstanceCode?: string | null // 2522545522
  notificationEmail?: string | null // cep@cep.net
  notificationEmailPassword?: string | null // Cep@@@@@125h
  smtpHost?: string | null // 557
  parentApiUrl?: string | null

  createdAt: string
  updatedAt: string
}