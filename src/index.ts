import isJSON from '@architecturex/utils.isjson'

const base64 = {
  get(value: any) {
    let buffer = ''

    if (typeof value === 'string') {
      buffer = Buffer.from(value, 'base64').toString('ascii')
    }

    if (isJSON(buffer)) {
      buffer = JSON.parse(Buffer.from(value, 'base64').toString('ascii'))
    }

    return buffer
  },
  set(value: any) {
    if (value && typeof value === 'object') {
      return Buffer.from(JSON.stringify(value)).toString('base64')
    }

    return typeof value === 'string' ? Buffer.from(value).toString('base64') : null
  }
}

export default base64
