import 'dotenv/config';

export default {
  expo: {
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      eas: {
        projectId: '06cb09f6-d355-4d06-8b3c-17aa7bf842da'
      }
    },
    name: "SkillPilot",
    slug: "skillpilot",
    owner: "matejaf13",
    android: {
      package: "com.matejaf13.skillpilot"
    }
  },
};
