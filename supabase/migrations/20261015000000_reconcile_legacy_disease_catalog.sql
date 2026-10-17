begin;

with seeds(id, category, crop, name, description, recommendation) as (
    values
        (uuid_generate_v5(uuid_ns_url(), 'verdant:avocado:root-rot'), 'Fruits', 'Avocado', 'Phytophthora root rot', 'A root disease associated with poorly drained soil, sparse foliage, small leaves, and branch dieback.', 'Improve drainage, avoid over-irrigation, use healthy nursery stock, and consult local specialists about tolerant rootstocks.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:barley:net-blotch'), 'Grains', 'Barley', 'Net blotch', 'A fungal disease causing elongated brown leaf lesions with a characteristic net-like pattern.', 'Use clean seed, rotate away from barley, manage infected residue, and select resistant cultivars.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:blueberry:mummy-berry'), 'Fruits', 'Blueberry', 'Mummy berry', 'A fungal disease that causes shoot blight and shriveled, mummified berries.', 'Remove mummified berries, mulch beneath bushes, improve airflow, and follow locally timed management advice.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:broccoli:clubroot'), 'Vegetables', 'Broccoli', 'Clubroot', 'A soilborne disease that causes swollen, misshapen roots and wilting during warm days.', 'Use clean transplants, improve drainage, rotate away from brassicas for several years, and avoid moving infested soil.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:cacao:black-pod-rot'), 'Cash crops', 'Cacao', 'Black pod rot', 'A destructive pod disease that develops as brown lesions and spreads rapidly in humid conditions.', 'Harvest diseased pods promptly, improve drainage and airflow, sanitize tools, and follow local integrated-management guidance.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:cassava:mosaic'), 'Cash crops', 'Cassava', 'Cassava mosaic disease', 'A viral disease causing leaf mosaic, distortion, and stunting, commonly spread by infected cuttings and whiteflies.', 'Plant certified healthy stems, remove infected plants early, use tolerant varieties, and control vectors using local integrated guidance.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:chili:anthracnose'), 'Vegetables', 'Chili pepper', 'Anthracnose', 'A fungal fruit rot that produces sunken dark lesions, often with concentric rings or salmon-colored spore masses.', 'Use clean seed, remove infected fruit, avoid overhead irrigation, rotate crops, and improve airflow.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:lettuce:downy-mildew'), 'Vegetables', 'Lettuce', 'Downy mildew', 'A disease causing pale angular patches on upper leaves and white growth on leaf undersides.', 'Use resistant varieties, provide spacing and airflow, irrigate early in the day, and remove crop residues.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:garlic:white-rot'), 'Vegetables', 'Garlic', 'White rot', 'A persistent soilborne disease that causes yellowing, root decay, and white fungal growth around bulbs.', 'Avoid moving soil from affected areas, use clean planting stock, clean equipment, and seek local advice before replanting.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:grape:powdery-mildew'), 'Fruits', 'Grape', 'Powdery mildew', 'A fungal disease that forms pale powdery growth on grape leaves, shoots, and berries.', 'Open the canopy to improve airflow, remove heavily affected material, and use locally registered measures according to label directions.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:kiwi:bacterial-canker'), 'Fruits', 'Kiwifruit', 'Bacterial canker', 'A bacterial disease that can cause leaf spots, cane dieback, and reddish-brown sap from pruning wounds.', 'Use certified plants, disinfect pruning tools, avoid pruning in wet weather, and follow local quarantine guidance.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:lentil:ascochyta-blight'), 'Grains', 'Lentil', 'Ascochyta blight', 'A seedborne fungal disease causing tan lesions with dark margins on leaves, stems, and pods.', 'Use clean seed, rotate crops, avoid working wet fields, and select resistant varieties where available.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:mustard:alternaria-blight'), 'Cash crops', 'Mustard', 'Alternaria blight', 'A fungal disease causing dark concentric leaf spots and lesions on stems and pods.', 'Use healthy seed, rotate crops, remove infected debris, and maintain balanced crop nutrition.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:oats:crown-rust'), 'Grains', 'Oats', 'Crown rust', 'A fungal disease producing small orange pustules on oat leaves, often late in the season.', 'Choose resistant cultivars, remove nearby buckthorn where appropriate, and monitor crop development.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:olive:olive-knot'), 'Fruits', 'Olive', 'Olive knot', 'A bacterial disease that forms rough swellings on twigs and branches, often entering through wounds.', 'Prune during dry weather, disinfect tools, protect against mechanical injury, and remove infected branches.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:peach:brown-rot'), 'Fruits', 'Peach', 'Brown rot', 'A fungal disease that blights blossoms and causes brown fruit rot with tan spore tufts.', 'Remove mummified fruit and infected twigs, prune for airflow, and handle fruit carefully to prevent wounds.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:papaya:ringspot'), 'Fruits', 'Papaya', 'Papaya ringspot', 'A viral disease causing leaf distortion, mosaic, and ring-shaped markings on fruit.', 'Remove infected plants promptly, use virus-free seedlings, manage aphids using integrated practices, and avoid planting near infected crops.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:pumpkin:powdery-mildew'), 'Vegetables', 'Pumpkin', 'Powdery mildew', 'A fungal disease that forms white powdery patches on leaves and can reduce fruit development.', 'Choose resistant varieties, space vines for airflow, remove severely affected leaves, and monitor older foliage.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:bean:anthracnose'), 'Vegetables', 'Common bean', 'Anthracnose', 'A seedborne fungal disease that causes dark, sunken lesions on stems, pods, and leaf veins.', 'Plant certified clean seed, rotate crops, avoid handling wet plants, and remove infected residues.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:peanut:early-leaf-spot'), 'Cash crops', 'Peanut', 'Early leaf spot', 'A fungal disease causing circular brown leaf spots with yellow halos and premature defoliation.', 'Rotate crops, manage volunteer plants, reduce prolonged leaf wetness, and scout lower leaves regularly.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:sunflower:downy-mildew'), 'Cash crops', 'Sunflower', 'Downy mildew', 'A systemic disease that can cause stunting, chlorosis, and white growth on leaf undersides.', 'Use resistant hybrids and treated certified seed where recommended, rotate fields, and remove volunteer sunflowers.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:sorghum:anthracnose'), 'Grains', 'Sorghum', 'Anthracnose', 'A fungal disease producing reddish or dark leaf lesions and sometimes stalk rot.', 'Grow tolerant hybrids, rotate crops, manage residue, and avoid excessive plant stress.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:millet:downy-mildew'), 'Grains', 'Pearl millet', 'Downy mildew', 'A systemic disease causing pale striped leaves, malformed heads, and reduced grain production.', 'Plant resistant varieties and healthy seed, remove infected plants early, and rotate fields.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:almond:leaf-scorch'), 'Fruits', 'Almond', 'Bacterial leaf scorch', 'A bacterial disease that causes marginal leaf browning, reduced vigor, and gradual branch decline.', 'Use healthy nursery stock, manage water stress, prune affected wood when appropriate, and consult local extension specialists.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:pineapple:heart-rot'), 'Fruits', 'Pineapple', 'Heart rot', 'A crown and root disease associated with waterlogged conditions, causing central leaf discoloration and decay.', 'Use healthy planting material, ensure well-drained beds, avoid excessive irrigation, and remove badly affected plants.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:pea:powdery-mildew'), 'Vegetables', 'Pea', 'Powdery mildew', 'A fungal disease that covers pea leaves and pods with white powdery growth, often late in the season.', 'Grow resistant cultivars, provide airflow, avoid dense planting, and remove crop residues after harvest.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:pomegranate:bacterial-blight'), 'Fruits', 'Pomegranate', 'Bacterial blight', 'A bacterial disease that produces water-soaked leaf spots, twig lesions, and cracked fruit.', 'Use clean planting material, prune infected twigs in dry weather, disinfect tools, and avoid overhead irrigation.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:sugarcane:red-rot'), 'Cash crops', 'Sugarcane', 'Red rot', 'A stalk disease that can cause internal red discoloration with pale cross-bands and crop decline.', 'Use healthy setts and resistant varieties, remove infected clumps, disinfect cutting tools, and rotate affected fields.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:tea:blister-blight'), 'Cash crops', 'Tea', 'Blister blight', 'A fungal disease that forms translucent blisters on young tea leaves and shoots in wet conditions.', 'Improve airflow through pruning, remove severely affected shoots, and follow regional tea-board guidance.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:tobacco:blue-mold'), 'Cash crops', 'Tobacco', 'Blue mold', 'A downy mildew disease causing pale yellow leaf patches and bluish-gray growth beneath leaves.', 'Use resistant varieties, improve ventilation, avoid excess leaf wetness, and follow official regional alerts.'),
        (uuid_generate_v5(uuid_ns_url(), 'verdant:strawberry:gray-mold'), 'Fruits', 'Strawberry', 'Gray mold', 'A fungal fruit rot with soft brown tissue and fuzzy gray spores, favored by humid, crowded canopies.', 'Remove rotting fruit, space plants, use drip irrigation where possible, and keep berries off wet soil.')
),
missing as (
    select seeds.*
    from seeds
    where not exists (
        select 1
        from public.diseases as existing
        where regexp_replace(lower(existing.crop), '[^a-z0-9]+', '', 'g')
            = regexp_replace(lower(seeds.crop), '[^a-z0-9]+', '', 'g')
          and regexp_replace(
                btrim(regexp_replace(
                    regexp_replace(lower(existing.name), '\s*\([^)]*\)', '', 'g'),
                    '[^a-z0-9]+', ' ', 'g'
                )),
                '^' || regexp_replace(lower(existing.crop), '[^a-z0-9]+', ' ', 'g') || ' ',
                ''
            )
            = regexp_replace(
                btrim(regexp_replace(lower(seeds.name), '[^a-z0-9]+', ' ', 'g')),
                '^' || regexp_replace(lower(seeds.crop), '[^a-z0-9]+', ' ', 'g') || ' ',
                ''
            )
    )
)
insert into public.diseases (id, category, crop, name, description, recommendation)
select id, category, crop, name, description, recommendation
from missing
on conflict (crop, name) do nothing;

commit;
