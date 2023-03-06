import { readFileSync } from 'fs'
import { join } from 'path'

import chalk from 'chalk'

const loadFile = (path) => JSON.parse(readFileSync(path, 'utf8'))

export type Falsy = false | 0 | '' | null | undefined

export const isTruthy = <T>(x: T | Falsy): x is T => !!x

const generateGraphiQLHeader = () => {
  const path = join(
    __dirname.split('/').slice(0, -3).join('/'),
    'src/lib/devAuthorizationHeaders.json'
  )

  const file = loadFile(path)

  if (isTruthy(file)) {
    return JSON.stringify(file)
  } else {
    const infoMessage =
      'To populate `http://localhost:8911/graphql` playground with your clerk authorization headers, run `yarn genAuthHeaders your-email@email.com`'
    console.info(chalk.blue(infoMessage))

    const message = `{"x-auth-comment": "${infoMessage}"`
    return message
  }
}

export default generateGraphiQLHeader
