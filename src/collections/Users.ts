import type { Access, CollectionConfig } from 'payload'

const isAppUser = (user: unknown): user is { collection: 'users'; id: string | number } =>
  Boolean(
    user &&
    typeof user === 'object' &&
    'collection' in user &&
    user.collection === 'users' &&
    'id' in user,
  )

const readOwnProfile: Access = ({ req }) => {
  if (!isAppUser(req.user)) return false
  return { id: { equals: req.user.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    hidden: true,
    useAsTitle: 'email',
  },
  auth: {
    maxLoginAttempts: 8,
    tokenExpiration: 60 * 60 * 2,
  },
  access: {
    create: () => true,
    delete: () => false,
    read: readOwnProfile,
    update: readOwnProfile,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      maxLength: 80,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      maxLength: 80,
    },
    {
      name: 'averageMonthlyRevenue',
      type: 'number',
      required: true,
      min: 0,
      max: 100000000,
    },
    {
      name: 'establishedMonth',
      type: 'text',
      required: true,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !/^(0[1-9]|1[0-2])\/\d{4}$/.test(value)) {
          return 'Enter the date as MM/YYYY.'
        }
        return true
      },
    },
    {
      name: 'referralCode',
      type: 'text',
      maxLength: 60,
    },
  ],
  versions: false,
}
