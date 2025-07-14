//* Use for a better terminal experience when logging values and debugging
//* Usage: log.info('Hello World')

//* Remember to remove import from files when done debugging

import { logger } from 'react-native-logs'

const config = {
 severity: 'debug',
 transportOptions: {
  _def: 'info',
  colors: {
   info: 'blueBright',
   warn: 'yellowBright',
   error: 'redBright',
  },
 },
}

const log = logger.createLogger(config)

export default log
