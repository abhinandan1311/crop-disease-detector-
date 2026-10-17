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
    whatIsIt: "Early Blight is a common fungal infection caused by Alternaria solani. It appears as dark brown or black circular spots with concentric target-like rings on older, lower leaves first. If left unchecked, leaves turn yellow and drop off, exposing fruit to sunscald and reducing tomato harvest by up to 50%.",
    severity: "High",
    rootCauses: [
      { title: "Warm & Humid Conditions", detail: "Thrives when temperatures are between 24°C–29°C (75°F–85°F) with frequent rain or morning dew.", icon: "🌡️" },
      { title: "Rain & Water Splashing", detail: "Fungal spores survive in the soil and splash onto the lower leaves during rain or overhead watering.", icon: "🌧️" },
      { title: "Crowded Foliage & Poor Airflow", detail: "Densely planted tomatoes hold moisture in their canopy for hours, allowing spores to germinate.", icon: "🍃" },
      { title: "Infected Crop Debris", detail: "Spores easily overwinter in unharvested old tomato or potato vines left in the field.", icon: "🍂" },
    ],
    prevention: [
      { title: "Water at the Soil Line", detail: "Always use drip irrigation or water gently at the base. Never soak tomato leaves from above." },
      { title: "Mulch Heavily Around Base", detail: "Apply a 2–3 inch layer of clean straw, dry leaves, or plastic mulch to prevent soil splashing." },
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
        { remedy: "Trichoderma Bio-Fungicide", preparation: "Apply Trichoderma viride or harzianum (5g/liter) to root zone and foliage.", frequency: "Apply at planting and repeat every 14 days as a biological safeguard." },
      ],
      chemical: [
        { name: "Copper Oxychloride 50% WP", dosage: "2.5 g to 3 g per liter of water", note: "Apply as a preventative coat before rain or at first sight of spots. 7-day harvest waiting period." },
        { name: "Mancozeb 75% WP", dosage: "2 g per liter of water", note: "Broad-spectrum contact fungicide. Spray thoroughly to cover both leaf surfaces. Rotate with copper." },
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
    whatIsIt: "Late Blight is an aggressive, destructive water mold (Phytophthora infestans). It causes large, water-soaked, dark greasy lesions on leaves and stems, with white fuzzy mold underneath in high humidity. It can destroy an entire tomato crop within 7 to 10 days if not treated immediately.",
    severity: "Critical",
    rootCauses: [
      { title: "Cool, Wet & Foggy Weather", detail: "Spreads rapidly when temperatures are 15°C–22°C (60°F–72°F) with prolonged leaf wetness.", icon: "❄️" },
      { title: "Wind-Borne Spores", detail: "Spores can travel miles on moist wind currents from nearby affected potato or tomato fields.", icon: "💨" },
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
  "tomato bacterial spot": {
    whatIsIt: "Bacterial Spot (Xanthomonas spp.) causes small, water-soaked, dark brown to black spots with greasy margins on tomato leaves, stems, and fruits. Affected leaves turn yellow, scorch, and drop, while fruits develop rough, raised scabby lesions.",
    severity: "High",
    rootCauses: [
      { title: "Warm, Wet Weather & Wind-Driven Rain", detail: "Bacteria enter through natural leaf openings (stomata) and insect wounds during humid, rainy weather.", icon: "🌧️" },
      { title: "Contaminated Seed or Transplants", detail: "Infected seeds are the primary source of initial field outbreaks.", icon: "🌱" },
    ],
    prevention: [
      { title: "Use Hot-Water Treated Seed", detail: "Only plant certified disease-free seed or transplants." },
      { title: "Avoid Overhead Sprinklers", detail: "Water at the soil base to keep leaves dry." },
    ],
    remedies: {
      firstAid: [
        "Prune off heavily spotted lower leaves and dispose in trash bags.",
        "Sanitize shears with 70% rubbing alcohol between plants.",
      ],
      organic: [
        { remedy: "Fixed Copper Hydroxide", preparation: "2.5 g per liter of water.", frequency: "Spray weekly early in the morning before rain events." },
      ],
      chemical: [
        { name: "Copper Oxychloride + Streptomycin Sulphate", dosage: "2.5g Copper + 0.5g Streptomycin per liter", note: "Controls bacterial multiplication. Observe 7-day harvest interval." },
      ],
    },
    quickQuestions: [
      "Will fungicides cure bacterial spot?",
      "Are tomatoes with scabby spots safe to eat?",
      "How do bacteria enter tomato leaves?",
    ],
  },
  "tomato yellow leaf curl virus": {
    whatIsIt: "Tomato Yellow Leaf Curl Virus (TYLCV) is a destructive plant virus transmitted by the silverleaf whitefly (Bemisia tabaci). Infected plants become severely stunted with upward-curling, cupped leaves, yellow margins, and flower drop, resulting in little to no fruit set.",
    severity: "Critical",
    rootCauses: [
      { title: "Whitefly Vector Influx", detail: "Sap-sucking whiteflies feed on infected plants and inject the virus into healthy plants within 15–30 minutes.", icon: "🪰" },
      { title: "Hot, Dry Weather", detail: "Favors explosive whitefly reproduction and migration.", icon: "☀️" },
    ],
    prevention: [
      { title: "Plant TYLCV-Resistant Cultivars", detail: "Choose hybrids with Ty-1 or Ty-3 resistance genes." },
      { title: "Insect Exclusion Netting", detail: "Use 50-mesh insect netting in nurseries and greenhouse tunnels." },
    ],
    remedies: {
      firstAid: [
        "Immediately rogue (pull out) and bag symptomatic plants to eliminate the virus reservoir.",
        "Spray with insecticidal soap before pulling to prevent whiteflies from flying to adjacent plants.",
      ],
      organic: [
        { remedy: "Yellow Sticky Traps + Neem Oil", preparation: "Hang yellow sticky cards at canopy level + spray 5ml/L cold-pressed neem oil.", frequency: "Replace sticky traps weekly; spray neem every 4 days." },
      ],
      chemical: [
        { name: "Thiamethoxam 25% WG or Acetamiprid", dosage: "0.5 g per liter of water", note: "Controls whitefly vector populations. Do NOT spray during bloom to protect honeybees." },
      ],
    },
    quickQuestions: [
      "Can TYLCV be cured with chemicals?",
      "How do I control whiteflies in my tomatoes?",
      "Should I pull out curling tomato plants immediately?",
    ],
  },
  "potato late blight": {
    whatIsIt: "Late Blight is the pathogen behind the historic Irish potato famine. It causes water-soaked, dark greasy lesions on foliage and stems, and washes down into the soil to turn tubers into a reddish-brown, foul-smelling rot.",
    severity: "Critical",
    rootCauses: [
      { title: "Prolonged Leaf Wetness", detail: "Requires 8–10 hours of moisture on foliage at 12°C–20°C to initiate a field-wide outbreak.", icon: "🌧️" },
      { title: "Infected Seed Tubers", detail: "Planting infected seed potatoes is the primary vector for introducing late blight into a plot.", icon: "🥔" },
    ],
    prevention: [
      { title: "Certified Disease-Free Seed", detail: "Only purchase certified seed tubers from trusted agricultural agencies." },
      { title: "High Soil Hilling", detail: "Hill soil deeply over growing tubers to create a physical dirt barrier against washing spores." },
      { title: "Kill Vines 2 Weeks Before Harvest", detail: "Mow or cut foliage 14 days before harvest to prevent spores from touching tubers during digging." },
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
        { name: "Dimethomorph + Mancozeb", dosage: "2 g per liter of water", note: "Provides anti-sporulant action. 10-day pre-harvest interval." },
        { name: "Metalaxyl-M 4% + Mancozeb 64%", dosage: "2.5 g per liter of water", note: "Systemic protection for new shoot growth." },
      ],
    },
    quickQuestions: [
      "Will the potatoes underground rot if leaves have blight?",
      "Should I dig up my potatoes early if blight hits?",
      "How can I tell if seed potatoes carry late blight?",
    ],
  },
  "potato early blight": {
    whatIsIt: "Early Blight on potatoes (Alternaria solani) produces dark brown, circular bullseye spots on older leaves. Severe infection causes early defoliation, stunted tuber sizing, and dark, leathery dry rot on the potato skin.",
    severity: "High",
    rootCauses: [
      { title: "Alternating Wet and Dry Cycles", detail: "Heavy dew followed by sunny warm days triggers rapid spore release.", icon: "🌤️" },
      { title: "Plant Stress & Nitrogen Deficiency", detail: "Older, stressed potato plants are far more susceptible.", icon: "🍂" },
    ],
    prevention: [
      { title: "Maintain Balanced Plant Nutrition", detail: "Avoid nitrogen depletion during tuber bulking." },
      { title: "Avoid Sprinkler Irrigation", detail: "Keep foliage dry to reduce spore germination." },
    ],
    remedies: {
      firstAid: [
        "Prune off spotted lower leaves and dispose away from the field.",
        "Avoid harvesting potatoes until skin has hardened completely.",
      ],
      organic: [
        { remedy: "Neem Oil + Baking Soda", preparation: "5 ml neem oil + 4 g baking soda per 1 liter water.", frequency: "Apply every 7 days as a preventative protective shield." },
      ],
      chemical: [
        { name: "Mancozeb 75% WP or Chlorothalonil", dosage: "2 g per liter of water", note: "Spray at first sign of leaf lesions; repeat every 7 to 10 days." },
      ],
    },
    quickQuestions: [
      "How does early blight affect potato tuber size?",
      "Can early blight survive in the soil over winter?",
      "When is the best time to spray potato foliage?",
    ],
  },
  "corn common rust": {
    whatIsIt: "Common Rust (Puccinia sorghi) creates cinnamon-brown to golden-brown powdery pustules on both upper and lower surfaces of corn leaves. Severe infections rupture the leaf epidermis, causing moisture loss and poor ear filling.",
    severity: "Moderate",
    rootCauses: [
      { title: "Moderate Temperatures & Dew", detail: "Develops rapidly at 16°C–25°C with heavy night dew or frequent showers.", icon: "🌽" },
      { title: "Wind-Borne Spores", detail: "Fungal spores do not survive freezing winters; they blow northward every season on storm fronts.", icon: "🌪️" },
    ],
    prevention: [
      { title: "Plant Rust-Resistant Hybrids", detail: "Select maize hybrids bearing the 'Rp' resistance gene." },
      { title: "Early Planting", detail: "Plant early in the season so corn matures before peak spore migration in midsummer." },
    ],
    remedies: {
      firstAid: [
        "Assess how many leaves below the ear have pustules. If it appears late near maturity, treatment is often unnecessary.",
      ],
      organic: [
        { remedy: "Wettable Sulfur", preparation: "3 g wettable sulfur per liter of water.", frequency: "Apply at earliest sign. Do not apply when temperatures exceed 32°C (90°F)." },
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
  "corn northern leaf blight": {
    whatIsIt: "Northern Leaf Blight (Exserohilum turcicum) produces large, cigar-shaped, grayish-green to tan lesions that run parallel to the leaf veins. In severe outbreaks, leaves become completely blighted, causing premature plant death and severe yield loss.",
    severity: "High",
    rootCauses: [
      { title: "Moderate Temperatures & High Humidity", detail: "Favored by temperatures of 18°C–27°C with prolonged damp foliage.", icon: "🌧️" },
      { title: "Crop Residue", detail: "Spores overwinter on infected corn stubble left on the soil surface.", icon: "🌾" },
    ],
    prevention: [
      { title: "Resistant Hybrids", detail: "Select corn varieties with Ht genes." },
      { title: "Crop Rotation & Deep Tillage", detail: "Rotate away from corn for at least 1 year to decompose residue." },
    ],
    remedies: {
      firstAid: ["Scout field at V8 to tasseling stage. Protect the ear leaf."],
      organic: [{ remedy: "Copper Fungicide", preparation: "2.5 g/L", frequency: "Spray before tasseling on early lesions." }],
      chemical: [{ name: "Azoxystrobin or Pyraclostrobin", dosage: "1 ml per liter of water", note: "Apply at tassel emergence if lesions are found on leaves below the ear." }],
    },
    quickQuestions: [
      "What are the long cigar-shaped spots on corn leaves?",
      "How much grain yield is lost to Northern Leaf Blight?",
      "When is fungicide application most effective in corn?",
    ],
  },
  "apple scab": {
    whatIsIt: "Apple Scab (Venturia inaequalis) causes olive-green to velvety brown or black scabby lesions on apple leaves and fruit. Infected leaves drop prematurely, while infected apples become distorted, cracked, and unmarketable.",
    severity: "High",
    rootCauses: [
      { title: "Spring Rains & Overwintering Leaves", detail: "Spores shoot out from fallen dead leaves on the ground during spring rain events.", icon: "🍏" },
    ],
    prevention: [
      { title: "Rake & Shred Fallen Leaves", detail: "Eliminate overwintering leaves in autumn by composting or mulching." },
      { title: "Plant Scab-Resistant Varieties", detail: "Cultivars like Liberty, Prima, and Enterprise have genetic resistance." },
    ],
    remedies: {
      firstAid: ["Prune tree canopy in winter for maximum airflow and sunlight penetration."],
      organic: [{ remedy: "Lime Sulfur or Liquid Copper", preparation: "Follow label dilution during green tip to pink bud stage.", frequency: "Apply prior to major rain events in spring." }],
      chemical: [{ name: "Myclobutanil or Captan 50% WP", dosage: "2 g per liter of water", note: "Apply preventatively from bud break through petal fall." }],
    },
    quickQuestions: [
      "Are apples with scab lesions safe to eat or make cider?",
      "How do I prevent apple scab in early spring?",
      "Can fallen autumn leaves spread scab next year?",
    ],
  },
  "grape black rot": {
    whatIsIt: "Black Rot (Guignardia bidwellii) causes reddish-brown circular spots on grape leaves and turns green grape berries into shriveled, hard, black mummies hanging on the vine.",
    severity: "Critical",
    rootCauses: [
      { title: "Warm, Wet Spring Weather", detail: "Spores from overwintered mummified berries infect new shoots and berry clusters.", icon: "🍇" },
    ],
    prevention: [
      { title: "Remove All Mummified Grapes", detail: "Drop and destroy dried mummies from vines and ground during winter pruning." },
      { title: "Open Canopy Trellising", detail: "Position canes so breezes dry grape clusters within 2 hours of rainfall." },
    ],
    remedies: {
      firstAid: ["Clip off infected leaf clusters and drop mummies into sealed trash bags."],
      organic: [{ remedy: "Copper Hydroxide + Sulfur", preparation: "2 g/L each", frequency: "Spray from 2-inch shoot stage until 4 weeks after bloom." }],
      chemical: [{ name: "Mancozeb or Myclobutanil", dosage: "2 g / 1 ml per liter of water", note: "Critical spray window is immediate pre-bloom through 4 weeks post-bloom." }],
    },
    quickQuestions: [
      "Why are my grapes turning into dry black mummies?",
      "Can black rot be stopped once berries start turning black?",
      "What is the most critical time to spray grape vines?",
    ],
  },
  "pepper bacterial spot": {
    whatIsIt: "Bacterial Spot (Xanthomonas spp.) on peppers produces small, pimple-like, water-soaked dark spots on leaves that turn brown with yellow halos. Causes heavy defoliation and sunken, wart-like lesions on bell and chili peppers.",
    severity: "High",
    rootCauses: [
      { title: "Splashing Water & High Heat", detail: "Bacteria multiply rapidly in hot, humid weather (24°C–32°C) and spread via splash-back.", icon: "🌶️" },
    ],
    prevention: [
      { title: "Certified Disease-Free Seed", detail: "Use hot-water treated or tested seed." },
      { title: "Drip Irrigation", detail: "Avoid sprinkler watering to keep pepper foliage bone dry." },
    ],
    remedies: {
      firstAid: ["Remove heavily infected lower pepper leaves immediately."],
      organic: [{ remedy: "Copper Octanoate Spray", preparation: "10 ml per liter water.", frequency: "Spray every 7 days in morning hours." }],
      chemical: [{ name: "Copper Oxychloride + Streptomycin", dosage: "2.5g + 0.5g per liter", note: "Spray preventatively prior to forecasted summer storms." }],
    },
    quickQuestions: [
      "Can I harvest peppers from plants with bacterial spot?",
      "How do I stop leaf drop on my chili pepper plants?",
      "Will neem oil cure bacterial leaf spot on peppers?",
    ],
  },
  "rice blast": {
    whatIsIt: "Rice Blast (Magnaporthe oryzae) is one of the most devastating cereal diseases worldwide. It causes spindle- or diamond-shaped lesions with gray centers on rice leaves, and attacks the panicle neck ('neck blast'), causing whole heads to snap and turn white.",
    severity: "Critical",
    rootCauses: [
      { title: "Excessive Nitrogen & High Humidity", detail: "Over-fertilizing with nitrogen softens plant cell walls, making them vulnerable.", icon: "🌾" },
    ],
    prevention: [
      { title: "Balanced Nitrogen Management", detail: "Split nitrogen applications into 3–4 smaller doses rather than heavy single doses." },
      { title: "Resistant Varieties", detail: "Plant blast-resistant rice cultivars suited to your region." },
    ],
    remedies: {
      firstAid: ["Drain excessive stagnant water from paddies temporarily to reduce field humidity."],
      organic: [{ remedy: "Pseudomonas fluorescens Bio-Control", preparation: "10 g per liter of water as foliar spray.", frequency: "Apply at tillering and boot leaf stage." }],
      chemical: [{ name: "Tricyclazole 75% WP", dosage: "0.6 g per liter of water", note: "Gold standard systemic fungicide for rice blast. Spray at boot stage and panicle emergence." }],
    },
    quickQuestions: [
      "What causes white empty heads (neck blast) in rice?",
      "How does nitrogen fertilizer affect rice blast severity?",
      "What is the best fungicide for rice blast control?",
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
  const isGeneral =
    crop.toLowerCase() === "crop" ||
    crop.toLowerCase() === "general" ||
    disease.toLowerCase() === "leaf check" ||
    disease.toLowerCase() === "crop advisory";

  if (isGeneral) {
    return {
      crop: "All Crops",
      disease: "General Advisory",
      severity: "Healthy",
      whatIsIt: "Verdant AI Agronomist is ready to diagnose crop ailments, explain leaf spots, calculate organic and chemical spray dosages, and provide crop-specific cultivation guidance across 40+ agricultural varieties.",
      rootCauses: [
        { title: "Excess Moisture & Poor Airflow", detail: "Overhead watering and tight planting can foster fungal spores and bacterial leaf spots.", icon: "💧" },
        { title: "Nutrient Deficiencies", detail: "Lack of nitrogen, phosphorus, potassium, or micronutrients causes leaf chlorosis and stunted yield.", icon: "🌱" },
        { title: "Pest Vectors", detail: "Aphids, whiteflies, and mites damage foliage and transmit systemic plant viruses.", icon: "🪲" },
      ],
      prevention: [
        { title: "Drip Irrigation at Root Line", detail: "Keep foliage dry to reduce bacterial and fungal spore germination by 80%." },
        { title: "Balanced Crop Rotation", detail: "Rotate crop families every 2–3 seasons to disrupt soil-borne pathogen cycles." },
        { title: "Sanitary Field Scouting", detail: "Inspect leaf undersides weekly and sanitize shears with 70% alcohol." },
      ],
      remedies: {
        firstAid: [
          "Upload a clear photo of an affected leaf for instant AI pathology assessment.",
          "Inspect the undersides of leaves for tiny moving insects or powdery deposits.",
          "Water crops only at the soil line early in the morning.",
        ],
        organic: [
          { remedy: "Preventative Cold-Pressed Neem Oil", preparation: "5 ml pure neem oil + 2 ml organic dish soap per 1 liter warm water.", frequency: "Spray weekly early in the morning or near dusk." },
          { remedy: "Aerated Compost Tea Foliar Spray", preparation: "Brew 1 cup matured compost in 5L aerated water for 24h.", frequency: "Spray bi-weekly as a probiotic leaf strengthener." },
        ],
        chemical: [
          { name: "Broad-Spectrum Copper Oxychloride 50% WP", dosage: "2.5 g per liter of water", note: "Preventative protection against broad fungal/bacterial leaf spots." },
        ],
      },
      quickQuestions: [
        "Why are my plant leaves turning yellow?",
        "How do I prepare an effective organic neem oil spray?",
        "What are the best watering practices to prevent plant disease?",
        "How do I get rid of aphids and whiteflies naturally?",
        "What fertilizer should I apply for flowering and fruiting?",
      ],
    };
  }

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

  const cleanCrop = crop.toLowerCase().trim();
  const cleanDisease = disease.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").trim();
  const lookupKey = `${cleanCrop} ${cleanDisease}`;

  // Try direct match or key containment
  for (const [key, value] of Object.entries(CROP_DISEASE_KNOWLEDGE)) {
    if (key === "healthy") continue;
    if (lookupKey.includes(key) || key.includes(lookupKey)) {
      return {
        crop,
        disease,
        severity: value.severity || "High",
        whatIsIt: value.whatIsIt || `${disease} is an active condition affecting your ${crop}.`,
        rootCauses: value.rootCauses || [],
        prevention: value.prevention || [],
        remedies: value.remedies as DiseaseGuidance["remedies"],
        quickQuestions: value.quickQuestions || [
          `Can I still eat the produce from this ${crop}?`,
          `How often should I spray neem oil for ${disease}?`,
          `Will this spread to my neighboring crops?`,
          `Should I prune the infected leaves immediately?`,
        ],
      };
    }
  }

  // Dynamic fallback generator based on agricultural pathology principles
  const isFungal = /blight|rust|mildew|spot|rot|scab|anthracnose|mold|smut/i.test(disease);
  const isBacterial = /bacterial|wilt|canker|black rot/i.test(disease);
  const isViral = /mosaic|curl|virus|ringspot/i.test(disease);
  const isPest = /mite|aphid|worm|borer|fly|beetle/i.test(disease);

  const severity: DiseaseGuidance["severity"] = isViral ? "Critical" : "High";
  let whatIsIt = `${disease} is an active condition affecting your ${crop}. It damages leaf tissue, inhibiting the plant's ability to absorb sunlight and conduct photosynthesis, leading to stunted development and lower harvest quality.`;

  if (isFungal) {
    whatIsIt = `${disease} on ${crop} is a fungal infection that attacks leaf tissues, creating necrotic lesions or powdery coatings. Fungi thrive in humid, damp canopies and can lead to severe defoliation and yield loss if left untreated.`;
  } else if (isBacterial) {
    whatIsIt = `${disease} on ${crop} is caused by plant-pathogenic bacteria that penetrate through stomata or mechanical wounds. It causes water-soaked spots, stem cankers, and vascular collapse during warm, rainy weather.`;
  } else if (isViral) {
    whatIsIt = `${disease} is a systemic viral infection affecting ${crop}. Viruses circulate in the plant vascular sap and are transmitted by insect vectors like whiteflies or aphids. There is no chemical cure once infected, so vector control and sanitization are vital.`;
  } else if (isPest) {
    whatIsIt = `${disease} on ${crop} is caused by pest infestation. The pests feed on leaf sap or tissue, causing stippling, webbing, and yellowing, weakening the plant's vigor.`;
  }

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

  const firstAid = [
    "Prune off heavily infected or discolored leaves immediately using sanitized pruning shears.",
    "Bag and remove all clipped debris from the field—never leave infected leaves on the ground or in compost.",
    "Stop all sprinkler/overhead watering immediately.",
  ];

  const organic = [
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

  const chemical = [
    {
      name: isBacterial ? "Copper Oxychloride + Streptomycin" : "Copper Oxychloride 50% WP",
      dosage: isBacterial ? "2.5g Copper + 0.5g Streptomycin per liter" : "2.5 to 3 grams per liter of water",
      note: "Spray uniformly across both upper and lower leaf surfaces. 7 to 10 day harvest waiting interval.",
    },
    {
      name: isFungal ? "Mancozeb 75% WP or Chlorothalonil" : "Broad-Spectrum Protectant",
      dosage: "2 grams per liter of water",
      note: "Apply as a preventative coat before expected rains. Follow safety gear guidelines.",
    },
  ];

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
      `Can I still eat the produce from this ${crop}?`,
      `How often should I spray neem oil for ${disease}?`,
      `Will this spread to my neighboring crops?`,
      `How much foliage should I prune off?`,
    ],
  };
}

export function answerAgronomistQuestion(
  question: string,
  guidance: DiseaseGuidance,
): string {
  const q = question.toLowerCase().trim();
  const isGeneralMode =
    guidance.crop.toLowerCase().includes("crop") ||
    guidance.crop.toLowerCase().includes("general") ||
    guidance.disease.toLowerCase().includes("general") ||
    guidance.disease.toLowerCase().includes("leaf check");

  // Detect if user mentions a specific crop in their query
  const cropMentions = [
    "tomato", "potato", "corn", "maize", "rice", "wheat", "chili", "pepper",
    "eggplant", "brinjal", "apple", "grape", "orange", "citrus", "cucumber",
    "squash", "strawberry", "soybean", "cotton", "banana", "mango", "onion",
  ];
  const detectedCrop = cropMentions.find((c) => q.includes(c));
  const queryDiseaseKey = detectedCrop
    ? Object.keys(CROP_DISEASE_KNOWLEDGE).find((key) => {
        const cropPrefix = `${detectedCrop} `;
        return key.startsWith(cropPrefix) && q.includes(key.slice(cropPrefix.length));
      })
    : undefined;
  const queryGuidance =
    detectedCrop && queryDiseaseKey
      ? getDiseaseGuidance(
          detectedCrop,
          queryDiseaseKey.slice(detectedCrop.length + 1),
          false,
        )
      : undefined;
  const responseGuidance = queryGuidance ?? guidance;
  const isGeneralResponseMode = isGeneralMode && !queryGuidance;
  const activeCrop =
    detectedCrop
      ? detectedCrop.charAt(0).toUpperCase() + detectedCrop.slice(1)
      : isGeneralMode
        ? "Your crops"
        : responseGuidance.crop;
  const activeDisease = isGeneralResponseMode
    ? detectedCrop
      ? `Health of ${activeCrop}`
      : "General crop health"
    : responseGuidance.disease;

  // 1. GREETINGS & PLEASANTRIES
  if (
    /^(hi|hello|hey|namaste|greetings|good\s*(morning|afternoon|evening)|howdy)\b/i.test(q) ||
    q === "hi" ||
    q === "hello"
  ) {
    if (isGeneralResponseMode) {
      return `Hello! 🌿 I'm **Verdant AI**, your 24/7 digital agronomist.\n\nI can help you with:\n• **Disease diagnosis**: Upload a leaf scan for instant ML-powered pathology.\n• **Remedy formulations**: Exact recipes for organic neem oil, bio-controls, and chemical fungicides.\n• **Farm practices**: Pruning schedules, drip irrigation, pest prevention, and soil fertilization.\n\nWhat crop are you growing today, or how can I assist your farm?`;
    }
    return `Hello! 🌿 I'm here to assist with your **${responseGuidance.crop}** (${responseGuidance.disease}).\n\nAsk me anything about:\n• Can you eat the harvest?\n• Organic neem oil recipes & chemical dosages\n• How to prune diseased leaves & stop spreading\n• Watering and soil nutrition tips\n\nWhat would you like to know?`;
  }

  // 2. BOT IDENTITY & CAPABILITIES
  if (
    q.includes("who are you") ||
    q.includes("what is verdant") ||
    q.includes("what can you do") ||
    q.includes("what are you") ||
    q.includes("help me")
  ) {
    return `I am **Verdant AI**, an intelligent agronomy assistant designed to help farmers and gardeners protect their crops.\n\n**Here is what I can do for you:**\n1. 🔍 **Leaf Pathology**: Analyze visual symptoms of 40+ fungal, bacterial, and viral crop diseases.\n2. 🌿 **Organic Formulations**: Step-by-step recipes for neem oil, baking soda sprays, and beneficial microbes.\n3. 💊 **Chemical Dosages**: Exact dilution rates (grams/liter) for approved fungicides and safety intervals (PHI).\n4. 💧 **Irrigation & Soil**: Water management, organic NPK fertilization, and soil hygiene rules.\n5. 🧑‍🌾 **Expert Connections**: Guidance on when to consult an agronomist or schedule voice/video assessments.\n\nUpload a leaf photo or ask any crop-related question!`;
  }

  // 3. GRATITUDE & CLOSING
  if (
    /^(thank|thanks|thank you|ok|okay|got it|awesome|great|cool|good job|bye|goodbye)\b/i.test(q) ||
    q === "thanks" ||
    q === "thank you"
  ) {
    return `You're very welcome! 🌱 Wishing you a vigorous, disease-free harvest!\n\nRemember to scout your crops twice a week, water strictly at the soil line, and inspect leaf undersides. If you notice any new spots or wilting, I'm always here to assist. Happy farming! 🌾`;
  }

  // 4. YELLOW LEAVES DIAGNOSIS
  if (
    q.includes("yellow leaf") ||
    q.includes("yellow leaves") ||
    q.includes("turning yellow") ||
    q.includes("chlorosis") ||
    q.includes("yellowing")
  ) {
    return `### 🍃 Why Are ${activeCrop} Leaves Turning Yellow?\n\nYellowing foliage (chlorosis) is caused by 4 primary factors:\n\n1. **Overwatering or Poor Drainage**: If bottom leaves turn limp, soft yellow, the roots are suffocating from waterlogged soil. Let the top 2 inches dry out.\n2. **Nitrogen Deficiency**: If older lower leaves turn a uniform pale yellow while new growth stays light green, the plant needs nitrogen. Top-dress with compost, vermicompost, or balanced organic fertilizer.\n3. **Fungal / Bacterial Leaf Spots**: If yellow halos surround brown or black necrotic spots, an active pathogen (like Early Blight or Septoria) is attacking. Prune off spotted leaves.\n4. **Lack of Sunlight**: Dense lower canopy foliage often yellows naturally due to shade. Prune bottom leaves to improve air and light penetration.`;
  }

  // 5. LEAF CURLING DIAGNOSIS
  if (
    q.includes("curling") ||
    q.includes("curled") ||
    q.includes("leaf curl") ||
    q.includes("twisting")
  ) {
    return `### 🌀 Causes of Leaf Curling in ${activeCrop}\n\n• **Upward Curling with Stunted Growth (Viral/Pest)**: In tomatoes, chilies, and peppers, upward-cupped leaves with yellow edges often indicate **Yellow Leaf Curl Virus**, transmitted by sap-sucking **whiteflies or thrips**.\n• **Downward Inward Rolling (Heat/Water Stress)**: Leaves roll inward into a tube during hot afternoons to conserve moisture. Ensure consistent deep watering and mulch heavily.\n• **Distorted Puckered Leaves (Aphids/Mites)**: Check the undersides of young leaves with a magnifying glass for tiny green aphids or microscopic broad mites. Spray with **5ml/L cold-pressed neem oil**.\n• **Herbicide Drift**: Inward twisting and claw-like distortion can occur if weed killer drifted from a nearby lawn or field.`;
  }

  // 6. WHITE POWDER / POWDERY MILDEW
  if (
    q.includes("white powder") ||
    q.includes("white spots") ||
    q.includes("powdery") ||
    q.includes("mildew")
  ) {
    return `### ⚪ White Powdery Coating on ${activeCrop}\n\nA flour-like white dusting on leaf surfaces indicates **Powdery Mildew** (a fungal disease common in warm, dry days with high nighttime humidity):\n\n**Organic Remedy (Milk & Baking Soda Spray)**:\n• **Milk Spray**: Mix 400 ml cow's milk + 600 ml water. Spray under full midday sunlight. Proteins in milk react with UV rays to create natural antiseptics that kill the mildew!\n• **Baking Soda**: 5g baking soda + 5ml vegetable oil + 1 liter water. Apply weekly.\n• **Fungicide**: Wettable Sulfur (3g/L) or Potassium Bicarbonate. Do not apply sulfur in temperatures over 32°C (90°F).`;
  }

  // 7. INSECTS & PESTS (Aphids, Whiteflies, Mites, Caterpillars)
  if (
    q.includes("pest") ||
    q.includes("insect") ||
    q.includes("bug") ||
    q.includes("aphid") ||
    q.includes("whitefly") ||
    q.includes("whiteflies") ||
    q.includes("mite") ||
    q.includes("caterpillar") ||
    q.includes("worm") ||
    q.includes("thrip")
  ) {
    return `### 🪲 Natural & Fast Pest Control for ${activeCrop}\n\n1. **Strong Water Jet**: Blast leaf undersides with water to dislodge aphid colonies.\n2. **Yellow Sticky Cards**: Hang yellow cards at plant canopy level. Whiteflies, aphids, and fungus gnats are attracted to yellow and stick immediately.\n3. **Neem Oil Emulsion**: 5 ml cold-pressed neem oil + 2 ml organic dish soap per 1 liter lukewarm water. Spray leaf undersides every 4–5 days.\n4. **Garlic-Chili Natural Spray**: Blend 2 heads of garlic + 3 hot chilies in 1 liter of water, strain, and spray as an organic repellent against chewing insects.\n5. **Encourage Beneficial Predators**: Ladybugs, lacewings, and hoverfly larvae consume up to 50 aphids a day. Avoid broad-spectrum chemicals that kill beneficial predators.`;
  }

  // 8. WATERING & IRRIGATION
  if (
    q.includes("water") ||
    q.includes("watering") ||
    q.includes("irrigation") ||
    q.includes("drip") ||
    q.includes("moisture") ||
    q.includes("overwatering")
  ) {
    if (responseGuidance.severity === "Healthy" || isGeneralResponseMode) {
      return `### 💧 Irrigation Master Rules for ${activeCrop}\n\n1. **Base Watering Only**: Never spray water over foliage or plant heads. Wet leaves are the #1 cause of fungal and bacterial infections.\n2. **Morning Schedule**: Water between 6:00 AM and 9:00 AM so any incidental surface moisture evaporates before noon.\n3. **The 2-Inch Soil Check**: Push your finger 2 inches into the soil. Water only if it feels completely dry. Water deeply so roots grow downward.\n4. **Mulch Protection**: Apply a 2–3 inch layer of organic straw, bark, or dry leaves to conserve moisture and stop soil pathogens from splashing.`;
    }
    return `### 💧 Crucial Water Management for ${responseGuidance.disease} on ${responseGuidance.crop}\n\nWater management is vital to halt this active disease:\n• **STOP all overhead sprinklers immediately!** Moisture on foliage allows spores to germinate in under 4 hours.\n• **Switch to drip irrigation** or water gently around the root base with a spout.\n• **Water early in the morning** so any splash evaporates immediately in the sun.\n• Allow the top inch of soil to dry out between waterings to reduce humidity around lower leaves.`;
  }

  // 9. FERTILIZER, COMPOST, SOIL & NPK
  if (
    q.includes("fertilizer") ||
    q.includes("feed") ||
    q.includes("manure") ||
    q.includes("compost") ||
    q.includes("npk") ||
    q.includes("nitrogen") ||
    q.includes("soil") ||
    q.includes("nutrition")
  ) {
    return `### 🌾 Soil & Fertilizer Advice for ${activeCrop}\n\n• **Vegetative Phase (Leaf & Stem Growth)**: Apply well-rotted farmyard manure, vermicompost, or balanced nitrogen fertilizer (e.g. 10-10-10 or compost tea).\n• **Flowering & Fruit-Setting Phase**: Switch to **high Phosphorus (P) and Potassium (K)** (e.g. bone meal, wood ash, or 5-10-10). Excess nitrogen now will cause flower drop and soft, pest-vulnerable foliage.\n• **Calcium & Magnesium**: To prevent blossom-end rot in tomatoes and peppers, ensure adequate calcium (gypsum or crushed eggshells) and maintain even soil moisture.\n• **Soil pH**: Aim for a slightly acidic to neutral pH between **6.0 and 6.8** for optimal nutrient absorption.`;
  }

  // 10. HARVEST SAFETY & EDIBILITY ("Can I eat it?")
  if (
    q.includes("eat") ||
    q.includes("edible") ||
    q.includes("consume") ||
    q.includes("safe to eat") ||
    q.includes("human") ||
    q.includes("toxic") ||
    q.includes("poison") ||
    q.includes("green tomato")
  ) {
    if (isGeneralResponseMode) {
      return `### 🥗 Produce Edibility & Food Safety\n\n• Produce harvested from disease-affected crops is generally safe for humans to eat **if the fruit itself is firm, unblemished, and free of rot or lesions**.\n• Discard any fruits or vegetables showing sunken black spots, mold, or soft rot.\n• **Chemical Safety**: If chemical fungicides or pesticides were sprayed, always observe the **Pre-Harvest Interval (PHI)** (typically 7 to 14 days). Thoroughly wash with clean water and peel before eating.`;
    }
    return `### 🥗 Can You Eat Tomatoes with ${responseGuidance.disease}?\n\n• **Unblemished fruit**: **Generally yes**—tomatoes that are firm and have no lesions or rot are not made poisonous by early blight on the leaves.\n• **Affected fruit**: Discard tomatoes with sunken spots, mold, soft rot, or other visible damage.\n• **Fungicide safety**: If the crop was sprayed, follow the product label's pre-harvest interval (PHI); do not rely on a generic waiting period.\n• Wash sound tomatoes with clean potable water before eating.`;
  }

  // 11. PLANT SURVIVAL ("Will it die? / Can I save it?")
  if (
    q.includes("die") ||
    q.includes("kill") ||
    q.includes("survive") ||
    q.includes("save") ||
    q.includes("too late") ||
    q.includes("recover") ||
    q.includes("fatal") ||
    q.includes("lost")
  ) {
    if (responseGuidance.severity === "Critical") {
      return `### 🩺 Plant Prognosis: High Urgency\n\nBecause **${responseGuidance.disease}** has a **Critical** severity rating, immediate action is required:\n• **If under 30% of foliage is affected**: You CAN save the plant! Prune off all diseased shoots immediately, spray systemic or copper protectant within 24 hours, and switch to strict ground watering.\n• **If over 50% of the plant is black, collapsed, or virally stunted**: Pull up the entire plant and bag it. It cannot be cured, and keeping it will sacrifice your surrounding healthy crops.`;
    }
    return `### 🩺 Yes, Your ${responseGuidance.crop} Can Be Saved!\n\nSince **${responseGuidance.disease}** is currently at a **${responseGuidance.severity}** severity level, prompt action will stop the infection and protect your harvest:\n\n1. **Prune Diseased Foliage Right Now**: Snip off spotted lower leaves (bottom 12–18 inches).\n2. **Apply Protective Spray**: Use organic neem oil or copper oxychloride within 24 hours.\n3. **Keep Leaves Dry**: Bottom-water only. Spores need moisture to spread.\n\nYour plant will produce fresh, healthy foliage from new growth nodes once pathogen pressure is relieved!`;
  }

  // 12. HARVEST YIELD & ECONOMIC IMPACT
  if (
    q.includes("yield") ||
    q.includes("harvest") ||
    q.includes("production") ||
    q.includes("loss") ||
    q.includes("damage") ||
    q.includes("quality")
  ) {
    return `### 📉 Impact of ${responseGuidance.disease} on Harvest & Yield\n\nIf left unmanaged, this condition can reduce harvest yields by **30% to 50%**:\n• **Loss of Photosynthesis**: Spotted leaves turn yellow and drop prematurely, depriving developing fruit of essential sugars.\n• **Sunscald Risk**: Premature leaf drop exposes green tomatoes and fruits to intense sun, causing white leathery sunscald blisters.\n• **Blossom Drop**: Infected plants drop flowers before pollination can occur.\n\n**The Solution**: Early pruning and a single preventative protective spray preserves over 80% of your projected harvest!`;
  }

  // 13. CONTAGION & SPREAD TO OTHER PLANTS
  if (
    q.includes("spread") ||
    q.includes("contagious") ||
    q.includes("neighbor") ||
    q.includes("other plant") ||
    q.includes("infect") ||
    q.includes("transmission") ||
    q.includes("wind")
  ) {
    return `### ⚠️ Contagion & Spreading Risk for ${responseGuidance.disease}\n\n**YES, this disease can spread quickly to neighboring plants!**\n\n**How it spreads:**\n1. **Rain & Splash-Back**: Raindrops or hose water splash spores from leaf to leaf.\n2. **Wind Currents**: Dry fungal spores travel on wind currents across rows.\n3. **Tools & Hands**: Handling wet infected plants spreads pathogens directly to healthy foliage.\n\n**Protection Checklist:**\n• Immediately remove and bag infected leaves (do NOT compost).\n• Spray a preventative barrier of neem oil or copper on neighboring healthy plants.\n• Disinfect pruning shears in 70% alcohol between plants.`;
  }

  // 14. PRUNING, CUTTING & SANITATION
  if (
    q.includes("prune") ||
    q.includes("pruning") ||
    q.includes("cut") ||
    q.includes("remove") ||
    q.includes("trim") ||
    q.includes("compost") ||
    q.includes("shears")
  ) {
    return `### ✂️ Pruning & Sanitation Protocol for ${responseGuidance.crop}\n\n1. **How much to prune**: Cut off any leaf that is more than 20% spotted or yellowing. For tomatoes and peppers, strip all foliage within the bottom **12 to 18 inches** of the soil line.\n2. **Always Bag Clippings**: Drop clippings directly into a plastic garbage bag and seal it. **NEVER add diseased clippings to your compost pile**, as fungal spores survive composting.\n3. **Sanitize Your Tools**: Wipe pruning shears with rubbing alcohol or a 10% bleach solution between each plant.\n4. **Prune on Dry Days**: Prune only when foliage is bone dry to avoid opening wet plant wounds to bacterial entry.`;
  }

  // 15. ORGANIC REMEDIES & NEEM OIL
  if (
    q.includes("neem") ||
    q.includes("organic") ||
    q.includes("natural") ||
    q.includes("home remedy") ||
    q.includes("baking soda") ||
    q.includes("garlic")
  ) {
    const org = responseGuidance.remedies.organic[0];
    return `### 🌿 Organic Solutions for ${responseGuidance.disease} on ${responseGuidance.crop}\n\n**1. Golden Neem Oil Formulation**:\n• **Recipe**: 5 ml pure cold-pressed neem oil + 2 ml mild liquid soap per 1 liter of lukewarm water.\n• **How to mix**: Dissolve the soap in warm water first (acts as emulsifier), add neem oil, and shake vigorously.\n• **When to spray**: Early morning (before 8 AM) or evening (after 5 PM) to prevent leaf sunburn.\n• **Frequency**: Spray under and over leaves every 5–7 days.\n\n**2. Baking Soda Shield**:\n• Mix 1 tablespoon baking soda + 1 teaspoon vegetable oil in 1 liter water. Changes leaf surface pH, halting fungal spore germination.\n\n${org ? `**3. Recommended Bio-Control**: ${org.remedy} (${org.preparation})` : ""}`;
  }

  // 16. CHEMICAL FUNGICIDES & MEDICINES
  if (
    q.includes("chemical") ||
    q.includes("fungicide") ||
    q.includes("medicine") ||
    q.includes("pesticide") ||
    q.includes("copper") ||
    q.includes("mancozeb") ||
    q.includes("chlorothalonil") ||
    q.includes("spray")
  ) {
    if (q.includes("late blight") && !queryGuidance) {
      const crops = ["tomato", "potato"];
      const cropGuidance = crops.map((crop) => getDiseaseGuidance(crop, "Late Blight", false));
      return `### 💊 Late Blight Fungicides\n\nLate blight affects both tomatoes and potatoes. The crop matters, so confirm which one you are treating before selecting a product:\n\n${cropGuidance.map((item) => `**${item.crop}**\n${item.remedies.chemical.map((chemical) => `• ${chemical.name}: ${chemical.dosage}. ${chemical.note}`).join("\n")}`).join("\n\n")}\n\nThese are reference options, not a universal prescription. Use only products registered for your crop and location, and follow the product label for dose, protective equipment, and pre-harvest interval. If you tell me whether this is tomato or potato and your region, I can narrow the guidance.`;
    }
    return `### 💊 Commercial Treatments for ${responseGuidance.disease} on ${responseGuidance.crop}\n\nRecommended active ingredients:\n${responseGuidance.remedies.chemical.map((c) => `• **${c.name}**\n  - **Dosage**: ${c.dosage}\n  - **Note**: ${c.note}`).join("\n\n")}\n\n⚠️ **Safety Guidelines**:\n• Wear a protective mask, eye protection, and gloves.\n• Spray on calm days (wind speed < 5 km/h) to avoid spray drift.\n• Strictly adhere to the **Pre-Harvest Interval (PHI)** indicated on the product container before picking fruit.`;
  }

  // 17. DOSAGE & SPRAY FREQUENCY
  if (
    q.includes("dosage") ||
    q.includes("how much") ||
    q.includes("ratio") ||
    q.includes("how often") ||
    q.includes("frequency") ||
    q.includes("schedule") ||
    q.includes("when to spray")
  ) {
    return `### ⏱️ Spray Schedule & Exact Dosages for ${responseGuidance.crop}\n\n• **Organic Neem Oil**: 5 ml neem + 2 ml liquid soap per 1 liter water. Apply every **5 to 7 days**.\n• **Copper Oxychloride 50% WP**: 2.5 g to 3 g per liter of water. Apply every **7 to 10 days** (7-day harvest waiting period).\n• **Mancozeb 75% WP**: 2 g per liter of water. Apply at first sign of lesions; repeat every **7 days**.\n• **Best Time of Day**: Apply between **6:00 AM – 8:00 AM** or **5:00 PM – 7:00 PM**. Never spray during hot midday sun.`;
  }

  // 18. WHAT IS IT? / DISEASE EXPLANATION
  if (
    q.includes("what is") ||
    q.includes("tell me about") ||
    q.includes("explain") ||
    q.includes("definition") ||
    q.includes("information")
  ) {
    return `### 🔬 About ${responseGuidance.disease} on ${responseGuidance.crop}\n\n${responseGuidance.whatIsIt}\n\n**Severity Level**: **${responseGuidance.severity}**\n\n**Primary Root Causes**:\n${responseGuidance.rootCauses.map((rc) => `• **${rc.title}**: ${rc.detail}`).join("\n")}\n\nWould you like the organic preparation recipe, chemical spray dosage, or pruning instructions?`;
  }

  // 19. ROOT CAUSES & ENVIRONMENTAL DRIVERS
  if (
    q.includes("cause") ||
    q.includes("why") ||
    q.includes("reason") ||
    q.includes("weather") ||
    q.includes("humidity") ||
    q.includes("rain") ||
    q.includes("temperature")
  ) {
    return `### 🌧️ Root Causes for ${responseGuidance.disease} on ${responseGuidance.crop}\n\nThis condition developed due to:\n${responseGuidance.rootCauses.map((rc) => `• ${rc.icon} **${rc.title}**: ${rc.detail}`).join("\n")}\n\n**Key Insight**: Fungal and bacterial spores remain dormant until high moisture or prolonged dew occurs. Keeping leaf canopies dry is the most effective single preventative measure!`;
  }

  // 20. PREVENTION & CROP ROTATION
  if (
    q.includes("prevent") ||
    q.includes("prevention") ||
    q.includes("next season") ||
    q.includes("rotation") ||
    q.includes("future") ||
    q.includes("stop")
  ) {
    return `### 🛡️ Prevention Strategy for ${responseGuidance.crop}\n\nTo ensure your future crops stay free of **${responseGuidance.disease}**:\n${responseGuidance.prevention.map((p, idx) => `${idx + 1}. **${p.title}**: ${p.detail}`).join("\n")}\n\n**Agronomist Rule**: Practice a strict 3-year crop rotation. Never grow the same botanical family in the same plot consecutive seasons.`;
  }

  // 21. POTATO TUBERS & UNDERGROUND STORAGE
  if (
    q.includes("tuber") ||
    q.includes("underground") ||
    q.includes("potatoes underground") ||
    q.includes("seed potato")
  ) {
    return `### 🥔 Protecting Potato Tubers Underground\n\n• **Risk**: Late blight spores on foliage easily wash down through soil cracks during rainfall, infecting growing tubers with a dry reddish-brown corky rot.\n• **High Hilling**: Mound soil 4–6 inches high over rows to create a thick dirt filter that blocks spores.\n• **Vine Killing Before Harvest**: Cut or mow down all potato foliage 14 days before digging up tubers. This kills the spores so they don't contaminate tubers during harvest.`;
  }

  // 22. CORN RUST & GRAIN QUALITY
  if (q.includes("corn") || q.includes("rust") || q.includes("tasseling")) {
    return `### 🌽 Corn Rust Management & Ear Quality\n\n• **Ear Quality**: Common rust attacks foliage, not the ear itself. Corn kernels inside the husk remain clean and edible.\n• **Yield Impact**: If rust covers more than 15% of the leaf area before tasseling, ear fill will be reduced by 10%–20%.\n• **Timing Decision**: If rust appears late in the season (after grain dent or dough stage), applying fungicide is rarely cost-effective. Focus on early planting and resistant hybrids for next season.`;
  }

  // 23. DYNAMIC SYNTHESIS FOR ANY OTHER QUESTION
  return `### 🌱 Agronomist Advisory for ${activeCrop}\n\nRegarding your question on **"${question.length > 50 ? question.slice(0, 50) + "..." : question}"**:\n\n1. **Immediate Crop Action**: Inspect the foliage for active spots, insects, or yellowing. If ${activeDisease} is present, prune damaged lower leaves to reduce infection pressure.\n2. **Moisture Control**: Ensure watering is applied strictly at the soil base via drip line or can. Avoid wetting foliage.\n3. **Treatment Selection**: Apply an organic protective spray (${responseGuidance.remedies.organic[0]?.remedy || "Cold-Pressed Neem Oil"}) or approved protectant (${responseGuidance.remedies.chemical[0]?.name || "Copper Oxychloride"}).\n\nWould you like more details on organic recipes, spray schedules, or edibility of the harvest?`;
}
