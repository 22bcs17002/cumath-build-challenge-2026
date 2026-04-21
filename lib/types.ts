export interface GeneratedPost {
  id: string;
  platform: 'linkedin' | 'reddit' | 'twitter' | 'instagram carousel';
  content: string;
  hashtags?: string[];
  title?: string;
}

export interface UserConfig {
  knowledgeBase: string;
  topic: string;
  tone: string;
  targetAudience: string;
  postLength: string;
  postsPerPlatform: {
    linkedin: number;
    reddit: number;
    twitter: number;
    'instagram carousel': number;
  };
}

export interface ApiKeys {
  openai: string;
  gemini: string;
}