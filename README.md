# @architecturex/utils.security

## security

A utility library to aid in various common security-related tasks. This library includes functions for string sanitization, password validation, CSP generation, base64, data masking, and more.

### Installation

`npm install @architecturex/utils.security`

### Features

- **String Utilities:** Generate random codes and sanitize input strings.
- **Base64 Encoding & Decoding:** Convert data between Base64 and other formats.
- **Password Utilities:** Includes validation, matching, and encryption.
- **CSP Generator:** Helps in creating Content Security Policy directives.
- **Data Masking:** Mask email, phone, and generic text to protect sensitive data.
- **String Sanitization:** Protect your application against XSS attacks by sanitizing user input.
- **Type-based Validation:** Check if the provided input matches the expected type such as string or number.
- **Empty Check:** Quickly determine if a given input is empty.

### Usage

```javascript
import security from '@architecturex/utils.security'
```

#### String Utilities

Generate a random string:

```javascript
security.string.code(10) // Outputs: 'A4D2efG7H8'
```

### Input Utilities

Sanitize a string:

```javascript
security.string.sanitize('<script>alert("hacked")</script>')
// Outputs: '&lt;script&gt;alert(&quot;hacked&quot;)&lt;/script&gt;'
```

Check if a value is string:

```javascript
security.input.is('').string()
```

Check if a value is number

```javascript
security.input.is(12345).number()
```

Check if a value is empty

```javascript
security.input.is({ name: 'John' }).empty() // Outputs: false
security.input.is({}).empty() // Outputs: true
security.input.is([1, 2, 3]).empty() // Outputs: false
security.input.is([]).empty() // Outputs: true
security.input.is('Hello').empty() // Outputs: false
security.input.is('').empty() // Outputs: true
```

#### Base64 Encoding & Decoding

Encode a string or object to Base64:

```javascript
security.base64.encode('Hello World') // Outputs: 'SGVsbG8gV29ybGQ='
security.base64.encode({ msg: 'Hello World' }) // Outputs: 'eyJtc2ciOiAiSGVsbG8gV29ybGQifQ=='
```

Decode from Base64:

```javascript
security.base64.decode('SGVsbG8gV29ybGQ=') // Outputs: 'Hello World'
```

### Password Utilities

Validate a password:

```javascript
security.password.validation('Passw0rd!', { length: 8, special: true })
// Outputs: { isValid: true, reasons: [] }
```

Check if passwords match and are valid:

```javascript
security.password.match('Passw0rd!', 'Passw0rd!') // Outputs: true
```

Encrypt a password:

```javascript
security.password.encrypt('password') // Outputs: 'sha1 hash'
```

### CSP Generator

Generate a Content Security Policy:

```javascript
const config = {
  'default-src': ["'self'", 'cdn.example.com'],
  'script-src': ["'self'", 'scripts.example.com']
}
security.csp.generator(config)
// Outputs: "default-src 'self' cdn.example.com; script-src 'self' scripts.example.com"
```

### Data Masking

Mask an email:

```javascript
security.mask.email('test@example.com') // Outputs: 'tes*****@ex*****.com'
```

Mask a phone number:

```javascript
security.mask.phone('1234567890') // Outputs: 'xxxxx67890'
```

Mask text:

```javascript
security.mask.text('testingtesting', 2, 2) // Outputs: 'te*******ng'
```

### Contribution

Feel free to suggest improvements, report issues, or contribute to enhancing these utilities. Your feedback and contributions are welcome!
