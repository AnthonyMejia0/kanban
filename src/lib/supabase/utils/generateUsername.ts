const adjectives = [
  'swift',
  'silent',
  'brave',
  'fuzzy',
  'cosmic',
  'lucky',
  'electric',
  'golden',
  'rapid',
  'clever',
  'crimson',
  'icy',
  'shadow',
  'solar',
  'stormy',
];

const nouns = [
  'otter',
  'falcon',
  'tiger',
  'panda',
  'wolf',
  'phoenix',
  'comet',
  'lynx',
  'dragon',
  'bear',
  'fox',
  'rabbit',
  'hawk',
  'orca',
  'viper',
];

export const generateUsername = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];

  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  const id = crypto.randomUUID().slice(0, 6);

  return `${adjective}-${noun}-${id}`;
};
