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

  theme("Corporate & Office Life", ["company", "general"], "safe", "Calendar Invite Archaeology", "Excavating why this meeting exists and who summoned it"),
  theme("Corporate & Office Life", ["company", "party"], "safe", "The Snack Drawer Economy", "Supply shocks, hoarding behavior, and the last granola bar"),
  theme("Corporate & Office Life", ["company"], "safe", "Status Color Diplomacy", "When green means yellow and yellow means nobody knows"),
  theme("Corporate & Office Life", ["company", "general"], "safe", "The Meeting That Could Be Three Messages", "A time savings proposal nobody had time to review"),
  theme("Corporate & Office Life", ["company"], "safe", "Spreadsheet Tab Naming", "The hidden language of final, final2, and really final"),
  theme("Corporate & Office Life", ["company"], "safe", "Office Chair Migration Patterns", "Where the good chairs go and why they never return"),
  theme("Corporate & Office Life", ["company", "party"], "safe", "The Icebreaker Question Industrial Complex", "Fun facts, forced whimsy, and safe answers"),
  theme("Corporate & Office Life", ["company"], "safe", "The Mystery Conference Room Smell", "A facilities investigation with too many stakeholders"),
  theme("Corporate & Office Life", ["company"], "safe", "Printer Queue Leadership", "Who panics, who reloads paper, who disappears"),
  theme("Corporate & Office Life", ["company", "general"], "safe", "Desk Cable Management", "A visible measure of inner peace and denial"),
  theme("Corporate & Office Life", ["company"], "safe", "The Lunch And Learn Sandwich Forecast", "Predicting attendance with deli math"),
  theme("Corporate & Office Life", ["company", "general"], "safe", "Vacation Auto Reply Strategy", "Boundary setting, emoji restraint, and the backup contact"),

  theme("Food & Beverage", ["company", "party", "general"], "safe", "The Break Room Microwave Treaty", "Heating leftovers without starting a diplomatic incident"),
  theme("Food & Beverage", ["party", "general"], "safe", "Chip Bag Air Ratios", "A consumer confidence crisis in crunchy packaging"),
  theme("Food & Beverage", ["company", "general"], "safe", "Free Donut Allocation", "How glaze changes office behavior in under four minutes"),
  theme("Food & Beverage", ["party", "general"], "safe", "Pizza Slice Geometry", "Fairness, triangles, and the person who takes two pieces"),
  theme("Food & Beverage", ["party", "general"], "safe", "The Guacamole Upcharge", "A pricing model that tests every friendship"),
  theme("Food & Beverage", ["company", "general"], "safe", "Coffee Machine Rituals", "Bean selection, line etiquette, and tiny paper cups"),
  theme("Food & Beverage", ["party", "general"], "safe", "Soup As A Beverage", "A bold classification framework with warm evidence"),
  theme("Food & Beverage", ["company", "party", "general"], "safe", "Snack Table Traffic Flow", "Bottlenecks, crumbs, and the dip nobody labels"),
  theme("Food & Beverage", ["party", "general"], "safe", "Leftover Cake Governance", "Who cuts, who claims corners, who emails the room"),
  theme("Food & Beverage", ["general"], "safe", "Grocery Store Checkout Strategy", "Lane choice, cart anxiety, and coupon timing"),
  theme("Food & Beverage", ["party", "general"], "safe", "The Office Fridge Museum", "Ancient containers and the ethics of disposal"),
  theme("Food & Beverage", ["company", "general"], "safe", "Bagel Cut Quality Assurance", "Why one uneven slice can derail a morning"),

  theme("Self-Help & Wellness", ["company", "general"], "safe", "Inbox Zero Mythology", "A wellness practice for people with no incoming email"),
  theme("Self-Help & Wellness", ["company", "general"], "safe", "Hydration Bottle Personalities", "The emotional branding of carrying water"),
  theme("Self-Help & Wellness", ["company", "general"], "safe", "Walking Meeting Logistics", "Trying to brainstorm while crossing a parking lot"),
  theme("Self-Help & Wellness", ["general"], "safe", "The Snooze Button Negotiation", "Nine more minutes and the collapse of ambition"),
  theme("Self-Help & Wellness", ["company", "general"], "safe", "Standing Desk Identity", "Wellness, cable length, and visible commitment"),
  theme("Self-Help & Wellness", ["party", "general"], "safe", "Mindfulness During Buffering", "Finding calm while the spinning wheel evaluates you"),
  theme("Self-Help & Wellness", ["general"], "safe", "The Errand Optimization Loop", "How one quick stop becomes a three-hour route"),
  theme("Self-Help & Wellness", ["company", "general"], "safe", "Deep Breaths Before Unmuting", "A practical guide to entering the conversation"),

  theme("Urban Life & Infrastructure", ["company", "general"], "safe", "Parking Spot Psychology", "Hope, betrayal, and the far corner of the lot"),
  theme("Urban Life & Infrastructure", ["general"], "safe", "Airport Gate Changes", "A mobility drill disguised as travel information"),
  theme("Urban Life & Infrastructure", ["general"], "safe", "The Boarding Group Economy", "Scarcity, tote bags, and overhead bin strategy"),
  theme("Urban Life & Infrastructure", ["general"], "safe", "Hotel Breakfast Logistics", "Waffle timing and the tiny tongs problem"),
  theme("Urban Life & Infrastructure", ["company", "general"], "safe", "Rental Car Button Discovery", "Learning a new dashboard under pressure"),
  theme("Urban Life & Infrastructure", ["general"], "safe", "Grocery Cart Wheel Alignment", "A mechanical failure with emotional consequences"),
  theme("Urban Life & Infrastructure", ["general"], "safe", "The Self Checkout Voice", "Unexpected item, expected panic"),
  theme("Urban Life & Infrastructure", ["general"], "safe", "Package Tracking Refresh Habits", "The same warehouse, checked twelve times"),
  theme("Urban Life & Infrastructure", ["company", "general"], "safe", "Commute Playlist Governance", "Mood regulation through highly specific audio choices"),
  theme("Urban Life & Infrastructure", ["general"], "safe", "Umbrella Sharing Protocol", "A sidewalk negotiation under weather pressure"),
  theme("Urban Life & Infrastructure", ["general"], "safe", "Elevator Button Confidence", "Pressing it twice to prove commitment"),
  theme("Urban Life & Infrastructure", ["company", "general"], "safe", "Badge Reader Superstition", "The little beep that controls workplace dignity"),

  theme("Tech Culture", ["company", "general"], "safe", "Password Reset Fatigue", "Security theater and the memory of your first pet"),
  theme("Tech Culture", ["company", "general"], "safe", "Group Chat Thread Drift", "How logistics becomes lunch, then memes, then silence"),
  theme("Tech Culture", ["company", "party", "general"], "safe", "Emoji Reaction Strategy", "A lightweight governance model for thumbs-up timing"),
  theme("Tech Culture", ["company", "general"], "safe", "The Muted Microphone Reveal", "A character study in delayed awareness"),
  theme("Tech Culture", ["company", "general"], "safe", "Video Call Background Curation", "Bookshelves, plants, and controlled personality leakage"),
  theme("Tech Culture", ["company", "general"], "safe", "The Software Update Ambush", "Restart now, later, or at the worst possible moment"),
  theme("Tech Culture", ["company", "general"], "safe", "Notification Badge Inflation", "Why the red number keeps winning"),
  theme("Tech Culture", ["company", "general"], "safe", "The Shared Doc Cursor Ballet", "Five people editing one sentence in real time"),
  theme("Tech Culture", ["company", "general"], "safe", "Wi-Fi Name Creativity", "Neighbor branding in the router age"),
  theme("Tech Culture", ["company", "general"], "safe", "Screenshot Folder Archaeology", "A visual history of things you meant to remember"),

  theme("Leisure & Pop Culture", ["party", "general"], "safe", "The Group Photo Countdown", "Why someone always blinks on two"),
  theme("Leisure & Pop Culture", ["party", "general"], "safe", "Board Game Rule Negotiations", "Reading the booklet aloud while everyone loses hope"),
  theme("Leisure & Pop Culture", ["party", "general"], "safe", "Streaming Service Password Diplomacy", "Family plans, trust, and suspicious logins"),
  theme("Leisure & Pop Culture", ["party", "general"], "safe", "The Remote Control Search Pattern", "Couch cushions, denial, and sudden discovery"),
  theme("Leisure & Pop Culture", ["party", "general"], "safe", "Movie Snack Timing", "Finishing the popcorn before the previews end"),
  theme("Leisure & Pop Culture", ["party", "general"], "safe", "The Perfect Playlist Handoff", "One phone, twelve opinions, no agreed vibe"),
  theme("Leisure & Pop Culture", ["general"], "safe", "Weekend Plan Inflation", "From quick brunch to a multi-location operation"),
  theme("Leisure & Pop Culture", ["party", "general"], "safe", "Karaoke Song Selection Risk", "Choosing between bravery, range, and reputation"),
  theme("Leisure & Pop Culture", ["general"], "safe", "The Seasonal Candle Calendar", "Scent strategy across weather, mood, and sales"),
  theme("Leisure & Pop Culture", ["party", "general"], "safe", "Gift Bag Economics", "Tiny tissue paper, big logistical questions"),
  theme("Leisure & Pop Culture", ["party", "general"], "safe", "The Last Slice Stand-Off", "Everyone says no while watching it closely"),
  theme("Leisure & Pop Culture", ["general"], "safe", "Subscription Cancellation Mazes", "A journey through menus, feelings, and retention offers"),
  theme("Leisure & Pop Culture", ["party", "general"], "safe", "Party Arrival Windows", "Early, on time, fashionably late, or text from driveway"),
  theme("Leisure & Pop Culture", ["general"], "safe", "Laundry Chair Capacity Planning", "Clothes that are clean enough to form a department"),
  theme("Leisure & Pop Culture", ["general"], "safe", "The Hobby Starter Kit Spiral", "Buying supplies before developing the personality"),

  theme("Big & Abstract", ["company", "general"], "safe", "The Concept Of Just Checking In", "A phrase that can mean anything from hello to escalation"),
  theme("Big & Abstract", ["general"], "safe", "Five Minutes Away", "A flexible unit of time shaped by traffic and optimism"),
  theme("Big & Abstract", ["company", "general"], "safe", "The Energy Of A Fresh Notebook", "Unlimited possibility before page two gets weird"),
  theme("Big & Abstract", ["general"], "safe", "The Drawer Of Important Cords", "No labels, all confidence, one ancient charger"),
  theme("Big & Abstract", ["party", "general"], "safe", "The Social Battery Indicator", "A dashboard nobody can see but everyone feels"),
  theme("Big & Abstract", ["company", "general"], "safe", "The Phrase Circle Back", "A boomerang of responsibility in professional language"),
  theme("Big & Abstract", ["general"], "safe", "The Weather App Betrayal", "A forecast, a wardrobe, and a sudden storm"),
  theme("Big & Abstract", ["general"], "safe", "The Universal Junk Drawer", "Scissors, batteries, and the archaeology of maybe"),
  theme("Big & Abstract", ["company", "general"], "safe", "The Confidence Of A Fresh Slide Deck", "Everything seems possible before speaker notes happen"),
  theme("Big & Abstract", ["general"], "safe", "The Art Of Leaving Exactly On Time", "A personal brand built at 4:59"),

  theme("Event-Specific", ["company"], "safe", "Lehi Training Room Energy", "Projector glow, table snacks, and tactical optimism"),
  theme("Event-Specific", ["company", "party"], "safe", "The Name Tag Placement Debate", "Shirt side, jacket side, or pocket mystery"),
  theme("Event-Specific", ["company", "general"], "safe", "Workshop Sticky Note Saturation", "When every wall becomes a product roadmap"),
  theme("Event-Specific", ["company"], "safe", "Breakout Group Roulette", "Choosing spokespeople with alarming speed"),
  theme("Event-Specific", ["company", "general"], "safe", "The Post Lunch Attention Curve", "A scientific look at nodding with purpose"),
  theme("Event-Specific", ["company", "party"], "safe", "Raffle Prize Strategy", "Hope, ticket folding, and public disappointment"),
  theme("Event-Specific", ["company"], "safe", "Training Room Outlet Scarcity", "Battery anxiety as a team-building exercise"),
  theme("Event-Specific", ["company", "general"], "safe", "The Agenda Slide Nobody Believes", "A beautiful timeline meeting reality in real time"),
  theme("Event-Specific", ["party", "general"], "safe", "Potluck Labeling Standards", "Ingredients, initials, and the mystery casserole"),
  theme("Event-Specific", ["company", "party"], "safe", "Photo Booth Prop Governance", "Who gets the glasses and who owns the tiny sign"),
  theme("Event-Specific", ["company", "general"], "safe", "The Closing Survey Response Rate", "Measuring satisfaction after everyone has mentally left"),
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
