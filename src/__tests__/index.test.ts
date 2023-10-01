import { describe, expect, it } from '@jest/globals'

import security from '../index'

describe('security', () => {
  describe('string', () => {
    it('generates a random code of specified length', () => {
      expect(security.string.code(10).length).toBe(10)
      expect(security.string.code(5).length).toBe(5)
    })
  })

  describe('input', () => {
    it('sanitizes strings', () => {
      expect(security.input.sanitize('<script>alert("test")</script>')).toBe(
        '&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt;'
      )
    })

    describe('is', () => {
      it('should validate strings correctly', () => {
        expect(security.input.is('Hello').string()).toBe(true)
        expect(security.input.is(12345).string()).toBe(false)
      })

      it('should validate numbers correctly', () => {
        expect(security.input.is(12345).number()).toBe(true)
        expect(security.input.is('12345').number()).toBe(false)
      })

      it('should detect empty values', () => {
        expect(security.input.is({ name: 'John' }).empty()).toBe(false)
        expect(security.input.is({}).empty()).toBe(true)
        expect(security.input.is([1, 2, 3]).empty()).toBe(false)
        expect(security.input.is([]).empty()).toBe(true)
        expect(security.input.is('Hello').empty()).toBe(false)
        expect(security.input.is('').empty()).toBe(true)
      })
    })
  })

  describe('base64', () => {
    it('encodes and decodes correctly', () => {
      const original = { test: 'value' }
      const encoded = security.base64.encode(original)
      const decoded = security.base64.decode(encoded)
      expect(decoded).toEqual(original)
    })

    it('should encode a string to base64', () => {
      const str = 'Hello World'
      const result = security.base64.encode(str)
      const expected = Buffer.from(str).toString('base64')
      expect(result).toBe(expected)
    })

    it('should return null for non-string, non-object values', () => {
      expect(security.base64.encode(12345)).toBeNull()
      expect(security.base64.encode(true)).toBeNull()
    })

    it('should decode a base64 encoded string', () => {
      const encoded = Buffer.from('Hello World').toString('base64')
      const result = security.base64.decode(encoded)
      expect(result).toBe('Hello World')
    })

    it('should decode and parse a base64 encoded JSON string', () => {
      const obj = { key: 'value' }
      const encoded = Buffer.from(JSON.stringify(obj)).toString('base64')
      const result = security.base64.decode(encoded)
      expect(result).toEqual(obj)
    })

    it('should return an empty string for non-string values', () => {
      expect(security.base64.decode(12345)).toBe('')
      expect(security.base64.decode(true)).toBe('')
    })
  })

  describe('password', () => {
    it('should validate a strong password', () => {
      const result = security.password.validation('StrongPass123!')
      expect(result.isValid).toBe(true)
      expect(result.reasons?.length).toBe(0)
    })

    it('should invalidate a short password', () => {
      const result = security.password.validation('Shrt1!')
      expect(result.isValid).toBe(false)
      expect(result.length).toBe('Password should be at least 8 characters long.')
      expect(result.reasons).toContain('length')
    })

    it('should invalidate a password without lowercase letters', () => {
      const result = security.password.validation('PASSWORD123!')
      expect(result.isValid).toBe(false)
      expect(result.lowercase).toBe('Password should contain at least one lowercase character.')
      expect(result.reasons).toContain('lowercase')
    })

    it('should invalidate a password without uppercase letters', () => {
      const result = security.password.validation('password123!')
      expect(result.isValid).toBe(false)
      expect(result.uppercase).toBe('Password should contain at least one uppercase character.')
      expect(result.reasons).toContain('uppercase')
    })

    it('should invalidate a password without digits', () => {
      const result = security.password.validation('Password!')
      expect(result.isValid).toBe(false)
      expect(result.digit).toBe('Password should contain at least one digit.')
      expect(result.reasons).toContain('digit')
    })

    it('should invalidate a password without special characters', () => {
      const result = security.password.validation('Password123')
      expect(result.isValid).toBe(false)
      expect(result.special).toBe('Password should contain at least one special character.')
      expect(result.reasons).toContain('special')
    })

    it('should accumulate multiple validation reasons', () => {
      const result = security.password.validation('PASSWORD')
      expect(result.isValid).toBe(false)
      expect(result.reasons).toContain('digit')
      expect(result.reasons).toContain('special')
    })

    it('should match two strong identical passwords', () => {
      expect(security.password.match('StrongPass123!', 'StrongPass123!')).toBe(true)
    })

    it('should not match two different passwords', () => {
      expect(security.password.match('StrongPass123!', 'DifferentPass456!')).toBe(false)
    })

    it('should not match if one of the passwords is weak', () => {
      expect(security.password.match('StrongPass123!', 'weakpass')).toBe(false)
    })

    it('should not match if both passwords are weak', () => {
      expect(security.password.match('weakpass1', 'weakpass1')).toBe(false)
    })

    it('encrypts password correctly', () => {
      const encrypted = security.password.encrypt('password')
      expect(encrypted).toHaveLength(40)
    })
  })

  describe('csp', () => {
    it('generates csp string', () => {
      const cspConfig = {
        'default-src': ["'self'"],
        'script-src': ["'self'", 'example.com']
      }
      expect(security.csp.generator(cspConfig)).toBe(
        "default-src 'self'; script-src 'self' example.com"
      )
    })
  })

  describe('mask', () => {
    it('masks email correctly', () => {
      expect(security.mask.email('test@example.com')).toMatch(/^tes\*+@ex\*+\.com$/)
    })

    it('masks phone correctly', () => {
      expect(security.mask.phone('1234567890')).toBe('xxxxx67890')
    })

    it('masks text correctly', () => {
      expect(security.mask.text('testingtesting', 2, 2)).toBe('te**********ng')
    })
  })
})
