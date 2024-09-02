import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { InteractionType, InteractionResponseType } from 'discord-interactions';
import {
  VerifyDiscordRequest,
  getServerLeaderboard,
  createPlayerEmbed,
} from './utils.js';
import { getFakeProfile, getWikiItem } from './game.js';

// Convert file URL to file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the badges.json file
const badgesPath = path.join(__dirname, '../Vencordy/_api/badges.json');

// Function to read badges.json
function readBadges() {
  if (!fs.existsSync(badgesPath)) {
    return {};
  }
  const data = fs.readFileSync(badgesPath, 'utf8');
  return JSON.parse(data);
}

// Function to write to badges.json
function writeBadges(data) {
  fs.writeFileSync(badgesPath, JSON.stringify(data, null, 2), 'utf8');
}

// Function to add a badge to badges.json
function addBadge(userId, tooltip, badgeUrl) {
  const badges = readBadges();
  if (!badges[userId]) {
    badges[userId] = [];
  }
  badges[userId].push({ tooltip, badge: badgeUrl });
  writeBadges(badges);
}

function removeBadge(userId, badgeIndex) {
  const badges = readBadges();
  if (badges[userId] && badges[userId].length > badgeIndex) {
    badges[userId].splice(badgeIndex, 1);
    writeBadges(badges);
    return true;
  }
  return false;
}

const allowedUsersPath = path.join(__dirname, '../Vencordy/_api/allowed.json');

// Function to read allowed users
function readAllowedUsers() {
  if (!fs.existsSync(allowedUsersPath)) {
    return [];
  }
  const data = fs.readFileSync(allowedUsersPath, 'utf8');
  return JSON.parse(data);
}

// Function to check if a user is allowed
function isUserAllowed(userId) {
  const allowedUsers = readAllowedUsers();
  return allowedUsers.includes(userId);
}

let httpcats = [
    100, 101, 102, 103, 200, 201, 202, 203, 204, 205, 206, 207, 208, 214, 226, 300, 301, 302, 303, 304, 305, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 420, 421, 422, 423, 424, 425, 426, 428, 429, 431, 444, 450, 451, 497, 498, 499, 500, 501, 502, 503, 504, 506, 507, 508, 509, 510, 511, 521, 522, 523, 525, 530, 599
];
let randomIndex = Math.floor(Math.random() * httpcats.length);

function getcat() {
  return httpcats[randomIndex]
}

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  const { type, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;

    // Extract user ID
    const userId = req.body.member?.user.id || req.body.user?.id;

    // Check if the user is allowed
    if (!isUserAllowed(userId) && (name === 'badge')) {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `<:uwu:1276540332267409472> **oopsie**\n-# You are not allowed to manage badges.`,
        },
      });
    }

    if (name === 'mew') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Mew"
        }
      })
    }

    if (name === 'httpcat') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: getcat()
        }
      })
    }

    if (name === 'badge') {
      const subcommand = options[0].name;

      if (subcommand === 'add') {
        const tooltip = options[0].options.find(opt => opt.name === 'text').value;
        const badgeUrl = options[0].options.find(opt => opt.name === 'url').value;

        addBadge(userId, tooltip, badgeUrl);

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Badge added for <@${userId}>: ${tooltip} - ${badgeUrl}`,
          },
        });
      } else if (subcommand === 'remove') {
        const badgeIndex = options[0].options.find(opt => opt.name === 'index').value - 1;

        if (removeBadge(userId, badgeIndex)) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Badge #${badgeIndex + 1} has been removed, <@${userId}>.`,
            },
          });
        } else {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Could not remove badge #${badgeIndex + 1}, <@${userId}>. Make sure the badge number is correct.`,
            },
          });
        }
      } else if (subcommand === 'list') {
        const badges = readBadges()[userId] || [];

        if (badges.length === 0) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `You don't have any badges yet, <@${userId}>.`,
            },
          });
        }

        const badgeList = badges.map((badge, index) =>
          `**${index + 1}.** ${badge.tooltip} - [Link](${badge.badge})`
        ).join('\n');

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Here are your badges, <@${userId}>:\n${badgeList}`,
          },
        });
      }
    }

    if (name === 'admin') {
      // Restrict access to the admin commands
      if (userId !== '895722260726440007') {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `<:uwu:1276540332267409472> **oopsie**\n-# You don't have permission to use this command.`,
          },
        });
      }

      const subcommand = options[0].name;

      if (subcommand === 'remove') {
        const targetUserId = options[0].options.find(opt => opt.name === 'userid').value;
        const badgeIndex = options[0].options.find(opt => opt.name === 'badgeid').value - 1;

        if (removeBadge(targetUserId, badgeIndex)) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Badge #${badgeIndex + 1} has been removed from <@${targetUserId}>.`,
            },
          });
        } else {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Could not remove badge #${badgeIndex + 1} from <@${targetUserId}>. Make sure the badge number is correct.`,
            },
          });
        }
      } else if (subcommand === 'change') {
        const targetUserId = options[0].options.find(opt => opt.name === 'userid').value;
        const badgeIndex = options[0].options.find(opt => opt.name === 'badgeid').value - 1;
        const newUrl = options[0].options.find(opt => opt.name === 'url')?.value;
        const newText = options[0].options.find(opt => opt.name === 'text')?.value;
        const badges = readBadges();

        if (badges[targetUserId] && badges[targetUserId][badgeIndex]) {
          if (newUrl) {
            badges[targetUserId][badgeIndex].badge = newUrl;
          }
          if (newText) {
            badges[targetUserId][badgeIndex].tooltip = newText;
          }
          writeBadges(badges);

          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Badge #${badgeIndex + 1} for <@${targetUserId}> has been updated.${newUrl ? ` New URL: ${newUrl}` : ''}${newText ? ` New Tooltip: ${newText}` : ''}`,
            },
          });
        } else {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `<@${targetUserId}> does not have a badge with ID ${badgeIndex + 1}.`,
            },
          });
        }
      } else if (subcommand === 'list') {
        const badges = readBadges();

        if (Object.keys(badges).length === 0) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `No badges found for any users.`,
            },
          });
        }

        const allBadges = Object.entries(badges).map(([userId, badges]) => {
          const badgeList = badges.map((badge, index) =>
            `**${index + 1}.** ${badge.tooltip} - [Link](${badge.badge})`
          ).join('\n');
          return `<@${userId}>:\n${badgeList}`;
        }).join('\n\n');

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Here are all the badges:\n${allBadges}`,
          },
        });
      }
    }
  }

  if (type === InteractionType.MESSAGE_COMPONENT) {
    const profile = getFakeProfile(0);
    const profileEmbed = createPlayerEmbed(profile);
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [profileEmbed],
      },
    });
  }
});




app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});