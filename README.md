# @architecturex/utils.base64

## base64

This utility module offers easy-to-use methods for encoding and decoding data to and from Base64, with special handling for JSON strings.

### Installation

`npm install @architecturex/utils.base64`

### Usage

```javascript
import base64 from '@architecturex/utils.base64'
```

#### Encoding

To encode a string or an object:

```javascript
// Returns a Base64 encoded string
const encodedString = base64.set('Hello World')

// Returns a Base64 encoded string of the JSON representation
const obj = { key: 'value' }
const encodedObj = base64.set(obj)
```

#### Decoding

To decode a Base64 encoded string:

```javascript
// Returns the original string
const decodedString = base64.get(encodedString)

// Returns the original object
const decodedObj = base64.get(encodedObj)
```

### Behavior

- The `get` method:
  - Decodes a Base64 encoded string.
  - If the decoded value is a JSON string, it parses and returns the corresponding object.
  - Returns an empty string for non-string values.
- The `set` method:
  - Encodes a string to Base64.
  - If given an object, it stringifies the object and encodes the resulting JSON string to Base64.
  - Returns `null` for non-string, non-object values.

### Contribution

Feel free to suggest improvements, report issues, or contribute to enhancing this utility. Your feedback and contributions are welcome!
