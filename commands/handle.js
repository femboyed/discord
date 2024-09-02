import 'dotenv/config';
import { fakeGameItems } from './game.js';
import { InstallGlobalCommands } from './utils.js';

const BADGE = {
  name: 'badge',
  description: 'Commands to manage your Vencordy badges',
  type: 1, // This is a command
  options: [
    {
      name: 'add',
      description: 'Add a badge to your profile',
      type: 1, // Subcommand
      options: [
        {
          type: 3, // String
          name: 'text',
          description: 'Tooltip text that shows up on hover',
          required: true,
        },
        {
          type: 3, // String
          name: 'url',
          description: 'The image URL for your badge gif/png/*',
          required: true,
        },
      ],
    },
    {
      name: 'remove',
      description: 'Remove a badge from your profile',
      type: 1, // Subcommand
      options: [
        {
          type: 4, // Integer
          name: 'index',
          description: 'The index of the badge to remove',
          required: true,
        },
      ],
    },
    {
      name: 'list',
      description: 'List all badges on your profile',
      type: 1, // Subcommand
    },
  ],
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const ADMIN = {
  name: 'admin',
  description: 'Admin commands to manage all badges',
  type: 1, // Command
  options: [
    {
      name: 'remove',
      description: 'Remove a badge from a user\'s profile',
      type: 1, // Subcommand
      options: [
        {
          type: 6, // User
          name: 'userid',
          description: 'The user ID',
          required: true,
        },
        {
          type: 4, // Integer
          name: 'badgeid',
          description: 'The badge ID to remove',
          required: true,
        },
      ],
    },
    {
      name: 'change',
      description: 'Change the badge URL and/or text for a user',
      type: 1, // Subcommand
      options: [
        {
          type: 6, // User
          name: 'userid',
          description: 'The user ID',
          required: true,
        },
        {
          type: 4, // Integer
          name: 'badgeid',
          description: 'The badge ID to change',
          required: true,
        },
        {
          type: 3, // String
          name: 'url',
          description: 'The new URL for the badge',
          required: false,
        },
        {
          type: 3, // String
          name: 'text',
          description: 'The new tooltip text for the badge',
          required: false,
        },
      ],
    },
    {
      name: 'list',
      description: 'List all badges for every user',
      type: 1, // Subcommand
    },
  ],
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const MEW = {
  name: 'mew',
  description: 'mew',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
}

const httpcat = {
  name: 'httpcat',
  description: 'Get a random httpcat image',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
}

// const LIST_BADGES = {
//   name: 'listbadges',
//   type: 1,
//   description: 'List your badges',
//   integration_types: [0, 1],
//   contexts: [0, 1, 2],
// }
// const REMOVE_BADGE = {
//   name: 'removebadge',
//   type: 1,
//   description: 'Kily yourself a badge',
//   options: [
//     {
//       type: 3,
//       name: 'index',
//       description: 'badge index',
//       required: true
//     }
//   ],
//   integration_types: [0, 1],
//   contexts: [0, 1, 2],
// }


// const ADD_BADGE = {
//   name: 'addbadge',
//   type: 1,
//   description: 'Add yourself a badge',
//   options: [
//     {
//       type: 3,
//       name: 'text',
//       description: 'badge tooltip',
//       required: true
//     },
//     {
//       type: 3,
//       name: 'url',
//       description: 'badge icon',
//       required: true
//     }
//   ],
//   integration_types: [0, 1],
//   contexts: [0, 1, 2],
// }

const ALL_COMMANDS = [
  // ADD_BADGE,
  // LIST_BADGES,
  // REMOVE_BADGE,
  // BADGE,
  // ADMIN,
  MEW,
  httpcat
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);