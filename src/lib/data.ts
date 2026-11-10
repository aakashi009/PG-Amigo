export type Listing = {
  id: string;
  name: string;
  area: string;
  college: string;
  distance: number;
  price: number;
  gender: string;
  sharing: string;
  food: boolean;
  ac: boolean;
  image: string;
  rating: number;
  reviews: number;
  featured: boolean;
  amenities: string[];
  beds: number;
};
export const listings: Listing[] = [
  {
    id: "olive",
    name: "Olive Living PG",
    area: "Koramangala",
    college: "Christ University",
    distance: 1.2,
    price: 8500,
    gender: "Boys",
    sharing: "Double",
    food: true,
    ac: false,
    image: "/images/olive.jpg",
    rating: 4.8,
    reviews: 42,
    featured: true,
    amenities: ["Wi-Fi", "Meals", "Laundry"],
    beds: 3,
  },
  {
    id: "nest",
    name: "The Nest — Student Living",
    area: "BTM Layout",
    college: "Christ University",
    distance: 1.8,
    price: 10500,
    gender: "Girls",
    sharing: "Single",
    food: true,
    ac: true,
    image: "/images/nest.jpg",
    rating: 4.9,
    reviews: 36,
    featured: true,
    amenities: ["Wi-Fi", "AC", "Meals"],
    beds: 2,
  },
  {
    id: "urban",
    name: "Urban Stay Co-living",
    area: "HSR Layout",
    college: "Christ University",
    distance: 3.4,
    price: 7500,
    gender: "Co-living",
    sharing: "Triple",
    food: false,
    ac: false,
    image: "/images/urban.jpg",
    rating: 4.6,
    reviews: 28,
    featured: false,
    amenities: ["Wi-Fi", "Kitchen", "Housekeeping"],
    beds: 5,
  },
  {
    id: "campus",
    name: "Campus Corner PG",
    area: "Koramangala",
    college: "Jyoti Nivas College",
    distance: 0.6,
    price: 6800,
    gender: "Girls",
    sharing: "Double",
    food: true,
    ac: false,
    image: "/images/campus.jpg",
    rating: 4.7,
    reviews: 24,
    featured: false,
    amenities: ["Wi-Fi", "Meals", "Security"],
    beds: 4,
  },
  {
    id: "haven",
    name: "Haven House",
    area: "BTM Layout",
    college: "Christ University",
    distance: 2.1,
    price: 12000,
    gender: "Boys",
    sharing: "Single",
    food: false,
    ac: true,
    image: "/images/haven.jpg",
    rating: 4.8,
    reviews: 19,
    featured: false,
    amenities: ["Wi-Fi", "AC", "Gym"],
    beds: 1,
  },
  {
    id: "flora",
    name: "Flora Student Homes",
    area: "HSR Layout",
    college: "Jyoti Nivas College",
    distance: 2.8,
    price: 9000,
    gender: "Girls",
    sharing: "Double",
    food: true,
    ac: false,
    image: "/images/flora.jpg",
    rating: 4.9,
    reviews: 31,
    featured: false,
    amenities: ["Wi-Fi", "Meals", "Laundry"],
    beds: 3,
  },
];
export type Traits = {
  sleep: string;
  food: string;
  smoking: string;
  cleanliness: number;
  social: string;
};
export type Preferences = {
  traits: Traits;
  weights: Record<keyof Traits, number>;
  dealbreakers: (keyof Traits)[];
};
export type Roommate = {
  id: string;
  name: string;
  age: number;
  gender: string;
  city: string;
  college: string;
  course: string;
  budget: [number, number];
  bio: string;
  interests: string[];
  traits: Traits;
  preferences: Preferences;
  avatar: string;
  anyGender: boolean;
};
export const defaultTraits: Traits = {
  sleep: "Early bird",
  food: "Vegetarian",
  smoking: "No",
  cleanliness: 4,
  social: "Ambivert",
};
export const defaultPreferences: Preferences = {
  traits: defaultTraits,
  weights: { sleep: 2, food: 2, smoking: 3, cleanliness: 2, social: 1 },
  dealbreakers: ["smoking"],
};
export const defaultProfile: Roommate = {
  id: "you",
  name: "You",
  age: 21,
  gender: "Woman",
  city: "Bengaluru",
  college: "Christ University",
  course: "Student",
  budget: [6000, 12000],
  bio: "",
  interests: ["Music", "Travel"],
  traits: defaultTraits,
  preferences: defaultPreferences,
  avatar: "",
  anyGender: false,
};
export const roommates: Roommate[] = [
  {
    id: "ananya",
    name: "Ananya S.",
    age: 21,
    gender: "Woman",
    city: "Bengaluru",
    college: "Christ University",
    course: "BBA · 3rd year",
    budget: [8000, 12000],
    bio: "Usually found with a book or hunting for the best filter coffee. Looking for a tidy space and a roommate who becomes a friend.",
    interests: ["Coffee", "Music", "Travel"],
    traits: defaultTraits,
    preferences: defaultPreferences,
    avatar: "/images/ananya.jpg",
    anyGender: false,
  },
  {
    id: "riya",
    name: "Riya M.",
    age: 22,
    gender: "Woman",
    city: "Bengaluru",
    college: "Jyoti Nivas College",
    course: "MSc · 1st year",
    budget: [7000, 10000],
    bio: "A little introverted, a lot into art. I love quiet evenings, weekend walks, and keeping our shared space cosy.",
    interests: ["Art", "Books", "Music"],
    traits: { ...defaultTraits, social: "Introvert", sleep: "Night owl" },
    preferences: defaultPreferences,
    avatar: "/images/riya.jpg",
    anyGender: false,
  },
  {
    id: "meera",
    name: "Meera K.",
    age: 20,
    gender: "Woman",
    city: "Bengaluru",
    college: "Christ University",
    course: "BA · 2nd year",
    budget: [6500, 9500],
    bio: "New to the city and ready to explore! Looking for someone considerate who enjoys good food and a movie night.",
    interests: ["Movies", "Travel", "Cooking"],
    traits: { ...defaultTraits, food: "Non-vegetarian", social: "Extrovert" },
    preferences: defaultPreferences,
    avatar: "/images/meera.jpg",
    anyGender: false,
  },
  {
    id: "arjun",
    name: "Arjun R.",
    age: 22,
    gender: "Man",
    city: "Bengaluru",
    college: "Christ University",
    course: "MCA · 1st year",
    budget: [7000, 11000],
    bio: "Coding, cricket, and Sunday breakfasts. Looking for a clean room and an easygoing flatmate.",
    interests: ["Coding", "Cricket", "Music"],
    traits: defaultTraits,
    preferences: defaultPreferences,
    avatar: "/images/arjun.jpg",
    anyGender: false,
  },
];
export function filterListings(
  items: Listing[],
  f: {
    query: string;
    budget: number;
    genders: string[];
    sharing: string[];
    food: boolean;
    ac: boolean;
    sort: string;
  },
) {
  const query = f.query.trim().toLowerCase();
  const result = items.filter(
    (p) =>
      (!query ||
        [p.name, p.area, p.college, "Bengaluru"].some((s) =>
          s.toLowerCase().includes(query),
        )) &&
      p.price <= f.budget &&
      (!f.genders.length || f.genders.includes(p.gender)) &&
      (!f.sharing.length || f.sharing.includes(p.sharing)) &&
      (!f.food || p.food) &&
      (!f.ac || p.ac),
  );
  return [...result].sort((a, b) =>
    f.sort === "price"
      ? a.price - b.price
      : f.sort === "distance"
        ? a.distance - b.distance
        : f.sort === "rating"
          ? b.rating - a.rating
          : Number(b.featured) - Number(a.featured),
  );
}
