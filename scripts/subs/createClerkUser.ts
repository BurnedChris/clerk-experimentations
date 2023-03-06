import { users } from '@clerk/clerk-sdk-node'
import { db } from 'api/src/lib/db'
import { customAlphabet } from 'nanoid'

const idNumberAlphabet = customAlphabet(
  '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
  24
)

const createClerkUser = async (emailAddress) => {
  const externalId = `u_${await idNumberAlphabet()}`

  const clerkUser = await users.createUser({
    externalId,
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
  await db.user.create({
    data: {
      id: externalId,
      email: emailAddress,
      clerkUserId: clerkUser.id,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      avatarUrl: clerkUser.profileImageUrl,
    },
  })
  return clerkUser
}

export default createClerkUser
