/**
 * Utilitário de Masking de Dados Sensíveis
 * 
 * Previne vazamento de informações sensíveis em logs, console e erros.
 */

/**
 * Máscaras comuns
 */
export const masks = {
  email: (email: string): string => {
    if (!email || !email.includes('@')) return email;
    
    const [local, domain] = email.split('@');
    const [domainName, domainExt] = domain.split('.');
    
    const maskedLocal = local.charAt(0) + '*'.repeat(Math.max(0, local.length - 2)) + local.slice(-1);
    const maskedDomain = domainName.charAt(0) + '*'.repeat(Math.max(0, domainName.length - 2));
    
    return `${maskedLocal}@${maskedDomain}.${domainExt}`;
  },

  cpf: (cpf: string): string => {
    if (!cpf) return cpf;
    
    const cleanCpf = cpf.replace(/\D/g, '');
    
    if (cleanCpf.length !== 11) return cpf;
    
    return `${cleanCpf.slice(0, 3)}.***.***-${cleanCpf.slice(-2)}`;
  },

  cnpj: (cnpj: string): string => {
    if (!cnpj) return cnpj;
    
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length !== 14) return cnpj;
    
    return `${cleanCnpj.slice(0, 2)}.***.***/${cleanCnpj.slice(8, 12)}-${cleanCnpj.slice(-2)}`;
  },

  creditCard: (cardNumber: string): string => {
    if (!cardNumber) return cardNumber;
    
    const cleanCard = cardNumber.replace(/\D/g, '');
    
    if (cleanCard.length < 4) return '*'.repeat(cleanCard.length);
    
    const last4 = cleanCard.slice(-4);
    
    return '*'.repeat(cleanCard.length - 4) + last4;
  },

  phone: (phone: string): string => {
    if (!phone) return phone;
    
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length < 4) return '*'.repeat(cleanPhone.length);
    
    const last4 = cleanPhone.slice(-4);
    
    if (cleanPhone.length === 11) {
      return `(**) *****-${last4}`;
    }
    
    return `(${cleanPhone.slice(0, 2)}) ****-${last4}`;
  },

  password: (password: string): string => {
    if (!password) return '';
    return '*'.repeat(Math.min(password.length, 20));
  },

  address: (address: { street?: string; number?: string; zipCode?: string }): string => {
    if (!address) return '';
    
    const maskedStreet = address.street 
      ? address.street.split(' ').slice(0, -1).join(' ') + ' ' + '***'
      : '***';
    
    const maskedZip = address.zipCode
      ? address.zipCode.replace(/\d/g, (d, i) => i < 5 ? d : '*')
      : '*****-***';
    
    return `${maskedStreet}, ${address.number || '***'} - ${maskedZip}`;
  },

  name: (name: string): string => {
    if (!name) return name;
    
    return name
      .split(' ')
      .map((part) => part.charAt(0) + '*'.repeat(Math.max(0, part.length - 1)))
      .join(' ');
  },

  plate: (plate: string): string => {
    if (!plate || plate.length < 4) return plate;
    
    return plate.slice(0, 3) + '*'.repeat(plate.length - 3);
  }
};

export type SensitiveField = 
  | 'email' | 'cpf' | 'cnpj' | 'creditCard' | 'phone' 
  | 'password' | 'address' | 'name' | 'plate' | 'token' | 'apiKey';

export interface MaskingOptions {
  fields?: SensitiveField[];
  redact?: boolean;
  customMask?: Record<string, (value: any) => string>;
}

export function maskSensitiveData<T extends Record<string, any>>(
  data: T,
  options: MaskingOptions = {}
): T {
  const { fields, redact = false, customMask } = options;
  
  const result = { ...data };
  
  const sensitiveFieldMap: Record<string, SensitiveField> = {
    email: 'email',
    emails: 'email',
    user_email: 'email',
    cpf: 'cpf',
    cpfs: 'cpf',
    cnpj: 'cnpj',
    cnpjs: 'cnpj',
    credit_card: 'creditCard',
    creditCard: 'creditCard',
    card_number: 'creditCard',
    cardNumber: 'creditCard',
    phone: 'phone',
    phones: 'phone',
    telephone: 'phone',
    cell_phone: 'phone',
    cellPhone: 'phone',
    password: 'password',
    passwords: 'password',
    pass: 'password',
    secret: 'password',
    token: 'token',
    tokens: 'token',
    access_token: 'token',
    accessToken: 'token',
    refresh_token: 'token',
    refreshToken: 'token',
    api_key: 'apiKey',
    apiKey: 'apiKey',
    apikey: 'apiKey',
    secret_key: 'apiKey',
    secretKey: 'apiKey',
    address: 'address',
    addresses: 'address',
    street: 'address',
    zip_code: 'address',
    zipCode: 'address',
    cep: 'address',
    name: 'name',
    full_name: 'name',
    fullName: 'name',
    plate: 'plate',
    plates: 'plate'
  };

  for (const [key, value] of Object.entries(result)) {
    const lowerKey = key.toLowerCase();
    
    const shouldMask = !fields || fields.some((f) => lowerKey.includes(f));
    
    if (!shouldMask) continue;

    let maskType: SensitiveField | undefined;
    
    if (customMask?.[key]) {
      (result as any)[key] = customMask[key](value);
      continue;
    }

    for (const [mapKey, mapType] of Object.entries(sensitiveFieldMap)) {
      if (lowerKey.includes(mapKey)) {
        maskType = mapType;
        break;
      }
    }

    if (maskType && masks[maskType as keyof typeof masks]) {
      (result as any)[key] = redact ? '[REDACTED]' : masks[maskType as keyof typeof masks](value);
    } else if (typeof value === 'string' && value.length > 0) {
      (result as any)[key] = redact ? '[REDACTED]' : value.slice(0, 2) + '*'.repeat(Math.max(0, value.length - 2));
    }
  }

  return result as T;
}

export function createSafeLogger(options?: MaskingOptions) {
  return {
    log: (...args: any[]) => {
      const maskedArgs = args.map((arg) => 
        typeof arg === 'object' && arg !== null ? maskSensitiveData(arg, options) : arg
      );
      console.log(...maskedArgs);
    },
    warn: (...args: any[]) => {
      const maskedArgs = args.map((arg) => 
        typeof arg === 'object' && arg !== null ? maskSensitiveData(arg, options) : arg
      );
      console.warn(...maskedArgs);
    },
    error: (...args: any[]) => {
      const maskedArgs = args.map((arg) => 
        typeof arg === 'object' && arg !== null ? maskSensitiveData(arg, options) : arg
      );
      console.error(...maskedArgs);
    },
    info: (...args: any[]) => {
      const maskedArgs = args.map((arg) => 
        typeof arg === 'object' && arg !== null ? maskSensitiveData(arg, options) : arg
      );
      console.info(...maskedArgs);
    }
  };
}

export const safeLog = createSafeLogger({
  redact: false,
  fields: ['email', 'cpf', 'cnpj', 'creditCard', 'phone', 'password', 'token', 'apiKey']
});
