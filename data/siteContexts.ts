

export const siteContextCategories = {
    "🧭 General / Neutral": [
        "Enhance Only (No Context)","Upscale Plaza","Urban Plaza / Square","Urban Intersection / Street Network","Urban Concept Plaza",
    ],
    "🌆 Urban Environments": [
        "Modern Metropolis (Day)","Modern Metropolis (Night)","Financial District","Urban Street / Downtown","Mixed-use Urban Development",
        "Urban Green Park","Pedestrian Street / Promenade","Community Center / Civic Plaza","Riverside / Waterfront Urban",
        "Transport Hub – Bus / Train Station","Bus Terminal / Transit Hub","City Intersection with Roundabout",
        "Urban Rooftop Garden","Urban Rooftop Lounge","Highway Interchange Night","Public Parking Lot",
    ],
    "🏡 Residential Contexts": [
        "Residential Area – Suburban","Residential Area – Urban","Riverside Residential","Residential Courtyard",
        "Suburban Neighborhood","Exclusive Residential","Suburban Shopping Street","Luxury Beachfront Villa",
        "Modern Hillside Villa","Minimalist Concrete House","Tropical Modern House","Classic Villa Garden",
        "Mediterranean Courtyard","Classic Colonial Courtyard","Urban Hill Residence","High-End Apartment Terrace",
        "Tropical Forest Retreat","Countryside Modern Barn","Desert Cliff Residence","Reflective Salt Flat",
    ],
    "🌿 Nature / Landscape": [
        "Mountain Valley","Lush Forest","Temperate River","Tropical Island Beach","Desert Landscape",
        "Waterfront Park / Pier","Riverside Park / Recreation Area","Golf Course Sunrise","Luxury Resort",
        "Mountain Lodge / Resort Area","Glaciated Mountain Pass","Coastal Town",
    ],
    "🏛️ Cultural / Historic": [
        "Historic European Street","Historic Cathedral Square","Cultural Heritage District","Art District",
        "Japanese Zen Garden","Classic European Mansion","Contemporary Cultural Center",
    ],
    "🏫 Institutional / Public": [
        "University Campus","University Campus Quad","School Campus","Hospital / Medical Campus",
        "Hospital Rooftop / Helipad Area","Hospital Entrance / Ambulance Area","Office / Company Campus",
        "Community Park with Playground","Botanical Garden","Botanical Conservatory / Greenhouse",
        "Corporate Office Plaza","University Library Area",
    ],
    "🛍️ Commercial / Market / Retail": [
        "Urban Market / Street Market","Street Food Market","Supermarket / Retail Complex",
        "Industrial / Warehouse Area","Industrial Park / Logistics Area","Data Center Park","Harbor / Marina",
    ],
    "🚀 Conceptual / Futuristic": [
        "Brutalist City Block","Futuristic Smart City","Abandoned Industrial",
        "Modern Minimalist Courtyard"
    ]
} as const;


// Flatten the categories to create the options list for type definitions and other lookups
export const siteContextOpts = Object.values(siteContextCategories).flat();

export const siteContextDescriptions: { [key in typeof siteContextOpts[number]]: string } = {
    // 🧭 General / Neutral
    "Enhance Only (No Context)": "Used when no environment context is required. Focuses only on the building form.",
    "Upscale Plaza": "A refined public plaza with premium materials, clean geometry, and subtle greenery.",
    "Urban Plaza / Square": "An open urban space surrounded by buildings, pavement patterns, and seating.",
    "Urban Intersection / Street Network": "A crossing of city streets showing circulation, pedestrian and vehicle flow.",
    "Urban Concept Plaza": "A simplified conceptual urban space used for schematic or early-stage renders.",

    // 🌆 Urban Environments
    "Modern Metropolis (Day)": "A dense skyline of modern glass buildings with bright daylight and city activity.",
    "Modern Metropolis (Night)": "City at night with glowing building lights, traffic streaks, and reflections.",
    "Financial District": "Tall office towers, glass façades, and organized streets in a commercial hub.",
    "Urban Street / Downtown": "Active streetscape with shops, people, and surrounding mid-rise buildings.",
    "Mixed-use Urban Development": "Blends retail, residential, and office buildings in one district.",
    "Urban Green Park": "Open green park within an urban context with walkways, trees, and seating.",
    "Pedestrian Street / Promenade": "Car-free walkway lined with cafes and boutiques.",
    "Community Center / Civic Plaza": "Public space surrounded by community or government buildings.",
    "Riverside / Waterfront Urban": "Modern buildings along an active riverfront or embankment.",
    "Transport Hub – Bus / Train Station": "Area near a transport interchange showing movement and structure.",
    "Bus Terminal / Transit Hub": "Wide paved area with buses and waiting zones.",
    "City Intersection with Roundabout": "Dynamic city view centered around a circular traffic junction.",
    "Urban Rooftop Garden": "Rooftop with greenery, outdoor seating, and city skyline background.",
    "Urban Rooftop Lounge": "Evening rooftop lounge with lights and open-air furniture.",
    "Highway Interchange Night": "Dynamic night scene with layered elevated roads and headlights.",
    "Public Parking Lot": "Flat open paved area with cars and surrounding urban massing.",

    // 🏡 Residential Contexts
    "Residential Area – Suburban": "Calm neighborhood with detached houses and greenery.",
    "Residential Area – Urban": "Dense housing or apartment buildings within city context.",
    "Riverside Residential": "Housing or villa facing a river or canal edge.",
    "Residential Courtyard": "Housing cluster organized around a shared inner courtyard.",
    "Suburban Neighborhood": "Quiet low-density neighborhood with greenery and sidewalks.",
    "Exclusive Residential": "Luxury gated area or villa compound with clean landscaping.",
    "Suburban Shopping Street": "Local retail zone integrated within residential blocks.",
    "Luxury Beachfront Villa": "High-end coastal villa facing the sea, emphasizing relaxation.",
    "Modern Hillside Villa": "Contemporary home on a sloped terrain with panoramic view.",
    "Minimalist Concrete House": "Simple geometry, raw materials, and clean spatial proportion.",
    "Tropical Modern House": "Warm material palette, open ventilation, and lush planting.",
    "Classic Villa Garden": "Formal villa garden with symmetry, paths, and classical details.",
    "Mediterranean Courtyard": "Warm tones, arcades, and internal shaded patio.",
    "Classic Colonial Courtyard": "Historic layout with covered walkways and tropical planting.",
    "Urban Hill Residence": "Modern residence set on urban hillside or elevated terrain.",
    "High-End Apartment Terrace": "Private balcony with furniture and skyline background.",
    "Tropical Forest Retreat": "House surrounded by lush jungle vegetation.",
    "Countryside Modern Barn": "Contemporary take on a barn form within rural setting.",
    "Desert Cliff Residence": "Minimal house with warm stone textures integrated into cliff.",
    "Reflective Salt Flat": "Abstract desert setting with reflective flat ground surface.",

    // 🌿 Nature / Landscape
    "Mountain Valley": "Natural valley landscape with surrounding mountain ridges.",
    "Lush Forest": "Dense tropical or temperate forest setting with soft lighting.",
    "Temperate River": "Calm river with green banks and distant hills.",
    "Tropical Island Beach": "Palm trees, white sand, turquoise water under sunlight.",
    "Desert Landscape": "Arid scenery with dunes, rocks, and minimal vegetation.",
    "Waterfront Park / Pier": "Open pier or linear park beside body of water.",
    "Riverside Park / Recreation Area": "Public park along river used for leisure activities.",
    "Golf Course Sunrise": "Soft early morning light across landscaped golf terrain.",
    "Luxury Resort": "Tropical resort zone with pools, palm trees, and clear sky.",
    "Mountain Lodge / Resort Area": "Cozy elevated retreat surrounded by pine trees.",
    "Glaciated Mountain Pass": "Snowy landscape with cliffs and icy terrain.",
    "Coastal Town": "Compact seaside settlement with white façades and sloped roofs.",

    // 🏛️ Cultural / Historic
    "Historic European Street": "Old town street lined with stone buildings and textured pavement.",
    "Historic Cathedral Square": "Plaza centered on cathedral or monument architecture.",
    "Cultural Heritage District": "Preserved area with historic or traditional structures.",
    "Art District": "Creative quarter with galleries, murals, and studio buildings.",
    "Japanese Zen Garden": "Minimal composition with raked gravel, rocks, and selective planting.",
    "Classic European Mansion": "Elegant formal mansion with stone façades and garden.",
    "Contemporary Cultural Center": "Modern public building for exhibitions or performances.",

    // 🏫 Institutional / Public
    "University Campus": "Green academic setting with paths, benches, and students.",
    "University Campus Quad": "Central open courtyard surrounded by academic buildings.",
    "School Campus": "Educational setting with open yard and functional blocks.",
    "Hospital / Medical Campus": "Modern hospital complex with open access and circulation.",
    "Hospital Rooftop / Helipad Area": "Functional roofscape of hospital with helipad.",
    "Hospital Entrance / Ambulance Area": "Emergency drop-off and covered access zone.",
    "Office / Company Campus": "Corporate area with organized building clusters.",
    "Community Park with Playground": "Public park with trees, benches, and play structures.",
    "Botanical Garden": "Naturalistic plant garden with paths and greenhouses.",
    "Botanical Conservatory / Greenhouse": "Glasshouse structure filled with tropical flora.",
    "Corporate Office Plaza": "Formal hardscape with seating and minimal greenery.",
    "University Library Area": "Academic setting around large library structure.",

    // 🛍️ Commercial / Market / Retail
    "Urban Market / Street Market": "Active street with small vendors and colorful atmosphere.",
    "Street Food Market": "Lively area with food stalls and warm evening lighting.",
    "Supermarket / Retail Complex": "Contemporary commercial block with parking and signage.",
    "Industrial / Warehouse Area": "Large-scale metal buildings and open yards.",
    "Industrial Park / Logistics Area": "Functional industrial layout with access roads.",
    "Data Center Park": "High-tech secure facility with structured landscape.",
    "Harbor / Marina": "Waterfront area with boats, docks, and maritime details.",

    // 🚀 Conceptual / Futuristic
    "Brutalist City Block": "Raw concrete architecture in dense geometric urban form.",
    "Futuristic Smart City": "Tech-driven skyline with advanced lighting and clean streets.",
    "Abandoned Industrial": "Weathered structures with urban decay aesthetic.",
    "Modern Minimalist Courtyard": "Simple open space with shadow-play and modern texture."
};
