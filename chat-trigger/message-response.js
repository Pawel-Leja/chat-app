/**
 * This function generates the message response based on the string itself and the channel.
 * @param {*} sender_username
 * @param {*} reciever_username
 * @param {*} message
 * @param {*} channel
 * @returns {string} response
 */
const getResponse = (sender_username, reciever_username, message, channel) => {
  if (channel === 'instagram') {
    if (message.match(/how are you/i)) {
      return `Hey ${sender_username}! I'm fantastic!`;
    }
    if (message.match(/we meet/i)) {
      return `I don't meet with people on Instagram`;
    }
    if (message.match(/on my way/i)) {
      return `Where are you heading, ${sender_username}?`;
    }
    if (message.match(/i like you/i)) {
      return `Thanks!`;
    }
    if (message.match(/joke/i)) {
      return `${reciever_username} don't tell jokes!`;
    }
  }
  if (channel === 'facebook') {
    if (message.match(/how are you/i)) {
      return `${reciever_username} feels good`;
    }
    if (message.match(/we meet/i)) {
      return `Why not`;
    }
    if (message.match(/on my way/i)) {
      return `I'm waiting`;
    }
    if (message.match(/i like you/i)) {
      return `I ${reciever_username} like you too`;
    }
    if (message.match(/joke/i)) {
      return `What's the best thing about Switzerland? I don't know, but the flag is a big plus.`;
    }
  }
  if (channel === 'whatsapp') {
    if (message.match(/how are you/i)) {
      return `Don't want to talk`;
    }
    if (message.match(/we meet/i)) {
      return `Just send me your location ${sender_username}`;
    }
    if (message.match(/on my way/i)) {
      return `Safe travels`;
    }
    if (message.match(/i like you/i)) {
      return `Let's be besties!`;
    }
    if (message.match(/joke/i)) {
      return `I invented a new word! Plagiarism!`;
    }
  }
  if (channel === 'email') {
    if (message.match(/how are you/i)) {
      return `You find me in good times ${sender_username}`;
    }
    if (message.match(/we meet/i)) {
      return `${reciever_username} will meet with ${sender_username}`;
    }
    if (message.match(/on my way/i)) {
      return `Wait, where are you going ${sender_username}?`;
    }
    if (message.match(/i like you/i)) {
      return `${reciever_username} shall allow it`;
    }
    if (message.match(/joke/i)) {
      return `Hear about the new restaurant called Karma? There's no menu: You get what you deserve.`;
    }
  }
  return 'Umm, who are you?';
};
export default getResponse;
