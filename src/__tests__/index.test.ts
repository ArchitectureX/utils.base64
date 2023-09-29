import { describe, expect, it } from '@jest/globals'

import base64 from '../index'

describe('base64', () => {
  describe('get', () => {
    it('should decode a base64 encoded string', () => {
      const encoded = Buffer.from('Hello World').toString('base64')
      const result = base64.get(encoded)
      expect(result).toBe('Hello World')
    })

    it('should decode and parse a base64 encoded JSON string', () => {
      const obj = { key: 'value' }
      const encoded = Buffer.from(JSON.stringify(obj)).toString('base64')
      const result = base64.get(encoded)
      expect(result).toEqual(obj)
    })

    it('should return an empty string for non-string values', () => {
      expect(base64.get(12345)).toBe('')
      expect(base64.get(true)).toBe('')
    })
  })

  describe('set', () => {
    it('should encode a string to base64', () => {
      const str = 'Hello World'
      const result = base64.set(str)
      const expected = Buffer.from(str).toString('base64')
      expect(result).toBe(expected)
    })

    it('should stringify and encode an object to base64', () => {
      const obj = { key: 'value' }
      const result = base64.set(obj)
      const expected = Buffer.from(JSON.stringify(obj)).toString('base64')
      expect(result).toBe(expected)
    })

    it('should return null for non-string, non-object values', () => {
      expect(base64.set(12345)).toBeNull()
      expect(base64.set(true)).toBeNull()
    })
  })
})
