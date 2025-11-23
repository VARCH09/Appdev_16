import 'dotenv/config';

export default {
  expo: {
    name: "jebb_clean",
    slug: "jebb_clean",
    extra: {
      openrouterKey: process.env.EXPO_PUBLIC_OPENROUTER_KEY,
    },
  },
};
