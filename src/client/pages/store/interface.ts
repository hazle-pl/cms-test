// interface.ts

export interface TrafficData {
    sitename: string;
    description: string;
    store_screenshot: string;
    logo: string;
    top_countries: {
      CountryCode: string;
      Country: string;
      value: number;
    }[];
    monthly_visitors: {
      date: string;
      value: number;
    }[];
    percentage_increase: number;
    traffic_sources: {
      source: string;
      value: number;
      handler: string;
    }[];
  }
  
  export interface TiktokData {
    url: string;
    account_likes: string;
    account_followers: string;
    account_avatar: string;
    tiktok_count: number;
    tiktok: {
      title: string;
      views: string;
      img: string;
    }[];
  }
  