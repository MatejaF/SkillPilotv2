import 'dotenv/config';

export default {
  expo: {
    name: "SkillPilot",
    slug: "skillpilot",
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
  },
};
