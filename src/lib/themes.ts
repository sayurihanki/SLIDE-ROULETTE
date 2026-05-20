export type ThemeCategory =
  | "Corporate & Office Life"
  | "Food & Beverage"
  | "Self-Help & Wellness"
  | "History, Reimagined"
  | "Animals"
  | "Urban Life & Infrastructure"
  | "Tech Culture"
  | "Leisure & Pop Culture"
  | "Big & Abstract"
  | "Event-Specific";

export type AudienceHint =
  | "company"
  | "classroom"
  | "creative"
  | "party"
  | "general";

export type WorkSafeLevel = "safe" | "edgy";

export type ThemeOption = {
  theme: string;
  desc: string;
  category: ThemeCategory;
  audiences: AudienceHint[];
  workSafeLevel: WorkSafeLevel;
};

function theme(
  category: ThemeCategory,
  audiences: AudienceHint[],
  workSafeLevel: WorkSafeLevel,
  themeName: string,
  desc: string,
): ThemeOption {
  return { category, audiences, workSafeLevel, theme: themeName, desc };
}

export const themeOptions: ThemeOption[] = [
  theme("Corporate & Office Life", ["company"], "safe", "Synergy", "A deep dive into what synergy actually means, since no one knows"),
  theme("Corporate & Office Life", ["company"], "safe", "The Org Chart Rebrand", "Explaining why we renamed everyone's job titles"),
  theme("Corporate & Office Life", ["company"], "safe", "Reply All Incidents", "A post-mortem on email disasters"),
  theme("Corporate & Office Life", ["company"], "safe", "Quarterly Business Review Theater", "The performance art of the QBR"),
  theme("Corporate & Office Life", ["company"], "safe", "The Open Office Floor Plan", "Its promises, its betrayals, its standing desks"),
  theme("Corporate & Office Life", ["company", "party"], "safe", "Mandatory Fun", "Company offsites, team lunches, and escape rooms"),
  theme("Corporate & Office Life", ["company"], "edgy", "Performance Improvement Plans", "A sensitive topic presented with PowerPoint confidence"),
  theme("Corporate & Office Life", ["company"], "safe", "The Pivot", "How to explain a complete strategy reversal with a straight face"),
  theme("Corporate & Office Life", ["company"], "safe", "Hot Desking", "The territorial politics of unassigned seating"),
  theme("Corporate & Office Life", ["company"], "safe", "Onboarding Week", "Fourteen hours of orientation for a job you might not keep forever"),

  theme("Food & Beverage", ["party", "general"], "edgy", "Gas Station Sushi", "An unironic defense of convenience store fish"),
  theme("Food & Beverage", ["party", "general"], "safe", "The Everything Bagel", "Topping philosophy, bagel diplomacy, and schmear ethics"),
  theme("Food & Beverage", ["classroom", "party", "general"], "safe", "Instant Ramen Upgrades", "A graduate-level curriculum in noodle enhancement"),
  theme("Food & Beverage", ["party", "general"], "edgy", "The Bottomless Brunch", "Its economics, its casualties, its legacy"),
  theme("Food & Beverage", ["general"], "safe", "Airline Food Renaissance", "A serious look at the glow-up nobody asked for"),
  theme("Food & Beverage", ["company", "classroom", "general"], "safe", "Ketchup Packet Innovation", "A product design retrospective"),
  theme("Food & Beverage", ["general"], "safe", "The Cheese Course", "Why Europeans end meals this way and Americans fear it"),
  theme("Food & Beverage", ["company", "general"], "safe", "Drive-Through Menu Psychology", "Upsell architecture and item placement strategy"),
  theme("Food & Beverage", ["party", "general"], "safe", "Competitive Eating", "The sport, the strategy, the mustard belt"),
  theme("Food & Beverage", ["company", "general"], "safe", "The Sad Desk Lunch", "A meditation on tupperware, crumbs, and dignity"),

  theme("Self-Help & Wellness", ["company", "party", "general"], "safe", "Morning Routines of High Performers", "4am cold plunges and the people who ruin breakfast for everyone"),
  theme("Self-Help & Wellness", ["classroom", "general"], "safe", "The Gut Microbiome", "Explaining your second brain to a skeptical audience"),
  theme("Self-Help & Wellness", ["company", "classroom", "general"], "safe", "Digital Detox", "People who went offline for a week and came back changed"),
  theme("Self-Help & Wellness", ["company", "general"], "safe", "Gratitude Journaling ROI", "Quantifying the unquantifiable"),
  theme("Self-Help & Wellness", ["party", "general"], "safe", "Manifestation Science", "A bold attempt to use the word quantum responsibly"),
  theme("Self-Help & Wellness", ["company", "general"], "safe", "The Dopamine Menu", "Curating your joy like a restaurant"),
  theme("Self-Help & Wellness", ["company", "classroom", "general"], "safe", "Sleep Optimization", "Eight hours of advice about eight hours of unconsciousness"),
  theme("Self-Help & Wellness", ["company", "general"], "safe", "Breathwork", "Doing something you've done since birth, but on purpose"),
  theme("Self-Help & Wellness", ["classroom", "general"], "safe", "Journaling Methods", "Bullet, stream-of-consciousness, and the blank page that judged you"),
  theme("Self-Help & Wellness", ["company", "general"], "safe", "The Power of No", "A presentation you did not want to attend about not attending things"),

  theme("History, Reimagined", ["classroom", "general"], "safe", "The Bronze Age Collapse", "A supply chain post-mortem, 3,000 years late"),
  theme("History, Reimagined", ["classroom", "party", "general"], "safe", "Medieval IT Support", "Troubleshooting illuminated manuscripts and drawbridges"),
  theme("History, Reimagined", ["classroom", "general"], "safe", "The Tulip Mania of 1637", "History's first speculative bubble, presented by a fintech founder"),
  theme("History, Reimagined", ["classroom", "general"], "safe", "The Silk Road", "The world's first cross-border logistics platform"),
  theme("History, Reimagined", ["classroom", "party", "general"], "safe", "Victorian Etiquette", "Rules for fork placement that ended careers"),
  theme("History, Reimagined", ["classroom", "general"], "safe", "Napoleon's Height", "The myth, the propaganda, and the 5 foot 7 truth"),
  theme("History, Reimagined", ["classroom", "general"], "safe", "The Library of Alexandria", "A data loss incident with no backup strategy"),
  theme("History, Reimagined", ["classroom"], "edgy", "Manifest Destiny", "A land acquisition strategy, presented to its own board"),
  theme("History, Reimagined", ["classroom", "general"], "safe", "Ancient Roman Urban Planning", "Aqueducts, grids, and the first HOA dispute"),
  theme("History, Reimagined", ["classroom", "general"], "edgy", "The Black Death Recovery Arc", "Europe's most unexpected labor market transformation"),

  theme("Animals", ["classroom", "party", "general"], "safe", "Pigeon Urbanism", "How pigeons conquered the city and what we can learn"),
  theme("Animals", ["party", "general"], "safe", "Raccoon Behavior", "Dexterous, adaptable, unbothered; the raccoon as role model"),
  theme("Animals", ["classroom", "general"], "safe", "The Salmon Migration", "A harrowing one-way journey, framed as career advice"),
  theme("Animals", ["classroom", "general"], "safe", "Crow Intelligence", "They remember faces, hold grudges, and will outlast us"),
  theme("Animals", ["classroom", "general"], "safe", "Goat Agility", "Mountain climbing physics and the philosophy of footing"),
  theme("Animals", ["classroom", "general"], "safe", "The Migration of the Monarch Butterfly", "Navigation without GPS, memory, or a return ticket"),
  theme("Animals", ["classroom", "party", "general"], "safe", "Deep Sea Creatures", "Life in the pressure-filled dark, as a leadership metaphor"),
  theme("Animals", ["party", "general"], "safe", "The Houseplant as Pet", "Emotional labor, watering schedules, and plant guilt"),
  theme("Animals", ["classroom", "party", "general"], "safe", "Capybara Diplomacy", "Why every animal tolerates the capybara and what we can learn"),
  theme("Animals", ["company", "party"], "safe", "Dog Breeds as Business Units", "Which department is the golden retriever? Sales"),

  theme("Urban Life & Infrastructure", ["company", "classroom", "general"], "safe", "The Crosswalk Button", "Does it do anything? A public trust audit"),
  theme("Urban Life & Infrastructure", ["company", "general"], "safe", "Elevator Small Talk", "The 30-second social contract nobody signed"),
  theme("Urban Life & Infrastructure", ["classroom", "general"], "safe", "The Third Place", "Coffee shops, libraries, and the death of hanging out"),
  theme("Urban Life & Infrastructure", ["classroom", "general"], "safe", "Parking Minimums", "How zoning laws shaped civilization and ruined downtown"),
  theme("Urban Life & Infrastructure", ["general"], "safe", "The Bodega", "New York's most essential institution, explained to everyone else"),
  theme("Urban Life & Infrastructure", ["general"], "safe", "The Freeway Onramp", "Merging as metaphor"),
  theme("Urban Life & Infrastructure", ["classroom", "general"], "safe", "Bike Lane Politics", "A conflict older than the bike lane itself"),
  theme("Urban Life & Infrastructure", ["general"], "safe", "The Laundromat", "A study in waiting, quarters, and liminal space"),
  theme("Urban Life & Infrastructure", ["classroom", "general"], "safe", "Roundabouts", "Why some countries love them and Americans are afraid"),
  theme("Urban Life & Infrastructure", ["party", "general"], "safe", "The 24-Hour Diner", "What happens after midnight and who is there"),

  theme("Tech Culture", ["company", "general"], "safe", "The Pivot to Video", "Media's worst decision, presented as a best practice"),
  theme("Tech Culture", ["company", "general"], "safe", "Move Fast and Break Things", "A retrospective from the things that got broken"),
  theme("Tech Culture", ["company", "general"], "safe", "The Metaverse", "Where it is now, where it was going, what happened"),
  theme("Tech Culture", ["company", "general"], "safe", "Blockchain for Everything", "Solutions in search of problems, 2017-2022"),
  theme("Tech Culture", ["company", "classroom", "general"], "safe", "The Algorithm", "An entity that knows you better than your parents"),
  theme("Tech Culture", ["company"], "safe", "Product-Market Fit", "The phrase used to explain both success and failure"),
  theme("Tech Culture", ["company"], "safe", "The 10x Engineer", "A mythological figure and its impact on hiring"),
  theme("Tech Culture", ["company", "classroom"], "safe", "Dark Patterns", "UX designed against you, explained with admiration"),
  theme("Tech Culture", ["company"], "edgy", "The Tech Layoff Email", "Linguistic analysis of corporate regret"),
  theme("Tech Culture", ["classroom", "general"], "safe", "Your Terms of Service", "What you agreed to and what you definitely did not read"),

  theme("Leisure & Pop Culture", ["general"], "safe", "The Waiting Room", "Old magazines, fluorescent lights, and the passage of time"),
  theme("Leisure & Pop Culture", ["classroom", "party", "general"], "safe", "Speed Running", "Finishing games as fast as possible, as a life philosophy"),
  theme("Leisure & Pop Culture", ["party", "general"], "safe", "The Yelp Review", "One star. The soup was too hot. The owner is too passionate."),
  theme("Leisure & Pop Culture", ["party", "general"], "safe", "Fantasy Football", "Statistics, betrayal, and strained friendships"),
  theme("Leisure & Pop Culture", ["company", "general"], "safe", "The Streaming Wars", "How we ended up paying for more than cable again"),
  theme("Leisure & Pop Culture", ["party", "general"], "safe", "True Crime Podcast Nation", "50 million listeners, 50 million amateur detectives"),
  theme("Leisure & Pop Culture", ["company", "party"], "safe", "Escape Rooms", "Paying to be locked in a room and solve a puzzle you did not design"),
  theme("Leisure & Pop Culture", ["general"], "safe", "The Houseplants of HGTV", "Unrealistic staging and the plants that did not survive closing"),
  theme("Leisure & Pop Culture", ["general"], "safe", "The Gym in January", "A seasonal phenomenon with a predictable arc"),
  theme("Leisure & Pop Culture", ["general"], "safe", "Thrift Store Economics", "Supply, demand, and the blazer that used to be someone's wedding suit"),

  theme("Big & Abstract", ["classroom", "general"], "safe", "Time Zones", "Humanity's most passive-aggressive invention"),
  theme("Big & Abstract", ["general"], "safe", "The Color Beige", "A defense, a history, a manifesto"),
  theme("Big & Abstract", ["classroom", "general"], "safe", "The Number Zero", "Invented late, caused immediate problems, essential ever since"),
  theme("Big & Abstract", ["party", "general"], "safe", "The Concept of Tuesday", "Not Monday, not hump day; Tuesday and its identity crisis"),
  theme("Big & Abstract", ["classroom", "general"], "safe", "The Smell of Rain", "Petrichor, nostalgia, and the science of missing something"),
  theme("Big & Abstract", ["classroom", "general"], "safe", "Alphabetical Order", "Who decided this and why we all agreed"),
  theme("Big & Abstract", ["classroom", "general"], "safe", "Silence", "How much it costs, who controls it, and what we do with it"),
  theme("Big & Abstract", ["classroom", "general"], "safe", "The Color of the Sky", "Why blue, what blue means, and who owns the sky"),
  theme("Big & Abstract", ["general"], "safe", "The Middle Seat", "Armrest rights, human dignity, and air travel's social contract"),
  theme("Big & Abstract", ["company", "general"], "safe", "The Concept of Being On Time", "Cultural relativity, lateness anxiety, and the 5-minute buffer"),

  theme("Event-Specific", ["company"], "safe", "The Company Handbook", "Policies nobody reads and the one that saved someone's job"),
  theme("Event-Specific", ["company"], "safe", "All Hands Meetings", "The format, the questions nobody asked, the slide that went wrong"),
  theme("Event-Specific", ["classroom"], "safe", "The Pop Quiz", "Surprise assessments and the pedagogy of panic"),
  theme("Event-Specific", ["classroom"], "safe", "Group Projects", "Who did the work, who presented, who got the credit"),
  theme("Event-Specific", ["creative", "company"], "safe", "The Rebrand", "New logo, same problems, press release full of hope"),
  theme("Event-Specific", ["creative", "classroom", "party"], "safe", "Comic Sans", "A font with more enemies than deserved, a history worth knowing"),
  theme("Event-Specific", ["party"], "safe", "Cereal Mascots", "Their psychology, their crimes, their demographic targets"),
  theme("Event-Specific", ["party"], "safe", "The Infomercial", "Problems you did not know you had, solved at 2am"),
  theme("Event-Specific", ["party", "classroom"], "safe", "The Hot Dog as Sandwich Debate", "Philosophy, taxonomy, and why anyone cares"),
  theme("Event-Specific", ["party", "general"], "safe", "The Birthday Candle", "Ritual, fire safety, and a wish that goes nowhere"),
];

export const themeCategories = Array.from(
  new Set(themeOptions.map((option) => option.category)),
);

export const audienceLabels: Record<AudienceHint, string> = {
  company: "Company",
  classroom: "Classroom",
  creative: "Creative",
  party: "Party",
  general: "General",
};
