import isJSON from '@architecturex/utils.isjson'
import crypto from 'crypto'

type PasswordOptions = {
  length?: number
  lowercase?: boolean
  uppercase?: boolean
  digit?: boolean
  special?: boolean
}

type ValidationResult = {
  isValid: boolean
  length?: string
  lowercase?: string
  uppercase?: string
  digit?: string
  special?: string
  reasons?: string[]
}

type CspDirective =
  | 'default-src'
  | 'script-src'
  | 'style-src'
  | 'img-src'
  | 'connect-src'
  | 'font-src'
  | 'object-src'
  | 'media-src'
  | 'frame-src'
  | 'sandbox'
  | 'report-uri'
  | 'child-src'
  | 'form-action'
  | 'frame-ancestors'
  | 'plugin-types'
  | 'worker-src'
  | 'manifest-src'
  | 'navigate-to'

type CspConfig = {
  [directive in CspDirective]?: string[]
}

const security = {
  string: {
    code(length: number): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''

      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }

      return result
    }
  },
  input: {
    sanitize(input: string): string {
      return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    },
    validate: (value: any) => ({
      is: (type: string) => {
        if (type === 'string') {
          return typeof value === 'string'
        }

        if (type === 'number') {
          return typeof value === 'number'
        }

        if (type === 'empty') {
          if (typeof value === 'string') {
            return value === ''
          }

          if (Array.isArray(value)) {
            return value.length === 0
          }

          if (typeof value === 'object' && Object.keys(value).length === 0) {
            return true
          }

          for (const key in value) {
            if (value[key] === '' || !value[key]) {
              return true
            }
          }
        }

        return false
      }
    })
  },
  base64: {
    encode(value: any) {
      if (value && typeof value === 'object') {
        return Buffer.from(JSON.stringify(value)).toString('base64')
      }

      return typeof value === 'string' ? Buffer.from(value).toString('base64') : null
    },
    decode(value: any) {
      let buffer = ''

      if (typeof value === 'string') {
        buffer = Buffer.from(value, 'base64').toString('ascii')
      }

      if (isJSON(buffer)) {
        buffer = JSON.parse(Buffer.from(value, 'base64').toString('ascii'))
      }

      return buffer
    }
  },
  password: {
    validation(password: string, options: PasswordOptions = {}): ValidationResult {
      const validations = {
        length: options.length || 8,
        lowercase: options.lowercase || true,
        uppercase: options.uppercase || true,
        digit: options.digit || true,
        special: options.special || true,
        reasons: []
      }

      const errors: ValidationResult = {
        isValid: true,
        reasons: []
      }

      // Check for password length
      if (password.length < validations.length) {
        errors.reasons?.push('length')
        errors.length = `Password should be at least ${validations.length} characters long.`
        errors.isValid = false
      }

      // Check for at least one lowercase character
      if (validations.lowercase && !/[a-z]/.test(password)) {
        errors.reasons?.push('lowercase')
        errors.lowercase = 'Password should contain at least one lowercase character.'
        errors.isValid = false
      }

      // Check for at least one uppercase character
      if (validations.uppercase && !/[A-Z]/.test(password)) {
        errors.reasons?.push('uppercase')
        errors.uppercase = 'Password should contain at least one uppercase character.'
        errors.isValid = false
      }

      // Check for at least one digit
      if (validations.digit && !/[0-9]/.test(password)) {
        errors.reasons?.push('digit')
        errors.digit = 'Password should contain at least one digit.'
        errors.isValid = false
      }

      // Check for at least one special character
      if (validations.special && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.reasons?.push('special')
        errors.special = 'Password should contain at least one special character.'
        errors.isValid = false
      }

      return errors
    },
    match(p1: string, p2: string): boolean {
      return (
        security.password.validation(p1).isValid &&
        security.password.validation(p2).isValid &&
        p1 === p2
      )
    },
    encrypt(str: string): string {
      return crypto.createHash('sha1').update(str.toString()).digest('hex')
    }
  },
  csp: {
    generator(config: CspConfig): string {
      return Object.entries(config)
        .map(([directive, sources]) => {
          return `${directive} ${sources?.join(' ')}`
        })
        .join('; ')
    }
  },
  mask: {
    email(email: string): string {
      const [localPart, domainPart] = email.split('@')
      const [domainName, tld] = domainPart.split('.')
      return `${localPart.substring(0, 3)}*****@${domainName.substring(0, 2)}*****.${tld}`
    },
    phone(phone: string): string {
      const visibleDigits = 5
      const masked = phone.slice(0, -visibleDigits).replace(/\d/g, 'x')
      return `${masked}${phone.slice(-visibleDigits)}`
    },
    text(data: string, startKeep: number = 2, endKeep: number = 2, maskChar: string = '*'): string {
      if (data.length <= startKeep + endKeep) return data
      const visibleStart = data.slice(0, startKeep)
      const visibleEnd = data.slice(-endKeep)
      const maskLength = data.length - (startKeep + endKeep)
      const maskedPart = Array(maskLength).fill(maskChar).join('')
      return `${visibleStart}${maskedPart}${visibleEnd}`
    }
  }
}

export default security
