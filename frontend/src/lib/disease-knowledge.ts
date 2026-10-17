export type DiseaseGuidance = {
  crop: string;
  disease: string;
  severity: "Critical" | "High" | "Moderate" | "Healthy";
  whatIsIt: string;
  rootCauses: { title: string; detail: string; icon: string }[];
  prevention: { title: string; detail: string }[];
  remedies: {
    firstAid: string[];
    organic: { remedy: string; preparation: string; frequency: string }[];
    chemical: { name: string; dosage: string; note: string }[];
  };
  quickQuestions: string[];
};

export const CROP_DISEASE_KNOWLEDGE: Record<string, Partial<DiseaseGuidance>> = {
  "tomato early blight": {
    whatIsIt: "Early Blight is a common fungal infection caused by Alternaria fungus. It shows up as dark brown or black circular spots with concentric rings (like a target bullseye) on older, lower leaves first. If left unchecked, the leaves turn yellow and drop off, which exposes your fruit to sun-scald and reduces your tomato harvest by up to 50%.",
    severity: "High",
    rootCauses: [
      { title: "Warm & Humid Conditions", detail: "Fungus thrives when temperatures are between 24°C–29°C (75°F–85°F) with frequent rain or morning dew.", icon: "🌡️" },
      { title: "Rain & Water Splashing", detail: "Fungal spores survive in the soil and splash onto the lower leaves during heavy rain or overhead hose watering.", icon: "🌧️" },
      { title: "Crowded Foliage & Poor Airflow", detail: "Densely planted tomatoes hold moisture in their canopy for hours, allowing spores to germinate.", icon: "🍃" },
      { title: "Infected Crop Debris", detail: "Spores easily overwinter in unharvested old tomato or potato vines left in the field.", icon: "🍂" },
    ],
    prevention: [
      { title: "Water at the Soil Line", detail: "Always use drip irrigation or water gently at the base. Never soak tomato leaves from above." },
      { title: "Mulch Heavily Around Base", detail: "Apply a 2–3 inch layer of clean straw, dry leaves, or plastic mulch to create a physical barrier preventing soil from splashing onto leaves." },
      { title: "Prune Lower Foliage", detail: "Pinch off all leaves within the bottom 12–18 inches of the ground once the plant is established." },
      { title: "3-Year Crop Rotation", detail: "Never plant tomatoes, potatoes, eggplants, or peppers in the same patch more than once every 3 years." },
    ],
    remedies: {
      firstAid: [
        "Immediately prune off all spotted or yellowing lower leaves with sharp shears.",
        "Put infected clippings directly into a trash bag and dispose of them away from the farm—NEVER throw them on the compost pile.",
        "Wash your pruning shears with rubbing alcohol or a 10% bleach solution between each plant.",
      ],
      organic: [
        { remedy: "Neem Oil Spray", preparation: "Mix 5 ml pure cold-pressed neem oil + 2 ml liquid dish soap per 1 liter of warm water.", frequency: "Spray thoroughly under and over leaves every 7 days in the early morning." },
        { remedy: "Baking Soda Protective Spray", preparation: "Mix 1 tablespoon baking soda + 1 teaspoon vegetable oil + 1 liter water.", frequency: "Apply every 5–7 days to change leaf pH and halt fungal spore germination." },
        { remedy: "Trichoderma Bio-Fungicide", preparation: "Apply Trichoderma viride or harzianum (5g/liter) to the root zone and foliage.", frequency: "Apply at planting and repeat every 14 days as a biological safeguard." },
      ],
      chemical: [
        { name: "Copper Oxychloride 50% WP", dosage: "2.5 g to 3 g per liter of water", note: "Apply as a preventative coat before rain or at the very first sight of spots. 7-day harvest waiting period." },
        { name: "Mancozeb 75% WP", dosage: "2 g per liter of water", note: "Broad-spectrum contact fungicide. Spray thoroughly to cover both leaf surfaces. Rotate with copper to avoid resistance." },
        { name: "Chlorothalonil", dosage: "2 ml per liter of water", note: "Powerful contact protectant. Do not apply during peak flowering to protect pollinating bees." },
      ],
    },
    quickQuestions: [
      "Can I still eat the tomatoes on this plant?",
      "How often should I spray neem oil for Early Blight?",
      "Will this spread to my nearby chili or potato plants?",
      "How much lower foliage should I prune off?",
    ],
  },
  "tomato late blight": {
    whatIsIt: "Late Blight is an aggressive, fast-moving water mold (Phytophthora infestans). It causes large, water-soaked, greenish-black greasy blotches on leaves and stems, with white fuzzy mold under the leaves in humid weather. It can destroy an entire tomato field within 7 to 10 days if not acted upon immediately.",
    severity: "Critical",
    rootCauses: [
      { title: "Cool, Wet & Foggy Weather", detail: "Spreads explosively when temperatures are 15°C–22°C (60°F–72°F) accompanied by high humidity or continuous rainfall.", icon: "❄️" },
      { title: "Wind-Borne Spores", detail: "Microscopic spores can travel miles on moist wind currents from nearby affected potato or tomato fields.", icon: "💨" },
      { title: "Waterlogged Soil", detail: "Poor drainage allows the water mold to multiply rapidly in the root zone.", icon: "💧" },
    ],
    prevention: [
      { title: "Plant Certified Resistant Varieties", detail: "Choose varieties bred with resistance genes (e.g. Mountain Magic, Defiant, Legend)." },
      { title: "Maximize Spacing & Sunlight", detail: "Keep plants at least 2.5 to 3 feet apart in full sun to ensure leaves dry before midday." },
      { title: "Scout Morning Leaves Daily", detail: "Inspect the undersides of leaves early every morning during cool, damp weather." },
    ],
    remedies: {
      firstAid: [
        "CRITICAL: If more than 40% of the plant is black/collapsed, uproot the entire plant and bag it immediately to save neighboring crops.",
        "Do not harvest or handle wet plants, as your hands and clothing will spread the spores across the field.",
      ],
      organic: [
        { remedy: "Copper Soap / Liquid Copper Octanoate", preparation: "Dilute according to label (approx. 10–15 ml per liter of water).", frequency: "Spray immediately and repeat every 5 days during overcast, rainy spells." },
        { remedy: "Bio-Control (Bacillus subtilis)", preparation: "Mix commercial Bacillus subtilis wettable powder (2g/L).", frequency: "Spray preventative coat weekly to crowd out the mold pathogen." },
      ],
      chemical: [
        { name: "Metalaxyl + Mancozeb (e.g. Ridomil Gold)", dosage: "2.5 g per liter of water", note: "Systemic action that halts active infections from inside the plant tissue. Observe 14-day pre-harvest interval." },
        { name: "Cymoxanil + Mancozeb", dosage: "2 g per liter of water", note: "Offers rapid curative kickback within 48 hours of infection." },
      ],
    },
    quickQuestions: [
      "Can I save a tomato plant with Late Blight?",
      "Are green tomatoes from an infected plant safe to ripen?",
      "How far can Late Blight spores travel in the wind?",
      "What fungicide stops Late Blight fastest?",
    ],
  },
  "potato late blight": {
    whatIsIt: "Late Blight is the famous disease behind the historic Irish potato famine. It causes dark, water-soaked rot on potato leaves and stems, and travels down into the tubers, turning potato flesh into a foul-smelling reddish-brown corky rot. It spreads very rapidly across potato rows.",
    severity: "Critical",
    rootCauses: [
      { title: "Prolonged Leaf Wetness", detail: "Requires just 8–10 hours of free moisture on leaves at 12°C–20°C to initiate a massive outbreak.", icon: "🌧️" },
      { title: "Infected Seed Tubers", detail: "Planting infected seed potatoes is the #1 way this disease enters a new field.", icon: "🥔" },
    ],
    prevention: [
      { title: "Certified Disease-Free Seed", detail: "Only purchase certified seed tubers from trusted agricultural agencies." },
      { title: "High Soil Hilling", detail: "Hill soil deeply over growing tubers to create a protective soil filter against spores washing down." },
      { title: "Kill Vines 2 Weeks Before Harvest", detail: "Mow or burn down foliage 14 days before digging to prevent spores from touching tubers during harvest." },
    ],
    remedies: {
      firstAid: [
        "Cut and bag heavily infected vines immediately.",
        "Stop all overhead sprinklers; switch to furrow or drip irrigation.",
      ],
      organic: [
        { remedy: "Bordeaux Mixture (Copper Sulphate + Lime)", preparation: "1% solution (10g copper sulphate + 10g slaked lime per 1 liter water).", frequency: "Spray before rain forecasting cool humid days." },
      ],
      chemical: [
        { name: "Dimethomorph + Mancozeb", dosage: "2 g per liter of water", note: "Provides excellent anti-sporulant action. 10-day pre-harvest interval." },
        { name: "Metalaxyl-M 4% + Mancozeb 64%", dosage: "2.5 g per liter of water", note: "Systemic protection for new shoot growth." },
      ],
    },
    quickQuestions: [
      "Will the potatoes underground rot if leaves have blight?",
      "Should I dig up my potatoes early if blight hits?",
      "How can I tell if seed potatoes carry late blight?",
    ],
  },
  "corn common rust": {
    whatIsIt: "Common Rust is caused by the fungus Puccinia sorghi. It creates golden-brown to cinnamon-brown powdery pustules on both upper and lower surfaces of corn leaves. Severe infections rupture the leaf surface, causing moisture loss and reducing ear fill.",
    severity: "Moderate",
    rootCauses: [
      { title: "Moderate Temperatures & Dew", detail: "Develops rapidly at 16°C–25°C with heavy night dew or frequent showers.", icon: "🌽" },
      { title: "Southern Wind Storms", detail: "Fungal spores do not survive freezing winters; they blow northward every season on storm fronts.", icon: "🌪️" },
    ],
    prevention: [
      { title: "Plant Rust-Resistant Hybrids", detail: "Select maize hybrids bearing the 'Rp' resistance gene." },
      { title: "Early Planting", detail: "Plant early in the season so corn matures before peak spore migration in midsummer." },
    ],
    remedies: {
      firstAid: [
        "Check how many leaves below the ear have pustules. If it appears late near maturity, treatment is often unnecessary.",
      ],
      organic: [
        { remedy: "Sulfur Dusting / Wettable Sulfur", preparation: "3 g wettable sulfur per liter of water.", frequency: "Apply at the earliest sign of rust pustules. Do not apply when temperatures exceed 32°C (90°F)." },
      ],
      chemical: [
        { name: "Azoxystrobin + Difenoconazole", dosage: "1 ml per liter of water", note: "Apply before tasseling if rust pustules are active on upper leaves." },
        { name: "Propiconazole 25% EC", dosage: "1 ml per liter of water", note: "Highly effective systemic triazole. 30-day pre-harvest interval for grain." },
      ],
    },
    quickQuestions: [
      "Will rust kill my corn crop?",
      "Does rust affect the quality of sweet corn ears?",
      "Is chemical fungicide necessary if rust appears after tasseling?",
    ],
  },
  "healthy": {
    whatIsIt: "Congratulations! This leaf displays vibrant green color, strong cell turgor, and no signs of bacterial lesions, fungal spores, or insect feeding. Your plant is photosynthesizing efficiently and channeling energy into healthy root growth, flowering, and fruit development.",
    severity: "Healthy",
    rootCauses: [
      { title: "Balanced Soil Nutrition", detail: "Optimal nitrogen, phosphorus, potassium, and micronutrient balance.", icon: "🌱" },
      { title: "Proper Water Management", detail: "Good soil aeration without stagnant root waterlogging.", icon: "☀️" },
      { title: "Adequate Air Circulation", detail: "Sunlight and breezes keep foliage dry and prevent fungal spore settlement.", icon: "💨" },
    ],
    prevention: [
      { title: "Continue Regular Field Scouting", detail: "Walk your rows twice a week, checking leaf undersides and new shoots." },
      { title: "Maintain Drip Irrigation", detail: "Keep watering consistent to avoid blossom-end rot and plant stress." },
      { title: "Routine Preventive Foliar Feed", detail: "Apply sea-kelp or compost tea monthly to strengthen leaf cuticle thickness." },
    ],
    remedies: {
      firstAid: ["No remedial action required! Keep up the good work."],
      organic: [
        { remedy: "Compost Tea Foliar Spray", preparation: "Brew 1 cup aged compost in 5 liters aerated water for 24h.", frequency: "Spray bi-weekly as a natural protective foliar probiotic." },
        { remedy: "Preventative Neem Tonic", preparation: "3 ml cold-pressed neem oil / liter.", frequency: "Monthly preventative spray against soft-bodied pests." },
      ],
      chemical: [
        { name: "No chemical fungicide needed", dosage: "0", note: "Save your money and preserve beneficial soil microbes." },
      ],
    },
    quickQuestions: [
      "What organic fertilizer can I give to keep this crop healthy?",
      "How often should I water during flowering stage?",
      "How do I prevent insects from attacking healthy leaves?",
    ],
  },
};

export function getDiseaseGuidance(
  crop: string,
  disease: string,
  isHealthy: boolean,
): DiseaseGuidance {
  if (isHealthy || disease.toLowerCase().includes("healthy")) {
    const base = CROP_DISEASE_KNOWLEDGE["healthy"]!;
    return {
      crop,
      disease: "Healthy Foliage",
      severity: "Healthy",
      whatIsIt: `Great news! This ${crop} plant leaf appears vibrant, vigorous, and free of active pathogenic infections or pest lesions. Keep maintaining your current watering and cultivation practices.`,
      rootCauses: base.rootCauses!,
      prevention: base.prevention!,
      remedies: base.remedies as DiseaseGuidance["remedies"],
      quickQuestions: base.quickQuestions!,
    };
  }

  const lookupKey = `${crop.toLowerCase()} ${disease.toLowerCase()}`.trim();
  const directMatch = CROP_DISEASE_KNOWLEDGE[lookupKey];
  if (directMatch && directMatch.whatIsIt) {
    return {
      crop,
      disease,
      severity: directMatch.severity || "High",
      whatIsIt: directMatch.whatIsIt,
      rootCauses: directMatch.rootCauses || [],
      prevention: directMatch.prevention || [],
      remedies: directMatch.remedies as DiseaseGuidance["remedies"],
      quickQuestions: directMatch.quickQuestions || [
        `What is the best treatment for ${disease} on ${crop}?`,
        `Can I use organic neem oil on this ${crop}?`,
        `Will this ${disease} spread to other crops in my farm?`,
        `How does this affect my final harvest yield?`,
      ],
    };
  }

  // Dynamic fallback generator based on agricultural pathology principles
  const isFungal = /blight|rust|mildew|spot|rot|scab|anthracnose|mold/i.test(disease);
  const isBacterial = /bacterial|wilt|canker/i.test(disease);
  const isViral = /mosaic|curl|virus|ringspot/i.test(disease);

  let whatIsIt = `${disease} is an active condition affecting your ${crop}. It damages leaf tissue, inhibiting the plant's ability to absorb sunlight and conduct photosynthesis, leading to stunted development and lower harvest quality.`;
  let severity: DiseaseGuidance["severity"] = "High";

  const rootCauses = [
    {
      title: "Excess Moisture & Humidity",
      detail: "Prolonged leaf wetness from rain or overhead watering creates the exact damp microclimate needed for plant pathogens to enter leaf pores.",
      icon: "💧",
    },
    {
      title: "Poor Canopy Air Circulation",
      detail: "Dense plant rows block natural wind flow, preventing foliage from drying quickly after morning dew.",
      icon: "🍃",
    },
    {
      title: "Soil or Seed Contamination",
      detail: "Pathogen spores often survive in unharvested crop residue or contaminated soil from the previous growing season.",
      icon: "🌱",
    },
  ];

  const prevention = [
    {
      title: "Water Soil Directly (Drip Irrigation)",
      detail: "Keep moisture off the leaves by applying water directly around the root zone.",
    },
    {
      title: "Widen Row Spacing",
      detail: "Provide at least 45–60 cm between plants so sunlight can reach the lower canopy.",
    },
    {
      title: "Disinfect Tools Regularly",
      detail: "Wipe pruning shears with 70% alcohol or bleach between plants to stop disease transmission.",
    },
    {
      title: "Crop Rotation",
      detail: "Avoid growing the same crop family in the same plot year after year.",
    },
  ];

  let firstAid = [
    "Prune off heavily infected or discolored leaves immediately using sanitized pruning shears.",
    "Bag and remove all clipped debris from the field—never leave infected leaves on the ground or in compost.",
    "Stop all sprinkler/overhead watering immediately.",
  ];

  let organic = [
    {
      remedy: "Cold-Pressed Neem Oil Spray",
      preparation: "5 ml neem oil + 2 ml organic soap per 1 liter of warm water.",
      frequency: "Spray early morning or late afternoon once every 7 days.",
    },
    {
      remedy: "Baking Soda Protective Barrier",
      preparation: "5 grams baking soda + 5 ml vegetable oil in 1 liter of water.",
      frequency: "Spray weekly to alter leaf surface pH and inhibit spore expansion.",
    },
  ];

  let chemical = [
    {
      name: isBacterial ? "Copper Oxychloride + Streptomycin" : "Copper Oxychloride 50% WP",
      dosage: isBacterial ? "2.5g Copper + 0.5g Streptomycin per liter" : "2.5 to 3 grams per liter of water",
      note: "Spray uniformly across both upper and lower leaf surfaces. 7 to 10 day harvest waiting interval.",
    },
    {
      name: isFungal ? "Mancozeb 75% WP or Chlorothalonil" : "Biological Bactericide",
      dosage: "2 grams per liter of water",
      note: "Apply as a preventative coat before expected rains. Follow safety gear guidelines.",
    },
  ];

  if (isViral) {
    severity = "Critical";
    whatIsIt = `${disease} is a systemic viral disease affecting ${crop}. Viruses circulate through the plant's vascular sap and are usually spread by sap-sucking insects like whiteflies, aphids, or thrips. It cannot be cured with fungicides, so controlling vector insects and removing diseased plants is essential.`;
    firstAid = [
      "Carefully pull up and bag severely stunted or mottled plants to stop insects from spreading the virus to healthy plants.",
      "Inspect the undersides of nearby leaves for tiny whiteflies or aphids.",
    ];
    organic = [
      {
        remedy: "Yellow Sticky Traps & Neem Spray",
        preparation: "Hang yellow sticky cards at canopy height + spray 5ml/L neem oil to deter whiteflies/aphids.",
        frequency: "Check and replace sticky traps weekly.",
      },
    ];
    chemical = [
      {
        name: "Imidacloprid 17.8% SL or Thiamethoxam",
        dosage: "0.5 ml per liter of water (Target the vector insects)",
        note: "Kills sap-sucking insects transmitting the virus. Do NOT spray while flowers are in bloom.",
      },
    ];
  }

  return {
    crop,
    disease,
    severity,
    whatIsIt,
    rootCauses,
    prevention,
    remedies: {
      firstAid,
      organic,
      chemical,
    },
    quickQuestions: [
      `How do I stop ${disease} from spreading on my ${crop}?`,
      `Is it safe to spray neem oil on this ${crop} right now?`,
      `How does ${disease} affect my crop harvest?`,
      `Should I remove the whole plant or just the infected leaves?`,
    ],
  };
}

export function answerAgronomistQuestion(
  question: string,
  guidance: DiseaseGuidance,
): string {
  const q = question.toLowerCase();

  if (guidance.severity === "Healthy") {
    if (q.includes("water") || q.includes("watering")) {
      return `For healthy ${guidance.crop}, water deeply at the base early in the morning 2–3 times a week (or when the top 2 inches of soil feel dry). Avoid frequent light sprinkling, as deep watering encourages strong, drought-resilient root systems.`;
    }
    if (q.includes("fertilizer") || q.includes("feed") || q.includes("compost")) {
      return `Your ${guidance.crop} is in great health! To keep it thriving, apply well-rotted farmyard manure, vermicompost, or a balanced organic foliar spray (like seaweed extract or compost tea) once a month. Avoid over-applying nitrogen, which can lead to soft, pest-vulnerable foliage.`;
    }
    return `Your ${guidance.crop} looks healthy and strong! Maintain your current routine: regular field scouting, bottom watering, and keeping weeds down so your crop has full access to nutrients and sunlight.`;
  }

  if (q.includes("neem") || q.includes("organic")) {
    const org = guidance.remedies.organic[0];
    return `Yes! Neem oil is a great organic defense for ${guidance.disease} on ${guidance.crop}. Use **${org?.preparation || "5ml neem oil + 2ml liquid soap per liter of warm water"}**. Spray early in the morning before 8 AM or after 5 PM so the sunlight doesn't burn wet leaves. Repeat every 7 days.`;
  }

  if (q.includes("spread") || q.includes("other plant") || q.includes("neighbor")) {
    return `⚠️ Yes, **${guidance.disease}** can spread to neighboring plants through rain splashing, wind, or contaminated pruning tools. To protect your other crops:
1. Immediately prune and bag the infected leaves (never compost them).
2. Spray neighboring healthy plants with a preventative coat of neem oil or copper oxychloride.
3. Keep leaves completely dry by watering strictly at the ground level.`;
  }

  if (q.includes("water") || q.includes("irrigation")) {
    return `Water management is crucial right now! For ${guidance.disease}:
• **NEVER spray water over the leaves or head of the plant.**
• Switch to drip lines or water gently around the root base with a watering can.
• Water early in the morning so any accidental surface splashing evaporates quickly in the sun.
• Let the top inch of soil dry out slightly between waterings to reduce humidity.`;
  }

  if (q.includes("eat") || q.includes("consume") || q.includes("safe")) {
    return `If the fruits or produce themselves do not have rotten or sunken spots, they are generally safe to consume after washing thoroughly with clean water. However, if you have sprayed chemical fungicides (like Mancozeb or Copper), make sure to observe the **safe withholding period** (usually 7 to 14 days after spraying before harvest). Always peel or wash thoroughly.`;
  }

  if (q.includes("remove") || q.includes("prune") || q.includes("cut")) {
    return `Yes! Pruning is your most important immediate step.
1. Cut off leaves that are more than 20% spotted or yellowing.
2. Put clippings straight into a plastic bag—do not let them fall onto the soil.
3. Disinfect your scissors or shears in rubbing alcohol between plants.
4. If more than 50% of the entire plant has collapsed from rot or late blight, it is best to pull up the whole plant to save the rest of your harvest.`;
  }

  if (q.includes("chemical") || q.includes("medicine") || q.includes("spray") || q.includes("fungicide")) {
    const chem = guidance.remedies.chemical[0];
    return `For fast control of ${guidance.disease}, you can apply **${chem?.name || "Copper Oxychloride 50% WP"}** at a dosage of **${chem?.dosage || "2.5g per liter of water"}**.
⚠️ **Safety tips**: Wear a face mask and rubber gloves when spraying. Spray on a calm day without high winds, and wait at least 7 days before harvesting any produce.`;
  }
  // Default reassuring response
  return `For **${guidance.disease}** on **${guidance.crop}**, here is the best immediate action:
1. **Prune & Bag**: Remove the visibly infected leaves right away so spores don't spread.
2. **Bottom Water Only**: Keep water strictly at the soil base—wet leaves make this disease worse.
3. **Treatment**: Apply ${guidance.remedies.organic[0]?.remedy || "Neem Oil"} or ${guidance.remedies.chemical[0]?.name || "Copper Oxychloride"} early in the morning.
Would you like more details on organic preparation, chemical dosage, or speaking to a live agronomist?`;
}
