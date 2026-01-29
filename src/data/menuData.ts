export interface Topping {
  id: string;
  name: string;
  japanese: string;
  price: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  fiber?: number;
}

export interface ReviewData {
  rating: number;
  count: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  featured: {
    id: string;
    author: string;
    date: string;
    rating: number;
    text: string;
    helpful: number;
    verified: boolean;
  }[];
}

export interface MenuItem {
  id: number;
  slug: string;
  name: string;
  japanese: string;
  description: string;
  longDescription: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  category: "ramen" | "appetizers" | "drinks" | "desserts";
  bestseller: boolean;
  isNew: boolean;
  spicy: 0 | 1 | 2 | 3;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  prepTime: number;
  calories: number;
  customizable: boolean;
  serves: number;
  ingredients: string[];
  allergens: string[];
  nutrition: NutritionInfo;
  pairings: number[];
  reviews: ReviewData;
}

export const toppings: Topping[] = [
  { id: "chashu", name: "Extra Chashu", japanese: "チャーシュー", price: 3.0 },
  { id: "egg", name: "Soft-Boiled Egg", japanese: "味玉", price: 1.5 },
  { id: "noodles", name: "Extra Noodles", japanese: "替え玉", price: 2.0 },
  { id: "nori", name: "Nori Sheets", japanese: "海苔", price: 1.0 },
  { id: "corn", name: "Sweet Corn", japanese: "コーン", price: 1.0 },
  { id: "bamboo", name: "Bamboo Shoots", japanese: "メンマ", price: 1.5 },
  { id: "greenOnion", name: "Green Onions", japanese: "ネギ", price: 0 },
  { id: "mushrooms", name: "Shiitake Mushrooms", japanese: "椎茸", price: 2.0 },
  { id: "butter", name: "Butter", japanese: "バター", price: 0.5 },
  { id: "garlic", name: "Roasted Garlic", japanese: "にんにく", price: 1.0 },
];

export const brothRichness = [
  { id: "light", name: "Light", japanese: "あっさり" },
  { id: "medium", name: "Medium", japanese: "普通" },
  { id: "rich", name: "Rich", japanese: "こってり" },
];

export const noodleFirmness = [
  { id: "soft", name: "Soft", japanese: "やわめ" },
  { id: "medium", name: "Medium", japanese: "普通" },
  { id: "firm", name: "Firm (Al Dente)", japanese: "かため" },
];

export const spiceLevels = [
  { id: 0, name: "Mild", japanese: "マイルド" },
  { id: 1, name: "Medium", japanese: "普通" },
  { id: 2, name: "Hot", japanese: "辛い" },
  { id: 3, name: "Extra Hot", japanese: "激辛" },
];

export const categories = [
  { id: "all", name: "All", japanese: "全て" },
  { id: "ramen", name: "Ramen", japanese: "ラーメン" },
  { id: "appetizers", name: "Appetizers", japanese: "前菜" },
  { id: "drinks", name: "Drinks", japanese: "飲み物" },
  { id: "desserts", name: "Desserts", japanese: "デザート" },
];

export const menuItems: MenuItem[] = [
  {
    id: 1,
    slug: "tonkotsu-ramen",
    name: "Tonkotsu Ramen",
    japanese: "豚骨ラーメン",
    description: "Rich pork bone broth simmered for 18 hours with chashu, soft-boiled egg, green onions, and nori.",
    longDescription: `The art of Tonkotsu begins before dawn, when our chefs fire up the massive stockpots. Pork bones, carefully selected and cleaned, bubble and reduce over low heat throughout the day and night. This patient process breaks down collagen into gelatin, creating the signature creamy texture that Tonkotsu lovers crave.

Our recipe pays homage to the original Fukuoka-style ramen, where this dish was perfected in the bustling yatai (food stalls) of southern Japan. We've added our own Yume touch: a secret blend of aromatics and a finishing drizzle of garlic-infused oil that brings depth without overpowering the delicate pork essence.

Every bowl is crafted to order with our hand-pulled noodles, cooked to your preferred firmness. This is ramen as meditation—rich, comforting, and utterly unforgettable.`,
    price: 14.99,
    rating: 4.9,
    reviewCount: 328,
    image: "/items/Tonkotsu.jpg",
    images: ["/items/Tonkotsu.jpg", "/items/Tonkotsu2.jpg", "/items/Tonkotsu3.jpg", "/items/Tonkotsu4.jpg"],
    category: "ramen",
    bestseller: true,
    isNew: false,
    spicy: 0,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    prepTime: 10,
    calories: 680,
    customizable: true,
    serves: 1,
    ingredients: ["Pork bone broth", "Chashu pork belly", "Ramen noodles", "Soft-boiled egg", "Green onions", "Nori seaweed", "Garlic oil", "Bamboo shoots", "Sesame seeds"],
    allergens: ["Gluten", "Egg", "Soy", "Sesame"],
    nutrition: { calories: 680, protein: 32, carbs: 58, fat: 34, sodium: 1850, fiber: 3 },
    pairings: [7, 10, 13],
    reviews: {
      rating: 4.9,
      count: 328,
      breakdown: { 5: 280, 4: 35, 3: 10, 2: 2, 1: 1 },
      featured: [
        { id: "r1", author: "Sarah M.", date: "2025-12-15", rating: 5, text: "Absolutely incredible! The broth is so rich and creamy, you can taste the hours of simmering. The chashu melts in your mouth. Best ramen I've had outside of Japan.", helpful: 47, verified: true },
        { id: "r2", author: "James K.", date: "2025-11-28", rating: 5, text: "This tonkotsu is the real deal. Perfectly milky broth, excellent noodle texture, and the egg was cooked to perfection. Will definitely be back!", helpful: 32, verified: true },
        { id: "r3", author: "Emily R.", date: "2025-10-19", rating: 4, text: "Really good ramen with great depth of flavor. Only reason for 4 stars is I wish the portion was slightly bigger. Quality is outstanding though.", helpful: 18, verified: true }
      ]
    }
  },
  {
    id: 2,
    slug: "spicy-miso-ramen",
    name: "Spicy Miso Ramen",
    japanese: "辛味噌ラーメン",
    description: "Fermented soybean paste broth with ground pork, corn, butter, and spicy chili oil.",
    longDescription: `Our Spicy Miso Ramen is a celebration of Hokkaido's culinary heritage, where cold winters demanded hearty, warming bowls of noodles. The base begins with our house-made miso paste, aged for months to develop complex umami notes that form the soul of this dish.

The heat comes from our custom chili oil blend—a careful balance of smoky, fruity, and sharp peppers that builds warmth without overwhelming the palate. Each bowl is finished with a generous pat of butter that melts into the broth, creating a luxurious richness that's distinctly Sapporo-style.

Ground pork, sweet corn kernels, and fresh bean sprouts add texture and sweetness that perfectly counterbalance the savory, spicy broth. This is comfort food elevated to an art form.`,
    price: 15.99,
    rating: 4.8,
    reviewCount: 256,
    image: "/items/spicyMiso.jpg",
    images: ["/items/spicyMiso.jpg", "/items/spicyMiso2.jpg", "/items/spicyMiso3.jpg"],
    category: "ramen",
    bestseller: false,
    isNew: false,
    spicy: 2,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    prepTime: 12,
    calories: 720,
    customizable: true,
    serves: 1,
    ingredients: ["Miso paste", "Pork broth", "Ground pork", "Ramen noodles", "Sweet corn", "Butter", "Chili oil", "Bean sprouts", "Green onions", "Sesame seeds"],
    allergens: ["Gluten", "Soy", "Dairy", "Sesame"],
    nutrition: { calories: 720, protein: 28, carbs: 62, fat: 38, sodium: 2100, fiber: 4 },
    pairings: [8, 12, 7],
    reviews: {
      rating: 4.8,
      count: 256,
      breakdown: { 5: 200, 4: 40, 3: 12, 2: 3, 1: 1 },
      featured: [
        { id: "r4", author: "Mike T.", date: "2025-12-20", rating: 5, text: "Perfect level of spice! The miso broth is incredibly flavorful and the butter adds such a nice richness. The corn adds a lovely sweetness.", helpful: 38, verified: true },
        { id: "r5", author: "Lisa H.", date: "2025-11-15", rating: 5, text: "As someone from Hokkaido, I can say this is authentic Sapporo-style miso ramen. Brought back memories of home. Highly recommend!", helpful: 52, verified: true },
        { id: "r6", author: "David W.", date: "2025-10-30", rating: 4, text: "Great spicy ramen with excellent depth. The chili oil is fragrant, not just hot. Would order again for sure.", helpful: 21, verified: true }
      ]
    }
  },
  {
    id: 3,
    slug: "shoyu-ramen",
    name: "Shoyu Ramen",
    japanese: "醤油ラーメン",
    description: "Classic soy sauce based broth with bamboo shoots, nori, and perfectly cooked noodles.",
    longDescription: `Shoyu Ramen represents the original Tokyo-style ramen that started it all. Our version honors this tradition while adding subtle refinements that make each bowl memorable. The clear, amber broth is deceptively complex—a careful blend of chicken and dashi stocks seasoned with premium aged soy sauce.

We source our shoyu from a family brewery that has been perfecting their craft for over a century. The result is a broth that's clean yet deeply satisfying, with layers of umami that unfold with each sip. The clarity of the soup allows every ingredient to shine.

Topped with our house-cured chashu, tender bamboo shoots, crispy nori, and a perfectly jammy egg, this is ramen in its most elegant form—understated yet unforgettable.`,
    price: 13.99,
    rating: 4.7,
    reviewCount: 189,
    image: "/items/shoyu.jpg",
    images: ["/items/shoyu.jpg", "/items/shoyu2.jpg", "/items/shoyu3.jpg"],
    category: "ramen",
    bestseller: false,
    isNew: false,
    spicy: 0,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    prepTime: 10,
    calories: 580,
    customizable: true,
    serves: 1,
    ingredients: ["Chicken broth", "Dashi", "Soy sauce", "Ramen noodles", "Chashu pork", "Bamboo shoots", "Nori seaweed", "Soft-boiled egg", "Green onions"],
    allergens: ["Gluten", "Egg", "Soy", "Fish"],
    nutrition: { calories: 580, protein: 26, carbs: 52, fat: 28, sodium: 1650, fiber: 2 },
    pairings: [7, 8, 12],
    reviews: {
      rating: 4.7,
      count: 189,
      breakdown: { 5: 140, 4: 35, 3: 10, 2: 3, 1: 1 },
      featured: [
        { id: "r7", author: "Tom N.", date: "2025-12-10", rating: 5, text: "Classic done right. The broth is so clean and flavorful. This is the ramen I crave when I want something comforting but not too heavy.", helpful: 29, verified: true },
        { id: "r8", author: "Amy L.", date: "2025-11-22", rating: 4, text: "Beautiful presentation and great taste. The soy sauce flavor is prominent but well-balanced. Noodles were perfectly chewy.", helpful: 15, verified: true },
        { id: "r9", author: "Chris P.", date: "2025-10-05", rating: 5, text: "If you want to taste what traditional ramen should be, order this. Simple, elegant, delicious.", helpful: 24, verified: true }
      ]
    }
  },
  {
    id: 4,
    slug: "tantanmen",
    name: "Tantanmen",
    japanese: "担々麺",
    description: "Creamy sesame broth with spicy minced pork, bok choy, and aromatic chili crisp.",
    longDescription: `Tantanmen is our tribute to the Sichuan dan dan noodles, reimagined through a Japanese lens. The broth combines rich sesame paste with our house-made chili oil, creating a nutty, spicy, and incredibly aromatic base that's both familiar and exotic.

The star of the show is our spicy minced pork, wok-fried with doubanjiang (fermented chili bean paste) until caramelized and intensely flavorful. Each bite delivers a punch of umami, heat, and sweetness that keeps you coming back for more.

Fresh bok choy adds a clean, crisp contrast to the rich broth, while our signature chili crisp—loaded with crispy shallots, garlic, and multiple types of dried chilies—provides textural excitement and aromatic complexity. This is ramen for those who like to live boldly.`,
    price: 16.99,
    rating: 4.9,
    reviewCount: 412,
    image: "/items/tantanmen.jpg",
    images: ["/items/tantanmen.jpg", "/items/Tantanmen2.jpg", "/items/Tantanmen3.jpg"],
    category: "ramen",
    bestseller: true,
    isNew: false,
    spicy: 2,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    prepTime: 12,
    calories: 750,
    customizable: true,
    serves: 1,
    ingredients: ["Sesame paste", "Chicken broth", "Chili oil", "Ground pork", "Doubanjiang", "Ramen noodles", "Bok choy", "Chili crisp", "Green onions", "Sichuan peppercorns"],
    allergens: ["Gluten", "Soy", "Sesame", "Peanuts"],
    nutrition: { calories: 750, protein: 30, carbs: 55, fat: 42, sodium: 1980, fiber: 4 },
    pairings: [8, 11, 10],
    reviews: {
      rating: 4.9,
      count: 412,
      breakdown: { 5: 365, 4: 35, 3: 8, 2: 3, 1: 1 },
      featured: [
        { id: "r10", author: "Michelle Y.", date: "2025-12-18", rating: 5, text: "This is hands down the best tantanmen I've ever had. The sesame broth is so creamy and the spice level is perfect. The chili crisp on top is addictive!", helpful: 67, verified: true },
        { id: "r11", author: "Kevin S.", date: "2025-12-01", rating: 5, text: "Incredible depth of flavor. The numbing sensation from the Sichuan peppercorns combined with the creamy sesame is amazing. Worth every penny.", helpful: 45, verified: true },
        { id: "r12", author: "Rachel B.", date: "2025-11-10", rating: 5, text: "I dream about this ramen. The spicy pork is so flavorful and the bok choy adds the perfect freshness. A must-try!", helpful: 38, verified: true }
      ]
    }
  },
  {
    id: 5,
    slug: "vegetable-miso-ramen",
    name: "Vegetable Miso Ramen",
    japanese: "野菜味噌ラーメン",
    description: "Hearty vegetable broth with tofu, seasonal vegetables, corn, and mushrooms.",
    longDescription: `Our Vegetable Miso Ramen proves that plant-based can be just as satisfying and flavorful as any meat-based bowl. The broth is built on a foundation of roasted vegetables and kombu seaweed, simmered for hours to extract maximum umami before being enriched with our house-made miso paste.

We use a blend of white and red miso for complexity—the white brings sweetness and subtlety, while the red adds depth and earthiness. The result is a broth that's rich, warming, and deeply satisfying without any animal products.

Topped with silky tofu, seasonal vegetables, sweet corn, and an array of mushrooms including shiitake and wood ear, this bowl is a celebration of vegetables at their finest. It's proof that going meat-free doesn't mean compromising on flavor.`,
    price: 13.99,
    rating: 4.6,
    reviewCount: 124,
    image: "/items/vegetableMisoRamen.jpg",
    images: ["/items/vegetableMisoRamen.jpg", "/items/vegetableMisoRamen2.jpg", "/items/vegetableMisoRamen3.jpg"],
    category: "ramen",
    bestseller: false,
    isNew: true,
    spicy: 0,
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    prepTime: 10,
    calories: 420,
    customizable: true,
    serves: 1,
    ingredients: ["Vegetable broth", "White miso", "Red miso", "Silken tofu", "Ramen noodles", "Shiitake mushrooms", "Wood ear mushrooms", "Sweet corn", "Bok choy", "Bean sprouts", "Green onions", "Kombu seaweed"],
    allergens: ["Gluten", "Soy"],
    nutrition: { calories: 420, protein: 18, carbs: 52, fat: 16, sodium: 1450, fiber: 6 },
    pairings: [8, 12, 16],
    reviews: {
      rating: 4.6,
      count: 124,
      breakdown: { 5: 85, 4: 28, 3: 8, 2: 2, 1: 1 },
      featured: [
        { id: "r13", author: "Vegan Foodie", date: "2025-12-12", rating: 5, text: "Finally a vegan ramen that doesn't feel like an afterthought! The miso broth is incredibly rich and the mushrooms add so much umami. Love it!", helpful: 34, verified: true },
        { id: "r14", author: "Sara T.", date: "2025-11-20", rating: 4, text: "Really tasty vegetable ramen. The tofu is silky and the vegetables are fresh. Would love more spice options but overall great!", helpful: 18, verified: true },
        { id: "r15", author: "Plant-Based Pete", date: "2025-10-28", rating: 5, text: "This is how vegan ramen should be done. No compromises on flavor. The broth is complex and satisfying. Highly recommend!", helpful: 26, verified: true }
      ]
    }
  },
  {
    id: 6,
    slug: "black-garlic-ramen",
    name: "Black Garlic Ramen",
    japanese: "黒にんにくラーメン",
    description: "Bold tonkotsu base with black garlic oil, chashu, and caramelized onions.",
    longDescription: `Our Black Garlic Ramen is an indulgent masterpiece for garlic lovers. Built on our signature tonkotsu base, this bowl is elevated with mayu—a traditional black garlic oil that transforms the entire experience. The oil is made by slowly cooking garlic in sesame oil until it turns jet black, developing sweet, nutty, and slightly bitter notes.

The addition of caramelized onions brings another layer of sweetness that perfectly complements the pungent garlic. Each element is designed to enhance the already rich tonkotsu broth, creating something greater than the sum of its parts.

This is not a shy bowl of ramen. It's bold, it's aromatic, and it will leave you satisfied in ways few dishes can. The black garlic oil swirled on top creates a striking visual presentation that's as Instagram-worthy as it is delicious.`,
    price: 17.99,
    rating: 4.8,
    reviewCount: 98,
    image: "/items/blackGarlicRamen.jpg",
    images: ["/items/blackGarlicRamen.jpg", "/items/blackGarlicRamen2.jpg", "/items/blackGarlicRamen3.jpg"],
    category: "ramen",
    bestseller: false,
    isNew: true,
    spicy: 1,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    prepTime: 15,
    calories: 780,
    customizable: true,
    serves: 1,
    ingredients: ["Pork bone broth", "Black garlic oil (Mayu)", "Chashu pork", "Ramen noodles", "Caramelized onions", "Soft-boiled egg", "Nori seaweed", "Green onions", "Sesame seeds", "Garlic chips"],
    allergens: ["Gluten", "Egg", "Soy", "Sesame"],
    nutrition: { calories: 780, protein: 34, carbs: 60, fat: 42, sodium: 1920, fiber: 3 },
    pairings: [10, 13, 7],
    reviews: {
      rating: 4.8,
      count: 98,
      breakdown: { 5: 78, 4: 15, 3: 4, 2: 1, 1: 0 },
      featured: [
        { id: "r16", author: "Garlic Lover", date: "2025-12-22", rating: 5, text: "If you love garlic, this is your ramen. The black garlic oil adds such a unique, sweet, savory depth. The caramelized onions are a perfect touch.", helpful: 28, verified: true },
        { id: "r17", author: "Frank M.", date: "2025-12-05", rating: 5, text: "New favorite ramen! The mayu is so fragrant and the tonkotsu base is perfect. Don't plan on kissing anyone after eating this though!", helpful: 35, verified: true },
        { id: "r18", author: "Nina K.", date: "2025-11-18", rating: 4, text: "Really interesting flavor profile. The black garlic adds complexity I've never experienced in ramen before. Will order again!", helpful: 15, verified: true }
      ]
    }
  },
  {
    id: 7,
    slug: "gyoza",
    name: "Gyoza (6 pcs)",
    japanese: "餃子",
    description: "Pan-fried pork and vegetable dumplings served with ponzu dipping sauce.",
    longDescription: `Our gyoza are a testament to the art of dumpling making. Each piece is handcrafted with a delicate wrapper that achieves the perfect balance—thin enough to be tender, yet sturdy enough to hold the juicy filling and develop a gorgeous golden crust.

The filling is a carefully balanced mixture of ground pork, napa cabbage, garlic chives, ginger, and our secret blend of seasonings. We fold each dumpling by hand using the traditional pleating technique, creating beautiful crescent shapes that cook up crispy on the bottom and tender on top.

Served with our house-made ponzu sauce enhanced with a touch of chili oil, these gyoza are the perfect starter to any ramen meal or a satisfying snack on their own.`,
    price: 7.99,
    rating: 4.8,
    reviewCount: 567,
    image: "/items/gyoza.jpg",
    images: ["/items/gyoza.jpg", "/items/gyoza2.jpg", "/items/gyoza3.jpg"],
    category: "appetizers",
    bestseller: true,
    isNew: false,
    spicy: 0,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    prepTime: 8,
    calories: 320,
    customizable: false,
    serves: 2,
    ingredients: ["Gyoza wrappers", "Ground pork", "Napa cabbage", "Garlic chives", "Fresh ginger", "Sesame oil", "Soy sauce", "Ponzu sauce", "Chili oil"],
    allergens: ["Gluten", "Soy", "Sesame"],
    nutrition: { calories: 320, protein: 14, carbs: 28, fat: 18, sodium: 680, fiber: 2 },
    pairings: [1, 3, 13],
    reviews: {
      rating: 4.8,
      count: 567,
      breakdown: { 5: 450, 4: 90, 3: 20, 2: 5, 1: 2 },
      featured: [
        { id: "r19", author: "Dumpling Dan", date: "2025-12-19", rating: 5, text: "Best gyoza in town! Perfectly crispy on the bottom, juicy inside. The ponzu dipping sauce is amazing. I could eat these all day.", helpful: 56, verified: true },
        { id: "r20", author: "Laura G.", date: "2025-11-30", rating: 5, text: "These gyoza are incredible. You can tell they're handmade. The filling is so flavorful and the wrapper has the perfect texture.", helpful: 42, verified: true },
        { id: "r21", author: "Ryan H.", date: "2025-10-25", rating: 4, text: "Really good gyoza. Crispy, juicy, and the dipping sauce is perfect. Would love if they offered a veggie option too!", helpful: 28, verified: true }
      ]
    }
  },
  {
    id: 8,
    slug: "edamame",
    name: "Edamame",
    japanese: "枝豆",
    description: "Steamed young soybeans sprinkled with sea salt.",
    longDescription: `Simple, satisfying, and impossibly addictive—our edamame is the perfect way to start your meal. We source premium young soybeans that are harvested at peak freshness, ensuring each pod is plump, tender, and bursting with that characteristic sweet, nutty flavor.

Steamed to order and finished with a generous sprinkle of flaky sea salt, these little pods are meant to be enjoyed slowly. Pop them from their shells, savor the warm beans, and let the conversation flow. It's the Japanese equivalent of a bread basket, but infinitely more fun to eat.

For those seeking a bit more excitement, ask for our spicy garlic version—tossed in chili flakes and minced garlic for an extra kick.`,
    price: 4.99,
    rating: 4.5,
    reviewCount: 234,
    image: "/items/edamame.jpg",
    images: ["/items/edamame.jpg", "/items/edamame2.jpg"],
    category: "appetizers",
    bestseller: false,
    isNew: false,
    spicy: 0,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    prepTime: 5,
    calories: 120,
    customizable: false,
    serves: 2,
    ingredients: ["Young soybeans", "Sea salt"],
    allergens: ["Soy"],
    nutrition: { calories: 120, protein: 11, carbs: 9, fat: 5, sodium: 280, fiber: 4 },
    pairings: [2, 4, 11],
    reviews: {
      rating: 4.5,
      count: 234,
      breakdown: { 5: 150, 4: 60, 3: 18, 2: 4, 1: 2 },
      featured: [
        { id: "r22", author: "Healthy Hannah", date: "2025-12-14", rating: 5, text: "Perfect starter! Fresh, perfectly salted, and so satisfying to pop out of the pods. Great healthy option while waiting for ramen.", helpful: 23, verified: true },
        { id: "r23", author: "Tim B.", date: "2025-11-08", rating: 4, text: "Good quality edamame with nice salt level. Simple but executed well. Can't go wrong with this as a starter.", helpful: 15, verified: true },
        { id: "r24", author: "Jenny K.", date: "2025-10-15", rating: 5, text: "Love the edamame here! Always fresh and perfectly seasoned. Ask for the spicy garlic version if you want something extra!", helpful: 31, verified: true }
      ]
    }
  },
  {
    id: 9,
    slug: "takoyaki",
    name: "Takoyaki (6 pcs)",
    japanese: "たこ焼き",
    description: "Crispy octopus balls topped with takoyaki sauce, mayo, and bonito flakes.",
    longDescription: `Transport yourself to the bustling streets of Osaka with our takoyaki—arguably Japan's most beloved street food. These golden spheres are made fresh in our custom cast iron pans, achieving the perfect contrast between a crispy exterior and a molten, creamy interior.

At the heart of each ball is a tender piece of octopus, surrounded by a batter enriched with dashi stock and studded with pickled ginger and green onions. The magic happens as they cook, developing a slight crust while remaining wonderfully custardy inside.

We finish each serving with a generous drizzle of our house takoyaki sauce (a sweet and savory blend similar to Worcestershire), creamy Kewpie mayo, a shower of dancing bonito flakes, and a dusting of aonori seaweed. Watch the bonito flakes dance from the heat—it's dinner and a show!`,
    price: 8.99,
    rating: 4.7,
    reviewCount: 189,
    image: "/items/takoyaki.jpg",
    images: ["/items/takoyaki.jpg", "/items/takoyaki2.jpg", "/items/takoyaki3.jpg"],
    category: "appetizers",
    bestseller: false,
    isNew: false,
    spicy: 0,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    prepTime: 10,
    calories: 380,
    customizable: false,
    serves: 2,
    ingredients: ["Wheat flour batter", "Dashi stock", "Octopus", "Pickled ginger", "Green onions", "Takoyaki sauce", "Kewpie mayo", "Bonito flakes", "Aonori seaweed"],
    allergens: ["Gluten", "Egg", "Fish", "Shellfish", "Soy"],
    nutrition: { calories: 380, protein: 16, carbs: 42, fat: 16, sodium: 720, fiber: 1 },
    pairings: [3, 11, 13],
    reviews: {
      rating: 4.7,
      count: 189,
      breakdown: { 5: 135, 4: 40, 3: 10, 2: 3, 1: 1 },
      featured: [
        { id: "r25", author: "Osaka Mike", date: "2025-12-17", rating: 5, text: "These takoyaki bring back memories of Dotonbori! Crispy outside, creamy inside, with great octopus pieces. The bonito flakes dancing is always fun to watch.", helpful: 38, verified: true },
        { id: "r26", author: "Foodie Fiona", date: "2025-11-25", rating: 5, text: "Amazing takoyaki! The texture is perfect and the sauce/mayo combo is addictive. One of the best I've had outside Japan.", helpful: 29, verified: true },
        { id: "r27", author: "Steve R.", date: "2025-10-20", rating: 4, text: "Really good octopus balls. Hot, flavorful, and fun to eat. Be careful - they're molten inside! Great with a cold beer.", helpful: 21, verified: true }
      ]
    }
  },
  {
    id: 10,
    slug: "karaage",
    name: "Karaage Chicken",
    japanese: "唐揚げ",
    description: "Japanese fried chicken pieces marinated in soy, ginger, and garlic.",
    longDescription: `Karaage is Japan's answer to fried chicken, and once you try our version, you'll understand why it has devotees worldwide. We marinate bite-sized pieces of chicken thigh in a mixture of soy sauce, sake, fresh ginger, and garlic for hours, allowing the flavors to penetrate deep into the meat.

The secret to our exceptionally crispy coating is a light dusting of potato starch rather than flour. This creates an impossibly crunchy, almost shatteringly crisp exterior that stays crispy far longer than traditional fried chicken. Each piece is double-fried for maximum crunch.

Served with a wedge of lemon and our house Kewpie mayo, these golden nuggets of joy are perfect for sharing (though you might not want to). The juicy, flavorful meat and crispy coating make this our most addictive appetizer.`,
    price: 9.99,
    rating: 4.9,
    reviewCount: 345,
    image: "/items/karaage.jpg",
    images: ["/items/karaage.jpg", "/items/karaage2.jpg", "/items/karaage3.jpg"],
    category: "appetizers",
    bestseller: true,
    isNew: false,
    spicy: 0,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    prepTime: 12,
    calories: 450,
    customizable: false,
    serves: 2,
    ingredients: ["Chicken thigh", "Soy sauce", "Sake", "Fresh ginger", "Garlic", "Potato starch", "Vegetable oil", "Kewpie mayo", "Lemon"],
    allergens: ["Soy", "Egg"],
    nutrition: { calories: 450, protein: 28, carbs: 22, fat: 28, sodium: 820, fiber: 0 },
    pairings: [1, 6, 13],
    reviews: {
      rating: 4.9,
      count: 345,
      breakdown: { 5: 305, 4: 30, 3: 8, 2: 1, 1: 1 },
      featured: [
        { id: "r28", author: "Fried Chicken Fan", date: "2025-12-21", rating: 5, text: "The BEST fried chicken I've ever had. The marinade is so flavorful and the coating is unbelievably crispy. I order this every single time.", helpful: 72, verified: true },
        { id: "r29", author: "Marcus J.", date: "2025-12-03", rating: 5, text: "This karaage is addictive. Crispy, juicy, perfectly seasoned. The ginger and garlic really shine through. A must-order!", helpful: 48, verified: true },
        { id: "r30", author: "Chicken Connoisseur", date: "2025-11-12", rating: 5, text: "Forget KFC, this is the real deal. Japanese fried chicken done right. The potato starch coating is genius - stays crispy forever.", helpful: 55, verified: true }
      ]
    }
  },
  {
    id: 11,
    slug: "ramune-soda",
    name: "Ramune Soda",
    japanese: "ラムネ",
    description: "Classic Japanese marble soda. Available in Original, Strawberry, and Melon.",
    longDescription: `Ramune is more than just a soda—it's an experience. This iconic Japanese drink, invented in 1884, is famous for its unique Codd-neck bottle sealed with a glass marble. The fun begins when you pop the marble into the bottle, releasing a satisfying fizz and unlocking the refreshing beverage inside.

We offer three beloved flavors: Original (a light, citrusy lemon-lime taste), Strawberry (sweet and fruity with that classic candy-like flavor), and Melon (the unmistakable honeydew melon taste that Japan is famous for). Each bottle is imported directly from Japan to ensure authentic flavor.

Whether you're cooling down after a spicy bowl of ramen or simply enjoying a taste of Japanese nostalgia, Ramune delivers that perfect balance of sweetness and fizz that makes it Japan's most beloved soft drink.`,
    price: 3.99,
    rating: 4.4,
    reviewCount: 156,
    image: "/items/ramuneSoda.webp",
    images: ["/items/ramuneSoda.webp"],
    category: "drinks",
    bestseller: false,
    isNew: false,
    spicy: 0,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    prepTime: 1,
    calories: 80,
    customizable: false,
    serves: 1,
    ingredients: ["Carbonated water", "Sugar", "Natural flavoring", "Citric acid"],
    allergens: [],
    nutrition: { calories: 80, protein: 0, carbs: 20, fat: 0, sodium: 10, fiber: 0 },
    pairings: [4, 9, 10],
    reviews: {
      rating: 4.4,
      count: 156,
      breakdown: { 5: 85, 4: 45, 3: 20, 2: 4, 1: 2 },
      featured: [
        { id: "r31", author: "Nostalgic Nick", date: "2025-12-11", rating: 5, text: "Love the marble bottle! So fun to open. The melon flavor is my favorite - tastes just like the ones I had in Tokyo.", helpful: 24, verified: true },
        { id: "r32", author: "Soda Samantha", date: "2025-11-18", rating: 4, text: "Fun drink with a unique bottle. Original flavor is refreshing and not too sweet. Perfect after a bowl of spicy ramen!", helpful: 18, verified: true },
        { id: "r33", author: "Kids Love It", date: "2025-10-22", rating: 5, text: "My kids go crazy for these! The marble bottle is so entertaining for them and the strawberry flavor is a hit.", helpful: 32, verified: true }
      ]
    }
  },
  {
    id: 12,
    slug: "japanese-green-tea",
    name: "Japanese Green Tea",
    japanese: "緑茶",
    description: "Freshly brewed premium Japanese green tea, served hot or cold.",
    longDescription: `Our green tea is sourced from the verdant hills of Uji, Kyoto—Japan's most renowned tea-growing region. We use high-grade sencha leaves, steamed immediately after harvesting to preserve their vibrant color and fresh, grassy flavor profile.

When served hot, the tea offers a soothing, vegetal taste with subtle sweetness and a clean finish that perfectly cleanses the palate between bites of rich ramen. The cold version is equally refreshing, with a slightly more pronounced umami character that makes it perfect for warmer days.

Green tea is not just delicious—it's also packed with antioxidants and has been a cornerstone of Japanese culture for centuries. We brew each cup fresh to order, ensuring you receive the full flavor and health benefits of these precious leaves.`,
    price: 2.99,
    rating: 4.6,
    reviewCount: 201,
    image: "/items/GreenTea.jpg",
    images: ["/items/GreenTea.jpg", "/items/GreenTea2.jpg"],
    category: "drinks",
    bestseller: false,
    isNew: false,
    spicy: 0,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    prepTime: 2,
    calories: 0,
    customizable: false,
    serves: 1,
    ingredients: ["Premium sencha green tea leaves", "Hot water"],
    allergens: [],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0, fiber: 0 },
    pairings: [1, 3, 14],
    reviews: {
      rating: 4.6,
      count: 201,
      breakdown: { 5: 130, 4: 50, 3: 15, 2: 4, 1: 2 },
      featured: [
        { id: "r34", author: "Tea Time", date: "2025-12-13", rating: 5, text: "Excellent quality green tea. You can taste the difference from typical tea bags. Fresh, grassy, and perfectly brewed.", helpful: 26, verified: true },
        { id: "r35", author: "Health Nut Helen", date: "2025-11-21", rating: 5, text: "So refreshing and clean-tasting. Perfect complement to ramen. Love that they use real quality leaves, not powder.", helpful: 19, verified: true },
        { id: "r36", author: "Cold Brew Chris", date: "2025-10-28", rating: 4, text: "The iced version is great! Slightly bitter but in a pleasant way. Great palate cleanser between bites of fatty ramen.", helpful: 22, verified: true }
      ]
    }
  },
  {
    id: 13,
    slug: "asahi-beer",
    name: "Asahi Beer",
    japanese: "アサヒビール",
    description: "Crisp and refreshing Japanese lager. 330ml bottle.",
    longDescription: `Asahi Super Dry revolutionized the beer world when it was introduced in 1987, pioneering the "dry beer" style that has since become Japan's most popular. Its signature karakuchi (dry) taste comes from a longer fermentation process that results in a clean, crisp finish with minimal aftertaste.

This is the perfect beer for pairing with ramen—its light body and refreshing character cut through the richness of pork broth without overwhelming the delicate flavors of the noodles. The subtle bitterness provides a pleasant contrast to savory dishes while the effervescence helps cleanse the palate.

We serve our Asahi ice-cold in the traditional 330ml bottle, the way it's meant to be enjoyed. Whether you're celebrating with friends or simply treating yourself after a long day, there's nothing quite like the satisfying crack of opening an Asahi alongside a steaming bowl of ramen.`,
    price: 4.99,
    rating: 4.5,
    reviewCount: 178,
    image: "/items/asahiBeer.jpg",
    images: ["/items/asahiBeer.jpg"],
    category: "drinks",
    bestseller: false,
    isNew: false,
    spicy: 0,
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    prepTime: 1,
    calories: 140,
    customizable: false,
    serves: 1,
    ingredients: ["Water", "Malted barley", "Rice", "Maize", "Hops", "Yeast"],
    allergens: ["Gluten"],
    nutrition: { calories: 140, protein: 1, carbs: 10, fat: 0, sodium: 10, fiber: 0 },
    pairings: [1, 6, 10],
    reviews: {
      rating: 4.5,
      count: 178,
      breakdown: { 5: 100, 4: 55, 3: 18, 2: 3, 1: 2 },
      featured: [
        { id: "r37", author: "Beer & Ramen", date: "2025-12-16", rating: 5, text: "The perfect pairing for tonkotsu! Crisp, cold, and refreshing. Cuts right through the rich broth. Can't have ramen without Asahi!", helpful: 35, verified: true },
        { id: "r38", author: "Lager Larry", date: "2025-11-29", rating: 4, text: "Classic Japanese beer. Light, clean, and easy to drink. Not the most complex beer but it's exactly what you want with Japanese food.", helpful: 21, verified: true },
        { id: "r39", author: "Import Ian", date: "2025-10-18", rating: 5, text: "Love that they serve authentic Japanese Asahi. Served ice cold. The dry finish is perfect with salty, savory ramen.", helpful: 28, verified: true }
      ]
    }
  },
  {
    id: 14,
    slug: "mochi-ice-cream",
    name: "Mochi Ice Cream (3 pcs)",
    japanese: "もちアイス",
    description: "Soft rice cake filled with ice cream. Matcha, vanilla, and strawberry.",
    longDescription: `Our mochi ice cream combines two beloved desserts into one perfect bite. The outer layer is made from mochiko (sweet rice flour), pounded until it achieves that characteristic soft, chewy texture that Japanese confections are famous for. Inside, you'll find a generous scoop of premium ice cream.

Each order includes three pieces: Matcha (made with ceremonial-grade Uji matcha for an authentic, slightly bitter green tea flavor), Vanilla (rich and creamy with real vanilla bean), and Strawberry (fruity and refreshing with real strawberry puree). The contrast between the chewy mochi and cold, creamy ice cream is simply irresistible.

These little spheres of happiness are the perfect way to end your meal—light enough that you won't feel overly full, but satisfying enough to hit that sweet spot. Store them at the perfect temperature so the mochi stays soft while the ice cream stays frozen.`,
    price: 6.99,
    rating: 4.8,
    reviewCount: 289,
    image: "/items/mochiIceCream.jpg",
    images: ["/items/mochiIceCream.jpg", "/items/mochiIceCream2.jpg", "/items/mochiIceCream3.jpg"],
    category: "desserts",
    bestseller: true,
    isNew: false,
    spicy: 0,
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    prepTime: 2,
    calories: 240,
    customizable: false,
    serves: 1,
    ingredients: ["Sweet rice flour (mochiko)", "Sugar", "Cream", "Milk", "Matcha powder", "Vanilla bean", "Strawberry puree", "Cornstarch"],
    allergens: ["Dairy"],
    nutrition: { calories: 240, protein: 4, carbs: 36, fat: 9, sodium: 45, fiber: 0 },
    pairings: [12, 1, 4],
    reviews: {
      rating: 4.8,
      count: 289,
      breakdown: { 5: 230, 4: 45, 3: 10, 2: 3, 1: 1 },
      featured: [
        { id: "r40", author: "Mochi Maria", date: "2025-12-20", rating: 5, text: "The matcha mochi is incredible! Real matcha flavor, not too sweet. The chewy mochi with cold ice cream is the perfect texture combo.", helpful: 41, verified: true },
        { id: "r41", author: "Dessert Dave", date: "2025-12-02", rating: 5, text: "Best mochi ice cream I've had. All three flavors are great but the strawberry is my favorite. Light and refreshing after a big bowl of ramen.", helpful: 33, verified: true },
        { id: "r42", author: "Sweet Tooth Sue", date: "2025-11-14", rating: 4, text: "Love these little balls of joy! The mochi is perfectly chewy and the ice cream is high quality. Wish they had more flavor options!", helpful: 25, verified: true }
      ]
    }
  },
  {
    id: 15,
    slug: "matcha-cheesecake",
    name: "Matcha Cheesecake",
    japanese: "抹茶チーズケーキ",
    description: "Creamy Japanese-style cheesecake with premium matcha green tea.",
    longDescription: `Our Matcha Cheesecake is a fusion of Western and Japanese dessert traditions, resulting in something truly special. Unlike dense New York-style cheesecake, Japanese cheesecake is known for its light, fluffy, almost soufflé-like texture—achieved through a meringue-based method that incorporates air into the batter.

We use premium ceremonial-grade matcha from Uji, Kyoto, which provides that distinctive earthy, slightly bitter green tea flavor that balances beautifully with the cream cheese sweetness. The vibrant green color is completely natural, coming solely from the high-quality matcha powder.

Each slice is a cloud-like experience—light enough that it almost melts on your tongue, yet rich enough to satisfy your dessert cravings. The subtle matcha bitterness cuts through the richness, making this one of those rare desserts you could eat every day without tiring of it.`,
    price: 7.99,
    rating: 4.7,
    reviewCount: 167,
    image: "/items/matchaCheescake.jpg",
    images: ["/items/matchaCheescake.jpg", "/items/matchaCheescake2.jpg", "/items/matchaCheescake3.jpg"],
    category: "desserts",
    bestseller: false,
    isNew: true,
    spicy: 0,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    prepTime: 3,
    calories: 320,
    customizable: false,
    serves: 1,
    ingredients: ["Cream cheese", "Eggs", "Sugar", "Heavy cream", "Matcha powder", "Flour", "Butter", "Graham cracker crust"],
    allergens: ["Dairy", "Egg", "Gluten"],
    nutrition: { calories: 320, protein: 6, carbs: 28, fat: 21, sodium: 220, fiber: 1 },
    pairings: [12, 5, 3],
    reviews: {
      rating: 4.7,
      count: 167,
      breakdown: { 5: 120, 4: 35, 3: 9, 2: 2, 1: 1 },
      featured: [
        { id: "r43", author: "Cheesecake Queen", date: "2025-12-18", rating: 5, text: "This is not your average cheesecake! So light and fluffy, like eating a matcha cloud. The green tea flavor is authentic and not overly sweet.", helpful: 36, verified: true },
        { id: "r44", author: "Matcha Matt", date: "2025-11-26", rating: 5, text: "As a matcha fanatic, I approve! You can really taste the quality of the matcha. The texture is unlike any cheesecake I've had - jiggly and light.", helpful: 29, verified: true },
        { id: "r45", author: "Japanese Dessert Fan", date: "2025-10-31", rating: 4, text: "Beautiful presentation and great matcha flavor. Japanese-style cheesecake is so much lighter than American. Perfect end to a meal.", helpful: 22, verified: true }
      ]
    }
  },
  {
    id: 16,
    slug: "dorayaki",
    name: "Dorayaki",
    japanese: "どら焼き",
    description: "Traditional Japanese pancake sandwich filled with sweet red bean paste.",
    longDescription: `Dorayaki holds a special place in Japanese culture—it's the favorite food of Doraemon, the beloved robotic cat from one of Japan's most popular anime series. But this traditional sweet has been delighting Japanese people for over a century, long before it achieved anime fame.

Our dorayaki consists of two fluffy, honey-infused pancakes sandwiching a generous layer of anko (sweet red bean paste). The pancakes are made from a batter containing honey, which gives them their characteristic golden color and subtle sweetness. We cook them on a special griddle to achieve the perfect texture—soft and slightly spongy with just a hint of caramelization.

The star is our house-made anko, slowly simmered azuki beans sweetened with sugar until they reach that perfect balance of sweet and earthy. This humble snack is a beautiful example of Japanese wagashi (traditional sweets), perfect with a cup of green tea.`,
    price: 4.99,
    rating: 4.6,
    reviewCount: 134,
    image: "/items/daroyaki.jpg",
    images: ["/items/daroyaki.jpg", "/items/dorayaki2.jpg", "/items/daroyaki3.jpg"],
    category: "desserts",
    bestseller: false,
    isNew: false,
    spicy: 0,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    prepTime: 2,
    calories: 280,
    customizable: false,
    serves: 1,
    ingredients: ["Flour", "Eggs", "Sugar", "Honey", "Baking powder", "Azuki red beans", "Water", "Salt"],
    allergens: ["Gluten", "Egg"],
    nutrition: { calories: 280, protein: 7, carbs: 52, fat: 4, sodium: 180, fiber: 4 },
    pairings: [12, 1, 5],
    reviews: {
      rating: 4.6,
      count: 134,
      breakdown: { 5: 90, 4: 32, 3: 9, 2: 2, 1: 1 },
      featured: [
        { id: "r46", author: "Anime Adam", date: "2025-12-15", rating: 5, text: "Now I understand why Doraemon loves these so much! The pancakes are so fluffy and the red bean paste is perfectly sweet. Great with green tea!", helpful: 28, verified: true },
        { id: "r47", author: "Traditional Treats", date: "2025-11-19", rating: 5, text: "Authentic dorayaki! The anko is house-made and you can tell - so much better than the pre-packaged ones. A lovely traditional dessert.", helpful: 24, verified: true },
        { id: "r48", author: "Red Bean Rachel", date: "2025-10-24", rating: 4, text: "If you like red bean, you'll love this. The pancakes are soft and honey-flavored. Not too sweet which I appreciate in Japanese desserts.", helpful: 19, verified: true }
      ]
    }
  },
];

export function getMenuItemBySlug(slug: string): MenuItem | undefined {
  return menuItems.find((item) => item.slug === slug);
}

export function getMenuItemById(id: number): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}

export function getRelatedProducts(item: MenuItem): MenuItem[] {
  return item.pairings
    .map((id) => getMenuItemById(id))
    .filter((product): product is MenuItem => product !== undefined);
}