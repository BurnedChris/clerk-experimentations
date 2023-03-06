import { writeFile } from 'fs'

import { users, Clerk } from '@clerk/clerk-sdk-node'
import chalk from 'chalk'

// This function generates a unique id number for a new id in the database
// The generated id string is then returned

const createGraphiQLHeaders = async () => {
  const clerk = Clerk({ apiKey: process.env.CLERK_API_KEY })

  // createUser
  const emailAddress = process.argv[2]

  if (!emailAddress) {
    console.error(
      chalk.red(
        'Error: Cannot make Auth headers, Email Address is missing from the script `yarn genAuthHeaders christopher@everfund.com`'
      )
    )
    return null
  }

  const clerkUser = await users.createUser({
    emailAddress: [emailAddress],
    publicMetadata: {
      onboardingHasAvatar: 'notStarted',
      onboardingHasName: 'notStarted',
      onboardingHasTeam: 'notStarted',
      onboardingHasTermsAndConditions: 'notStarted',
      onboardingHasPrivacyPolicy: 'notStarted',
      liveMode: false,
    },
  })

  // This should make a test JWT so it can be injected into the headers
  const createdJWT = await clerk.unsafe_createJWT({
    userId: clerkUser.id,
    expiresInSeconds: 604800,
  })

  const token = JSON.stringify({
    'auth-provider': 'clerk',
    authorization: `Bearer ${createdJWT}`,
  })

  writeFile('./api/src/lib/devAuthorizationHeaders.json', token, {}, () => {})

  return token
}

createGraphiQLHeaders()
