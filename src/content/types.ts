export type Locale = "en" | "zh-Hant" | "nl";

export type LinkItem = {
  id: string;
  label: string;
  href: string;
};

export type Venue = {
  city: string;
  name: string;
  address: string;
  hours: string[];
};

export type Credit = {
  role: string;
  names: string;
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  date: string;
  status: "current" | "demo" | "past";
  summary: string;
  tags: string[];
  image?: string;
  venues: Venue[];
  credits: Credit[];
  href: string | null;
};

export type LocaleContent = {
  group: {
    name: string;
    handle: string;
    tagline: string;
    about: string;
    established: string;
  };
  ui: {
    group: string;
    currentProject: string;
    projects: string;
    aboutProject: string;
    aboutGroup: string;
    comingSoon: string;
    visit: string;
    demo: string;
    openArtwork: string;
    details: string;
    language: string;
    venues: string;
    credits: string;
    links: string;
  };
  featured: string;
  projects: Project[];
  links: LinkItem[];
};
