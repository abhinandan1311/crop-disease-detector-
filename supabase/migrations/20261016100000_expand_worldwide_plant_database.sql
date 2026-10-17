-- Worldwide Plant, Crop, Tree, Fruit & Vegetable Disease Database
-- Expands the database with rich causes, precautions, organic remedies, and chemical remedies.

begin;

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Ensure enhanced columns exist for detailed farmer guidance
alter table public.diseases
    add column if not exists causes text,
    add column if not exists precautions text,
    add column if not exists organic_remedies text,
    add column if not exists chemical_remedies text;

insert into public.diseases (
    id, category, crop, name, description, recommendation,
    causes, precautions, organic_remedies, chemical_remedies
)
values
    -- =========================================================================
    -- VEGETABLES
    -- =========================================================================
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:pepper:phytophthora-blight'),
        'Vegetables', 'Pepper', 'Phytophthora Blight',
        'A destructive water-mold disease that attacks peppers, causing rapid dark stem lesions near soil level, sudden wilting of the whole plant, and water-soaked rotting spots on fruits.',
        'Improve field drainage immediately, remove and burn severely wilted plants, avoid overhead watering, and apply phosphonate or mefenoxam-based treatments.',
        'Excessive standing water in soil, poor drainage, heavy rainfall, compacted soil, and temperatures between 24°C and 30°C. Spores swim through wet soil to root zones.',
        'Plant on raised beds (15–20 cm high) with plastic mulch; rotate fields with non-solanaceous crops for 3+ years; ensure drip irrigation rather than furrow/overhead flooding.',
        'Drench soil with Trichoderma harzianum or Bacillus subtilis bio-fungicides; spray copper octanoate; remove and destroy infected plant residues away from farm.',
        'Apply Mefenoxam (Ridomil Gold) or Metalaxyl-M soil drench at planting; foliar sprays of Potassium phosphite or Dimethomorph + Mancozeb according to label directions.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:pepper:bacterial-spot'),
        'Vegetables', 'Pepper', 'Bacterial Spot',
        'Bacterial infection causing small, dark, water-soaked spots on leaves that turn brown with yellow halos. Causes heavy leaf drop and blistering, scab-like spots on peppers.',
        'Prune lower leaves to reduce soil splash, apply copper bactericide mixed with mancozeb, and never work in fields when leaves are wet.',
        'Bacterium (Xanthomonas) surviving on infected seeds, crop debris, and spread by splashing rain, sprinkler irrigation, and contaminated garden tools.',
        'Always purchase certified disease-free seeds or hot-water treated seeds; practice 2-year crop rotation; avoid overhead sprinkler watering.',
        'Foliar spray with Copper Hydroxide or Copper Sulfate; spray diluted seaweed extract and bio-protectant Bacillus amyloliquefaciens.',
        'Fixed copper compounds combined with Mancozeb (to overcome copper-resistant bacterial strains); apply at 7–10 day intervals during humid weather.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:chili:anthracnose'),
        'Vegetables', 'Chili pepper', 'Anthracnose',
        'Fungal fruit rot producing sunken, circular, water-soaked spots on both green and ripe chilies. As it spreads, concentric rings with orange/salmon-colored spore masses appear.',
        'Pick and destroy affected chilies immediately, avoid working plants when wet, mulch soil to prevent splash, and apply azoxystrobin or mancozeb.',
        'Fungus (Colletotrichum) favored by high humidity (above 80%), warm temperatures (27°C), and rain splash carrying spores from infected soil or seeds.',
        'Use disease-free treated seed; maintain wide plant spacing for airflow; install drip irrigation; destroy previous season chili residues.',
        'Spray certified Neem oil (5ml/L) with mild soap; apply Trichoderma viride to root zone; spray liquid bio-copper formulations.',
        'Foliar spray of Azoxystrobin 23% SC (1ml/L) or Difenoconazole 25% EC (0.5ml/L) or Mancozeb 75% WP (2.5g/L) during flower and fruit development.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:tomato:early-blight'),
        'Vegetables', 'Tomato', 'Early Blight',
        'Common fungal disease creating brown-to-black spots with concentric rings (target-like pattern) starting on bottom older leaves, turning them yellow and causing premature leaf drop.',
        'Prune lower leaves that touch the soil, apply mulch around the base to stop dirt splash, and spray copper fungicide or chlorothalonil.',
        'Fungus (Alternaria solani) residing in old plant debris and soil, triggered by warm humid weather alternating with light showers or heavy morning dew.',
        'Mulch plants with clean straw or plastic; water only at ground level; maintain 60cm plant spacing; rotate tomatoes, potatoes, and peppers away for 2 years.',
        'Remove infected lower leaves; apply baking soda spray (1 tbsp baking soda + 1 tsp vegetable oil + 1L water); spray copper soap fungicide weekly.',
        'Apply Chlorothalonil 75% WP or Azoxystrobin or Mancozeb at first sign of target spots, repeating every 7–10 days during wet periods.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:tomato:late-blight'),
        'Vegetables', 'Tomato', 'Late Blight',
        'Aggressive water-mold disease that turns leaves into dark, greasy, water-soaked patches with white fuzzy fungal growth underneath in damp weather. Destroys entire crops within days.',
        'Act immediately: remove heavily infected plants into sealed bags (do not compost), avoid overhead watering, and spray protective systemic fungicides.',
        'Water-mold (Phytophthora infestans) that thrives in cool, cloudy, very wet or foggy weather (15°C to 22°C with high relative humidity).',
        'Plant certified resistant tomato varieties (e.g., Mountain Magic, Defiant); ensure full sun and open air; destroy volunteer potato and tomato plants nearby.',
        'Prune infected branches in dry weather; spray preventive Copper oxychloride before rain; spray bio-fungicide Bacillus subtilis.',
        'Apply systemic fungicides like Cymoxanil + Mancozeb, Dimethomorph, or Metalaxyl + Mancozeb at first alert or when local weather is cool and wet.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:tomato:septoria-leaf-spot'),
        'Vegetables', 'Tomato', 'Septoria Leaf Spot',
        'Fungal leaf spot characterized by numerous small, circular greyish spots with dark brown margins and tiny black specks in the centers on lower tomato leaves.',
        'Strip off affected bottom foliage, apply clean mulch underneath, water at the soil line, and apply protective copper or chlorothalonil sprays.',
        'Fungus (Septoria lycopersici) living on overwintered weed debris and splashed onto foliage during rainfall or overhead sprinklers.',
        'Stake and cage tomatoes to elevate vines; eliminate nightshade weeds around field edges; allow 2-year rotation.',
        'Organic copper fungicide spray; remove yellowing bottom leaves up to the first fruit cluster; mulch heavily with organic compost or straw.',
        'Chlorothalonil or Mancozeb applied every 7 to 10 days starting right after first bloom or at symptom onset.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:tomato:leaf-mold'),
        'Vegetables', 'Tomato', 'Leaf Mold',
        'Fungal disease prevalent in greenhouses and humid gardens, producing pale green-yellow patches on upper leaf surfaces and velvety olive-brown mold on undersides.',
        'Increase greenhouse ventilation, reduce humidity below 80%, prune inner canopy leaves for breeze, and apply sulfur or copper sprays.',
        'Fungus (Passalora fulva) favored by stagnant air, high relative humidity (above 85%), and temperatures between 20°C and 25°C.',
        'Ventilate tunnels and polyhouses with fans; space plants generously; use drip irrigation; plant resistant hybrid varieties.',
        'Sulfur dust or wettable sulfur spray; potassium bicarbonate organic spray; prune suckers and dense leaves to improve sunlight penetration.',
        'Copper Hydroxide, Chlorothalonil, or Boscalid sprayed thoroughly under leaf surfaces.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:tomato:mosaic-virus'),
        'Vegetables', 'Tomato', 'Mosaic Virus',
        'Viral infection causing mottled light- and dark-green leaf mosaic, distorted shoestring-like leaves, stunted plant growth, and unevenly ripened fruit.',
        'Rogue out (dig up and dispose of) infected plants immediately. Disinfect all pruners and hands in soapy water or milk solution. No chemical cure exists.',
        'Tobacco Mosaic Virus (TMV) / Tomato Mosaic Virus (ToMV), mechanically transmitted through workers’ hands, clothing, pruners, and tobacco products.',
        'Wash hands and dip tools in 20% non-fat dry milk or 10% bleach before handling plants; purchase certified mosaic-resistant seeds (marked TMV/ToMV).',
        'No direct cure; strengthen surrounding healthy plants with organic seaweed extracts and balanced organic compost.',
        'Control sap-feeding insect vectors; chemical treatments will not cure viruses; rogue infected plants to save the rest of the crop.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:tomato:yellow-leaf-curl-virus'),
        'Vegetables', 'Tomato', 'Yellow Leaf Curl Virus',
        'Devastating viral disease causing severe stunting of plants, upright cupped leaves with yellow margins, bushy growth, and failure to set fruit.',
        'Control whitefly insect populations immediately using yellow sticky traps and insecticidal sprays; pull out and dispose of infected plants.',
        'Beggmovirus transmitted by the silverleaf whitefly (Bemisia tabaci). Thrives in warm, dry climates where whiteflies multiply rapidly.',
        'Erect 50-mesh insect-proof netting in nursery/greenhouses; install yellow sticky traps (1 trap per 100 sq meters); remove weed hosts.',
        'Spray Neem oil (3–5ml/L) or pongamia oil; release natural predators like predatory mites or lacewings; apply organic insecticidal soap.',
        'Apply systemic insecticides to control whiteflies: Imidacloprid 17.8% SL (0.3ml/L) or Acetamiprid 20% SP or Spiromesifen.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:potato:late-blight'),
        'Vegetables', 'Potato', 'Late Blight',
        'Rapidly spreading blight turning potato foliage black and soggy with white downy mold underneath, causing potato tubers to rot with brown granular decay.',
        'Destroy infected vine foliage, hill up soil over potato tubers to protect them from washing spores, and spray systemic fungicides immediately.',
        'Phytophthora infestans favored by cool temperatures (12–18°C) accompanied by persistent rain, heavy dew, or foggy days.',
        'Plant only certified disease-free seed tubers; hill soil high (10–15 cm) over potato beds; harvest only in dry sunny weather.',
        'Foliar copper spray; kill and cut potato vines 2 weeks before harvesting tubers to prevent spores from touching tubers.',
        'Metalaxyl + Mancozeb (Ridomil MZ), Dimethomorph, or Cyazofamid applied at the first regional disease alert.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:potato:early-blight'),
        'Vegetables', 'Potato', 'Early Blight',
        'Fungal disease creating brown, dark concentric circular spots on older potato leaves, leading to yellowing, defoliation, and reduced tuber size.',
        'Maintain balanced nitrogen fertilization, irrigate early in the morning so leaves dry by noon, and spray protective fungicide.',
        'Alternaria solani, triggered when plants are stressed by low nitrogen, drought, insect feeding, or alternating wet and dry conditions.',
        'Maintain uniform soil moisture; avoid overhead watering late in the afternoon; rotate away from solanaceous crops for 3 years.',
        'Copper sulfate or copper soap spray; foliar organic compost tea; bio-fungicide Bacillus amyloliquefaciens.',
        'Spray Mancozeb 75% WP (2g/L) or Chlorothalonil or Azoxystrobin during the mid-bulking stage.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:onion:purple-blotch'),
        'Vegetables', 'Onion', 'Purple Blotch',
        'Fungal leaf disease producing small water-soaked lesions that enlarge into sunken purple-centered oval blotches with yellow borders on onion and shallot leaves.',
        'Avoid excessive overhead irrigation, space rows for good breeze, and apply mancozeb or difenoconazole at early leaf spotting.',
        'Fungus (Alternaria porri), favored by high humidity (80–90%) and temperatures between 21°C and 30°C with prolonged leaf wetness.',
        'Space rows at least 15–20 cm apart; use drip irrigation; avoid applying excessive nitrogen fertilizer which creates soft susceptible leaves.',
        'Spray Neem oil (5ml/L) + sticker; foliar bio-agent Trichoderma viride; remove severely blighted outer leaves.',
        'Mancozeb 75% WP (2.5g/L) or Difenoconazole 25% EC (1ml/L) or Tebuconazole mixed with a non-ionic spreader/sticker.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:garlic:white-rot'),
        'Vegetables', 'Garlic', 'White Rot',
        'Persistent soilborne fungal infection causing yellowing and dieback of garlic leaves from tips downward, with white fluffy fungal mycelium and poppy-seed black sclerotia on rotting bulbs.',
        'Remove infected garlic bulbs and surrounding soil carefully, do not replant allium crops in infected beds, and solarize the soil.',
        'Fungus (Stromatinia cepivora) whose black sclerotia can survive dormant in soil for 20+ years, activated by sulfur compounds exuded by garlic roots.',
        'Plant only certified disease-free cloves; clean tractor tires and boots before entering healthy fields; solarize soil under clear plastic for 6–8 weeks in summer.',
        'Incorporate Trichoderma harzianum bio-control agent into compost; avoid transferring infested soil or compost to other garden beds.',
        'Apply Fludioxonil or Tebuconazole clove treatment prior to planting, and furrow spray according to certified local agricultural guidelines.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:carrot:alternaria-leaf-blight'),
        'Vegetables', 'Carrot', 'Alternaria Leaf Blight',
        'Fungal foliar disease causing small, dark-brown to black spots with yellow margins on carrot leaf edges, causing feathery carrot tops to shrivel and die.',
        'Thin carrot seedlings for airflow, irrigate in the early morning, and apply protective organic or chemical fungicides if spots appear.',
        'Fungus (Alternaria dauci) carried on infected seed or surviving in carrot residue, flourishing during warm wet summer weather.',
        'Use certified disease-free or hot-water treated seeds; space carrot rows 25–30 cm apart; practice 3-year crop rotation.',
        'Spray copper hydroxide; apply horsetail plant extract; remove volunteer wild carrots and umbelliferous weeds.',
        'Foliar spray of Chlorothalonil, Pyraclostrobin, or Azoxystrobin when disease symptoms first appear on 1–2% of the leaf canopy.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:cabbage:black-rot'),
        'Vegetables', 'Cabbage', 'Black Rot',
        'Bacterial disease marked by distinctive V-shaped yellow lesions extending from leaf margins with blackened leaf veins, turning heads foul and unmarketable.',
        'Use certified disease-free seeds, sanitize knives between cuts, avoid overhead sprinkler irrigation, and rotate fields away from brassicas for 3 years.',
        'Bacterium (Xanthomonas campestris pv. campestris) entering leaf edges through hydathodes (natural water pores) during warm, humid rainy spells.',
        'Hot-water treat seeds (50°C for 25 minutes); sanitize transplant trays; control cabbage flea beetles and caterpillar pests that create entry wounds.',
        'Spray Copper Oxychloride; apply bio-bactericide Bacillus subtilis; pull out and burn infected heads.',
        'Copper-based bactericides combined with Mancozeb applied every 7–10 days during rainy weather to protect undamaged foliage.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:cucumber:downy-mildew'),
        'Vegetables', 'Cucumber', 'Downy Mildew',
        'Aggressive foliage disease showing sharp angular yellow patches on the upper leaf surface bounded by veins, with purplish-gray downy mold on the underside.',
        'Water only the base of plants, trellis vines vertically for air circulation, and spray systemic downy mildew fungicides before rain.',
        'Pseudoperonospora cubensis, a water-mold carried on wind currents from southern regions, triggered by humid nights and leaf wetness.',
        'Grow trellis-trained cucumber vines; use resistant hybrids (e.g., SV3462CS, Bristol); plant early to harvest before peak spore arrival.',
        'Spray Copper Octanoate; apply potassium bicarbonate or neem formulations; remove yellowing lower leaves.',
        'Foliar spray of Fluopicolide, Cyazofamid, or Propamocarb hydrochloride alternating with Chlorothalonil to prevent resistance.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:cucumber:powdery-mildew'),
        'Vegetables', 'Cucumber', 'Powdery Mildew',
        'Fungal disease coating cucumber leaves, petioles, and stems with white talcum-like powdery spots, causing leaves to turn brown, brittle, and dry up.',
        'Spray with diluted milk spray or potassium bicarbonate at first sign of white powder, thin excess leaves, and plant resistant cultivars.',
        'Fungi (Podosphaera xanthii / Erysiphe cichoracearum) thriving in warm, dry weather with high relative humidity and shade.',
        'Ensure full sunshine (6+ hours); avoid crowding plants; plant powdery mildew-resistant cucumber varieties.',
        'Spray diluted cow milk (1 part milk : 9 parts water) in sunlight; spray Potassium Bicarbonate (3g/L) with mild organic soap; spray horticultural oils.',
        'Apply Myclobutanil, Azoxystrobin, or Trifloxystrobin at early disease onset; rotate chemical modes of action.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:eggplant:bacterial-wilt'),
        'Vegetables', 'Eggplant', 'Bacterial Wilt',
        'Soilborne vascular disease causing sudden, rapid wilting of eggplant branches during the heat of the day while leaves remain green, followed by total plant collapse.',
        'Uproot and destroy wilted eggplants with their root ball, avoid moving soil from affected zones, and graft onto wild resistant rootstocks.',
        'Ralstonia solanacearum bacteria that enter through root wounds and plug the water-conducting xylem vessels in hot, wet soils.',
        'Graft onto resistant wild eggplant rootstocks (e.g., Solanum torvum); rotate with corn, rice, or sorghum for 3–4 seasons; raise bed soil pH to 6.5–7.0.',
        'Incorporate mustard green manure or bio-fumigant neem cake into soil before planting; apply bio-agent Pseudomonas fluorescens.',
        'No effective chemical cure once vascular system is clogged. Treat transplant roots with Streptomycin sulfate before setting into field.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:okra:yellow-vein-mosaic'),
        'Vegetables', 'Okra', 'Yellow Vein Mosaic',
        'Devastating viral disease causing bright yellow vein clearing and network chlorosis on okra leaves, stunted plants, and pale, fibrous, small pods.',
        'Eradicate whiteflies with sticky traps and insecticidal sprays; rogue out diseased plants immediately; plant resistant varieties.',
        'Bhendi Yellow Vein Mosaic Virus (BYVMV), transmitted by whiteflies (Bemisia tabaci).',
        'Plant resistant okra hybrids (e.g., Arka Anamika, Parbhani Kranti); install yellow sticky traps (10 traps/acre); clear weed hosts like Malvastrum.',
        'Spray Neem oil (5ml/L) weekly; spray bio-pesticide Verticillium lecanii to parasitize whitefly nymphs.',
        'Spray Thiamethoxam 25% WG (0.3g/L) or Dimethoate 30% EC (1.5ml/L) to control the whitefly vector population.'
    ),

    -- =========================================================================
    -- FRUITS
    -- =========================================================================
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:apple:apple-scab'),
        'Fruits', 'Apple', 'Apple Scab',
        'Fungal disease producing velvety olive-green to dark brown circular scabby spots on apple leaves and corky, cracked scabs on developing fruit.',
        'Rake and compost or shred fallen orchard leaves in autumn, prune tree canopy for sun and air, and apply protective fungicides from bud break.',
        'Venturia inaequalis fungus that overwinters in dead leaves on the orchard floor, releasing millions of ascospores during spring rainstorms.',
        'Rake and destroy fallen leaves or spray them with 5% urea to accelerate leaf breakdown; prune trees to open centers; choose scab-resistant varieties (Liberty, Honeycrisp).',
        'Spray Lime Sulfur or Liquid Copper during dormant and green-tip stages; spray Potassium Bicarbonate during active growing season.',
        'Apply Captan 50% WP, Mancozeb, or Difenoconazole from green tip through petal fall, timed with rain events.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:apple:cedar-apple-rust'),
        'Fruits', 'Apple', 'Cedar Apple Rust',
        'Fungal rust disease creating bright yellow-orange spots with tiny black dots on apple leaves, causing defoliation and blemished fruit.',
        'Remove eastern red cedar / juniper trees within 500 meters of orchard if possible, and spray fungicides during pink bud through petal fall.',
        'Gymnosporangium juniperi-virginianae, a fungus requiring both apple trees and juniper/cedar trees to complete its life cycle.',
        'Prune and destroy gelatinous orange rust galls from nearby juniper trees in winter; plant rust-resistant apple varieties (e.g., Enterprise, Redfree).',
        'Foliar spray with wettable sulfur or copper soap starting at bud break until 30 days after bloom.',
        'Apply Myclobutanil 20% EW or Mancozeb or Propiconazole starting at pink-bud stage and repeated every 10–14 days through bloom.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:apple:fire-blight'),
        'Fruits', 'Apple', 'Fire Blight',
        'Destructive bacterial disease causing blossoms, shoots, and twigs to suddenly wilt, turn black or dark brown as if scorched by fire, forming a hooked shepherd’s crook shape.',
        'Prune infected branches at least 30 cm below visible damage during dry winter weather, disinfect pruners in 70% alcohol between cuts, and apply streptomycin during bloom.',
        'Erwinia amylovora bacterium spread by bees, rain splash, and wind, entering open blossoms during warm (18–29°C), humid spring weather.',
        'Avoid high-nitrogen fertilizers that generate tender succulent shoots; plant fire blight-resistant rootstocks (e.g., Geneva series); monitor bloom heat units.',
        'Apply Fixed Copper spray at silver-tip dormant stage; spray bio-competitor Bacillus subtilis or Aureobasidium pullulans onto open blooms.',
        'Spray Agricultural Streptomycin Sulfate or Kasugamycin during open bloom when predictive models warn of infection risk.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:banana:black-sigatoka'),
        'Fruits', 'Banana', 'Black Sigatoka',
        'Foliar fungal disease that starts as small reddish-brown leaf streaks that enlarge into dark black necrotic spots with gray centers, causing leaves to collapse and reducing bunch weight.',
        'De-leaf severely infected leaves weekly, improve plantation drainage, maintain wide spacing, and apply mineral oil combined with fungicides.',
        'Pseudocercospora fijiensis fungus whose wind-blown ascospores and rain-splashed conidia thrive in warm, tropical, high-rainfall environments.',
        'Regularly de-leaf infected foliage and place it face-down on soil to rot; ensure field drainage ditches are clear; plant resistant hybrids (e.g., FHIA varieties).',
        'Spray agricultural paraffin oil emulsions; spray copper hydroxide; apply bio-agent Bacillus amyloliquefaciens.',
        'Rotate systemic fungicides: Difenoconazole, Azoxystrobin, and Tridemorph mixed with agricultural mineral oil to prevent chemical resistance.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:banana:panama-disease'),
        'Fruits', 'Banana', 'Panama Disease (Fusarium Wilt)',
        'Lethal soilborne fungus causing yellowing of lower leaf margins, vascular browning inside the pseudostem, and wilting and collapse of banana mats.',
        'Quarantine affected mats, avoid moving planting material or soil from infected plantations, and transition to resistant banana varieties.',
        'Fusarium oxysporum f. sp. cubense (especially Tropical Race 4 - TR4) which invades roots and blocks xylem water vessels indefinitely in soil.',
        'Strict biosecurity: wash boots and machinery before entering clean groves; use certified tissue-culture plantlets; do not use river water from infested valleys.',
        'Incorporate large amounts of organic compost and Trichoderma bio-fungicide around clean mats; improve soil microbial diversity.',
        'No chemical cure exists for infected plants. Eradicate infected mats with herbicide injection and seal the infected area.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:mango:anthracnose'),
        'Fruits', 'Mango', 'Anthracnose',
        'Fungal disease producing dark leaf spots, blossom blight that turns flowers black and shriveled, and sunken black tear-stain lesions on mango fruits.',
        'Prune dead branches after harvest to open tree canopy, spray protective copper or carbendazim from flowering to fruit set, and dip harvested fruit in hot water.',
        'Colletotrichum gloeosporioides fungus thriving during foggy mornings, unseasonal rain, and heavy dew during flower panicle emergence.',
        'Prune inner criss-crossing branches to let sunlight reach tree center; spray trees after post-harvest pruning; avoid overhead sprinklers during flowering.',
        'Spray Copper Oxychloride 50% WP (3g/L); apply Pseudomonas fluorescens liquid bio-formulation onto flower panicles.',
        'Spray Azoxystrobin 23% SC (1ml/L) or Carbendazim 50% WP (1g/L) or Difenoconazole at flower bud opening, full bloom, and fruit-set stages.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:orange:citrus-greening'),
        'Fruits', 'Orange', 'Citrus Greening (Huanglongbing)',
        'Devastating bacterial disease causing asymmetrical mottled yellowing on leaves, yellow shoots, hard, lopsided green fruit with bitter juice, and tree decline.',
        'Eradicate Asian citrus psyllid insects immediately, remove confirmed diseased trees to protect healthy groves, and buy only certified disease-free nursery trees.',
        'Candidatus Liberibacter asiaticus bacterium transmitted by Asian citrus psyllids (Diaphorina citri) and infected budwood grafting.',
        'Control psyllids year-round; use insect-proof screenhouses for all new citrus nursery stock; survey groves monthly for yellow shoots.',
        'Spray Horticultural mineral oils or Neem oil (2%) to deter psyllid feeding; supplement tree nutrition with foliar zinc, iron, and manganese micronutrients.',
        'Apply systemic insecticides for psyllid control: Imidacloprid soil drench in young trees, Thiamethoxam, or Fenpropathrin foliar sprays.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:orange:citrus-canker'),
        'Fruits', 'Orange', 'Citrus Canker',
        'Bacterial infection producing raised, corky, crater-like brown lesions surrounded by bright oily yellow halos on leaves, twigs, and citrus rinds.',
        'Prune diseased twigs in dry weather, install windbreaks around citrus groves, and apply preventive copper sprays when new flush leaves appear.',
        'Xanthomonas citri bacterium driven into stomata and leaf wounds by wind-driven rain and citrus leafminer insect tunnels.',
        'Erect windbreak trees around groves to slow wind velocity below 18 mph; control citrus leafminers; sanitize harvesting clippers.',
        'Spray Copper Hydroxide or Copper Sulfate Pentahydrate; apply bio-control Bacillus subtilis formulations on young flushes.',
        'Apply fixed copper bactericides at 3-week intervals during the major spring and summer leaf-flush periods.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:grape:black-rot'),
        'Fruits', 'Grape', 'Black Rot',
        'Fungal disease producing small brown circular leaf spots with dark borders and converting plump grape berries into shriveled, hard, black mummies hanging on the vine.',
        'Prune and discard all dried mummified grape clusters during winter, train vines for air circulation, and spray protective fungicides from early spring.',
        'Guignardia bidwellii fungus overwintering on mummified berries and canes, releasing spores in warm rainy weather (20–27°C).',
        'Meticulously drop and remove all mummies from vineyard floor and trellis during winter pruning; tuck grape shoots into trellis for ventilation.',
        'Spray Wettable Sulfur or Liquid Copper from bud swell through bloom; apply compost mulch over vineyard rows.',
        'Apply Myclobutanil 40% WDG, Mancozeb, or Captan starting at 10-cm shoot growth and continue at 10–14 day intervals until berries begin veraison.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:peach:peach-leaf-curl'),
        'Fruits', 'Peach', 'Peach Leaf Curl',
        'Fungal disease that causes newly emerged peach and nectarine leaves in spring to become thickened, puckered, curled, and reddish-pink, eventually dropping prematurely.',
        'Apply a single thorough dormant copper or chlorothalonil spray before tree buds swell in late winter. Once leaves unfurl, sprays are ineffective.',
        'Taphrina deformans fungus overwintering on bark scales and bud surfaces, infecting buds during cool, wet winter-spring transition (below 16°C).',
        'Plant resistant peach cultivars (e.g., Frost, Avalon Pride, Muir); shelter small trees under plastic eaves from winter rain.',
        'Spray Liquid Copper or Lime Sulfur thoroughly over all branches and trunk in late winter just before bud break (dormancy).',
        'Apply Chlorothalonil 720 SC or Copper Hydroxide in late autumn after leaf drop, or early spring before bud swell.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:strawberry:gray-mold'),
        'Fruits', 'Strawberry', 'Gray Mold (Botrytis)',
        'Destructive fruit rot turning ripe and unripe strawberries into soft, water-soaked brown mush covered in a dense velvety layer of gray fuzzy spores.',
        'Mulch beds with dry straw or plastic to keep berries off wet soil, pick ripe fruit promptly, remove infected berries, and ensure wide spacing.',
        'Botrytis cinerea fungus favored by cool, cloudy, wet weather and stagnant humid canopies, often entering through dying flower petals.',
        'Use drip irrigation under plastic mulch; space plants 30 cm apart; remove decaying leaves and rotten berries from the field immediately.',
        'Spray bio-fungicide Bacillus subtilis or Aureobasidium pullulans; spray Potassium Bicarbonate onto flowers.',
        'Apply Cyprodinil + Fludioxonil (Switch), Fenhexamid, or Boscalid during the 10% and full-bloom flower stages.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:papaya:ringspot'),
        'Fruits', 'Papaya', 'Papaya Ringspot',
        'Viral disease causing yellow mosaic and blistering of leaves, shoestring distortion of young leaves, dark oily rings on fruit, and severe tree stunting.',
        'Chop down and destroy infected trees immediately to prevent viral spread to the rest of the orchard; plant certified PRSV-resistant GMO/hybrid papaya.',
        'Papaya Ringspot Virus (PRSV), transmitted non-persistently by aphids (such as Aphis gossypii) moving through the orchard.',
        'Plant genetically resistant papaya varieties (e.g., Rainbow, SunUp); surround papaya groves with corn or sorghum barrier crops that trap aphids.',
        'Spray insecticidal neem soap on underside of leaves; eradicate weed hosts like Cucurbita species nearby.',
        'No chemical cure for the virus. Spray mineral oil emulsions or insecticides to reduce transient aphid vector populations.'
    ),

    -- =========================================================================
    -- TREES & PLANTATION CROPS
    -- =========================================================================
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:coffee:leaf-rust'),
        'Cash crops', 'Coffee', 'Coffee Leaf Rust',
        'Foliar fungal disease producing bright yellow-orange powdery pustules on coffee leaf undersides, causing massive leaf drop, dieback, and crop loss.',
        'Prune shade trees to allow morning sun, prune dead wood, maintain balanced nutrition, and apply copper oxychloride before the start of the rainy season.',
        'Hemileia vastatrix fungus whose spores require liquid water droplets and temperatures between 21°C and 25°C to germinate.',
        'Regulate shade canopy to 35–45% shade; plant rust-resistant coffee cultivars (e.g., Castillo, Catimor, Ruiru 11); maintain high soil potassium.',
        'Foliar spray with Copper Oxychloride 50% WP (3–4g/L) or Bordeaux mixture (1%) just before the onset of monsoon/rainy season.',
        'Apply systemic fungicides like Cyproconazole, Epoxiconazole, or Pyraclostrobin during active vegetative flush and initial rust appearance.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:tea:blister-blight'),
        'Cash crops', 'Tea', 'Blister Blight',
        'Fungal disease of tea bushes that forms circular translucent blister-like spots on tender young leaves and buds, curling shoots and ruining harvest.',
        'Prune tea bushes for aeration, shear infected shoots in cloudy wet periods, and spray copper oxychloride every 5–7 days during rainy monsoons.',
        'Exobasidium vexans fungus attacking only tender young harvestable tea flushes during prolonged cloudy, misty, high-rainfall weather.',
        'Regulate tea shade tree foliage; shear bushes regularly; orient tea rows along prevailing slope breeze.',
        'Spray Copper Oxychloride 50% WP (2g/L); apply bio-formulation Trichoderma harzianum; avoid plucking leaves during peak spore hours.',
        'Apply Hexaconazole 5% EC (200ml/ha) or Propiconazole 25% EC mixed with Copper Oxychloride during peak monsoon weather.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:cacao:black-pod-rot'),
        'Cash crops', 'Cacao', 'Black Pod Rot',
        'Destructive pod rot forming rapidly spreading dark brown to black lesions on cocoa pods, accompanied by white mold and rotten beans inside.',
        'Harvest ripe and diseased pods every week, prune cocoa trees to improve light and airflow, clear moss and weeds, and apply copper fungicides.',
        'Phytophthora palmivora and Phytophthora megakarya, water-molds spread by rain splash, ants, flying insects, and dirty harvesting knives.',
        'Prune cocoa canopy to let sunlight reach lower trunk; maintain clean weed-free undergrowth; bury diseased pods beneath leaf mulch with lime.',
        'Spray Bordeaux mixture (1%) or Copper Hydroxide; apply biocontrol agent Trichoderma martiale onto pod cushions.',
        'Apply Metalaxyl + Copper Oxide or Dimethomorph systemic pod sprays during high-rainfall pod development months.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:rubber:south-american-blight'),
        'Cash crops', 'Rubber Tree', 'South American Leaf Blight',
        'Devastating fungal disease causing young rubber tree leaves to curl, blister, and turn brown, followed by severe defoliation and tree death.',
        'Prune severely infected branches, avoid transporting budwood from affected zones, and apply protectant fungicides during annual winter refoliation.',
        'Pseudocercospora ulei fungus infecting newly emerged tender rubber leaves during warm, rain-saturated periods.',
        'Strict international phytosanitary quarantine; plant crown-budded resistant clones (e.g., FX 3864); synchronize leaf change periods.',
        'Thermal fogging with copper fungicides; application of bio-control hyperparasitic fungi.',
        'Aerial or ground-based spray of Mancozeb, Thiophanate-methyl, or Triadimefon during the refoliation period when new shoots emerge.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:coconut:bud-rot'),
        'Cash crops', 'Coconut', 'Bud Rot',
        'Fatal disease causing yellowing and drooping of the central spear leaf, heart rot of the crown terminal bud with a foul smell, and death of the palm.',
        'Cut and burn the infected central spindle immediately, treat neighboring palm crowns with Bordeaux paste or metalaxyl, and improve plantation drainage.',
        'Phytophthora palmivora water-mold entering crown during continuous monsoon rains and cool humid conditions.',
        'Clean palm crowns before monsoon; remove old spathes and dry leaves; avoid injury to crown tissues when harvesting coconuts.',
        'Apply Bordeaux paste (10%) to the crown base; place perforated sachets of Mancozeb + sand in the leaf axils for slow rain release.',
        'Inject or drench crown with Potassium Phosphite or Metalaxyl-M (2g/L) in neighboring palms as preventive prophylactic treatment.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:olive:olive-knot'),
        'Fruits', 'Olive', 'Olive Knot',
        'Bacterial disease causing rough, gall-like swellings (knots) on olive twigs, branches, and trunks, leading to limb girdling, defoliation, and reduced olive yield.',
        'Prune off infected knots during dry sunny summer weather, sanitize saws in 70% ethanol, and apply copper spray after hail, frost, or harvesting wounds.',
        'Pseudomonas savastanoi pv. savastanoi bacteria entering through pruning cuts, freeze cracks, hail injuries, and mechanical harvesting wounds.',
        'Never prune in wet rainy weather; avoid mechanical tree shakers that tear bark; purchase certified disease-free nursery trees.',
        'Spray Copper Hydroxide or Bordeaux mixture immediately following hail storms, severe freeze events, or leaf-fall.',
        'Fixed copper sprays applied in autumn and late winter to shield open leaf scars from bacterial colonization.'
    ),

    -- =========================================================================
    -- GRAINS & CEREALS
    -- =========================================================================
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:rice:rice-blast'),
        'Grains', 'Rice', 'Rice Blast',
        'Destructive fungal disease producing diamond/spindle-shaped lesions with gray-white centers and brown borders on rice leaves, neck rot, and empty grain panicles.',
        'Avoid excessive chemical nitrogen fertilizer, maintain consistent field flood water levels, and spray tricyclazole at early leaf blast or boot stage.',
        'Magnaporthe oryzae fungus favored by excess nitrogen fertilizer, high relative humidity (above 90%), prolonged leaf wetness, and cool night temperatures.',
        'Use balanced N-P-K fertilizer (split nitrogen into 3 doses); grow blast-resistant rice cultivars; avoid water stress/drought during vegetative growth.',
        'Seed treatment with Pseudomonas fluorescens (10g/kg seed); foliar spray of botanical neem extracts or compost extracts.',
        'Spray Tricyclazole 75% WP (0.6g/L) or Isoprothiolane 40% EC (1.5ml/L) or Azoxystrobin at early tillering and panicle emergence stages.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:rice:bacterial-leaf-blight'),
        'Grains', 'Rice', 'Bacterial Leaf Blight',
        'Bacterial disease showing water-soaked stripes from leaf margins that enlarge into wavy yellow-white lesions, causing drying of leaves and poor grain filling.',
        'Drain field water temporarily, avoid top-dressing with nitrogen fertilizer during outbreak, and spray copper hydroxide + plantomycin.',
        'Xanthomonas oryzae pv. oryzae bacteria spread through irrigation water, strong windy storms, and contaminated seeds.',
        'Plant resistant rice cultivars; avoid clipping seedling leaf tips before transplanting; avoid deep flooding of seedbeds; clean irrigation channels.',
        'Seed soak in Streptocycline solution; spray fresh cow dung extract (20g/L filtered) or bio-agent Pseudomonas fluorescens.',
        'Spray Copper Oxychloride 50% WP (2.5g/L) mixed with Streptomycin Sulfate + Tetracycline (100 ppm) at first sign of bacterial blight.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:wheat:stripe-rust'),
        'Grains', 'Wheat', 'Stripe Rust (Yellow Rust)',
        'Fungal rust producing bright yellow-orange pustules arranged in long linear stripes along wheat leaf veins, causing stunted plants and shriveled grains.',
        'Scout fields early in cool damp weather, plant rust-resistant wheat varieties, and apply triazole fungicides at first detection of yellow stripes.',
        'Puccinia striiformis f. sp. tritici fungus whose spores are blown long distances by wind, favored by cool temperatures (2–15°C) and heavy dew.',
        'Plant recommended regional stripe rust-resistant wheat cultivars; avoid excessively early sowing; eradicate volunteer wheat grass hosts.',
        'Foliar spray with bio-fungicide Bacillus subtilis; foliar nutrition with potassium and zinc to enhance natural plant defense.',
        'Foliar spray of Propiconazole 25% EC (1ml/L) or Tebuconazole 250 EC (1ml/L) at flag-leaf emergence or upon first yellow stripe sighting.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:wheat:fusarium-head-blight'),
        'Grains', 'Wheat', 'Fusarium Head Blight',
        'Fungal disease causing bleached, straw-colored spikelets on green wheat heads, often with salmon-pink fungal spores, producing shriveled tombstone kernels with mycotoxins.',
        'Avoid planting wheat immediately after corn/maize in the same field, and apply triazole fungicides during early wheat flowering.',
        'Fusarium graminearum fungus overwintering on corn and small grain residue, thriving in warm humid rainy conditions during wheat flowering/anthesis.',
        'Do not plant wheat in zero-till corn residue; rotate with broadleaf crops (soybeans, pulses); choose moderately resistant wheat varieties.',
        'Spray bio-control agent Trichoderma or Bacillus species during early flowering window.',
        'Apply Prothioconazole + Tebuconazole (Prosaro) or Metconazole precisely at Feekes 10.5.1 (early flowering stage when yellow anthers show).'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:corn:common-rust'),
        'Grains', 'Corn', 'Common Rust',
        'Fungal disease creating small, scattered, powdery reddish-brown pustules on both upper and lower corn leaf surfaces, causing premature drying of leaves.',
        'Plant rust-resistant corn hybrids, monitor lower leaves in cool damp weather, and apply fungicides if pustules spread before silking.',
        'Puccinia sorghi fungus whose windborne spores travel from southern regions, thriving in temperatures of 16–25°C and relative humidity above 95%.',
        'Select certified resistant corn hybrids (marked Rp-resistant); plant early in the season; maintain balanced soil fertility.',
        'Foliar spray with liquid copper or neem oil; maintain adequate potassium nutrition to thicken corn leaf cell walls.',
        'Foliar spray of Pyraclostrobin, Azoxystrobin, or Propiconazole if rust pustules are active on upper leaves prior to tassel emergence.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:corn:northern-leaf-blight'),
        'Grains', 'Corn', 'Northern Leaf Blight',
        'Fungal disease producing large, cigar-shaped, grayish-green to tan lesions (2.5 to 15 cm long) on corn leaves, causing extensive photosynthetic loss.',
        'Rotate with non-grass crops, incorporate corn residue with tillage, and spray strobilurin/triazole fungicides at tassel stage if disease is present.',
        'Exserohilum turcicum fungus surviving in unburied corn residue, favored by moderate temperatures (18–27°C) and long periods of leaf wetness.',
        'Plant hybrid corn with Ht resistance genes; practice 2-year crop rotation with soybeans; deep-till corn stalks to speed up decomposition.',
        'Bio-fungicide application; spray potassium silicate to reinforce leaf cuticle.',
        'Foliar spray of Azoxystrobin + Difenoconazole or Pyraclostrobin + Fluxapyroxad when lesions appear on the third leaf below the ear before tasseling.'
    ),

    -- =========================================================================
    -- CASH CROPS, FIBER & OILSEEDS
    -- =========================================================================
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:cotton:bacterial-blight'),
        'Cash crops', 'Cotton', 'Bacterial Blight',
        'Bacterial infection causing angular water-soaked leaf spots bounded by veins, blackened leaf veins (blackarm), and sunken water-soaked rot on cotton bolls.',
        'Use acid-delinted certified disease-free seed, avoid overhead sprinkler irrigation, shred cotton stalks after harvest, and apply copper bactericides.',
        'Xanthomonas citri pv. malvacearum bacteria carried on cotton fuzzy seed coat and spread by wind-blown rain and contaminated machinery.',
        'Plant certified acid-delinted seed with B-gene resistance; practice clean post-harvest tillage; avoid moving cultivators through wet fields.',
        'Seed treatment with Pseudomonas fluorescens; foliar spray of copper oxychloride (2g/L).',
        'Spray Copper Oxychloride 50% WP (2.5g/L) mixed with Streptocycline (100 ppm) at initial leaf spot detection.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:soybean:soybean-rust'),
        'Cash crops', 'Soybean', 'Soybean Rust',
        'Fast-spreading fungal rust producing tiny tan-to-reddish brown pustules on soybean leaf undersides, causing massive yellowing, defoliation, and aborted pods.',
        'Scout bottom canopy leaves regularly, plant early-maturing varieties, and apply protective fungicides at R1 (flowering) or R3 (pod development).',
        'Phakopsora pachyrhizi fungus spread over long distances by storm winds, thriving in warm humid climates with 6–8 hours of leaf wetness.',
        'Plant early-maturing soybean varieties to escape late-season spore showers; scout lower canopy leaves weekly; eliminate kudzu weed hosts nearby.',
        'Spray sulfur dust or bio-fungicide Bacillus amyloliquefaciens prior to canopy closure.',
        'Apply Triazole or Strobilurin fungicides (e.g., Tebuconazole, Azoxystrobin, or Picoxystrobin) preventively at flowering/early pod set.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:sugarcane:red-rot'),
        'Cash crops', 'Sugarcane', 'Red Rot',
        'Destructive stalk fungal disease causing third and fourth leaves to wither and dry from margins inward, reddish internal stalk discoloration with white cross-patches, and alcohol odor.',
        'Uproot and burn diseased sugarcane clumps, use certified disease-free seed setts, treat setts in hot water, and rotate fields with rice or green manure.',
        'Colletotrichum falcatum fungus surviving in infected seed canes, soil, and diseased plant stubble, spreading through flood and irrigation water.',
        'Hot water treat seed setts (50°C for 2 hours); plant certified red-rot resistant cane varieties (e.g., Co 0238, Co 86032); ensure excellent field drainage.',
        'Soak setts in Trichoderma harzianum spore suspension (10g/L) before planting; incorporate bio-enriched compost.',
        'Dip seed setts in Carbendazim 50% WP (1g/L) solution for 15 minutes before planting; no effective cure exists once internal stalk is red.'
    ),
    (
        uuid_generate_v5(uuid_ns_url(), 'verdant:peanut:early-leaf-spot'),
        'Cash crops', 'Peanut', 'Early Leaf Spot',
        'Fungal disease producing small brown circular spots with bright yellow halos on peanut leaves, leading to severe leaf shedding and poor pod filling.',
        'Rotate peanut fields with grasses or corn, avoid prolonged leaf wetness, and apply chlorothalonil or tebuconazole starting 30–40 days after emergence.',
        'Passalora arachidicola fungus overwintering on previous peanut crop residue, triggered by warm temperatures (24–28°C) and heavy humidity.',
        'Rotate crops for at least 2 seasons away from legumes; bury crop residue completely with moldboard plow; avoid overhead sprinkler watering.',
        'Spray Neem seed kernel extract (5%); apply Trichoderma viride bio-spray; space rows for air circulation.',
        'Spray Chlorothalonil 75% WP (2g/L) or Tebuconazole 25.9% EC (1ml/L) or Mancozeb every 14 days starting at 35 days after sowing.'
    )

on conflict (crop, name) do update set
    category = excluded.category,
    description = excluded.description,
    recommendation = excluded.recommendation,
    causes = excluded.causes,
    precautions = excluded.precautions,
    organic_remedies = excluded.organic_remedies,
    chemical_remedies = excluded.chemical_remedies;

commit;
