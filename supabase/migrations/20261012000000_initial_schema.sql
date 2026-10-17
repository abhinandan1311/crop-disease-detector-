begin;

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

create table if not exists public.diseases (
    id uuid primary key default uuid_generate_v4(),
    category text not null,
    crop text not null,
    name text not null,
    description text not null,
    recommendation text not null,
    created_at timestamptz not null default now(),
    constraint diseases_crop_name_key unique (crop, name)
);

alter table public.diseases
    add column if not exists category text not null default 'General';

do $$
declare
    current_id_type text;
begin
    select data_type
      into current_id_type
      from information_schema.columns
     where table_schema = 'public'
       and table_name = 'diseases'
       and column_name = 'id';

    if current_id_type is distinct from 'uuid' then
        alter table public.diseases
            alter column id type uuid
            using case
                when id::text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
                    then id::text::uuid
                else uuid_generate_v5(uuid_ns_url(), 'verdant:legacy-disease:' || id::text)
            end;
    end if;
end
$$;

alter table public.diseases
    alter column id set default uuid_generate_v4();

create table if not exists public.scans (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    image_path text not null,
    crop text not null,
    disease text not null,
    confidence double precision not null check (confidence >= 0 and confidence <= 1),
    is_healthy boolean not null default false,
    top_candidates jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now(),
    constraint scans_image_path_user_prefix check (
        split_part(image_path, '/', 1) = user_id::text
    )
);

create table if not exists public.feedback (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    scan_id uuid references public.scans(id) on delete set null,
    image_id text,
    predicted_disease text not null,
    corrected_disease text not null,
    agronomist_notes text,
    created_at timestamptz not null default now(),
    constraint feedback_requires_scan_or_image check (
        scan_id is not null or image_id is not null
    )
);

alter table public.feedback
    drop constraint if exists feedback_scan_id_fkey;
alter table public.feedback
    add constraint feedback_scan_id_fkey
    foreign key (scan_id) references public.scans(id) on delete cascade;

create index if not exists diseases_category_crop_name_idx
    on public.diseases (category, crop, name);
create index if not exists scans_user_created_at_idx
    on public.scans (user_id, created_at desc);
create index if not exists scans_created_at_idx
    on public.scans (created_at desc);
create index if not exists scans_crop_disease_idx
    on public.scans (crop, disease);
create index if not exists feedback_user_created_at_idx
    on public.feedback (user_id, created_at desc);
create index if not exists feedback_scan_id_idx
    on public.feedback (scan_id);

alter table public.diseases enable row level security;
alter table public.scans enable row level security;
alter table public.feedback enable row level security;

revoke all privileges on table public.diseases, public.scans, public.feedback
    from public, anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.diseases to anon, authenticated;
grant select, insert, delete on public.scans to authenticated;
grant select, insert on public.feedback to authenticated;

drop policy if exists "Disease information is readable by everyone"
    on public.diseases;
create policy "Disease information is readable by everyone"
    on public.diseases for select
    to anon, authenticated
    using (true);

drop policy if exists "Users can read their own scans" on public.scans;
create policy "Users can read their own scans"
    on public.scans for select
    to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own scans" on public.scans;
create policy "Users can create their own scans"
    on public.scans for insert
    to authenticated
    with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own scans" on public.scans;
create policy "Users can delete their own scans"
    on public.scans for delete
    to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists "Users can read their own feedback" on public.feedback;
create policy "Users can read their own feedback"
    on public.feedback for select
    to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own feedback" on public.feedback;
create policy "Users can create their own feedback"
    on public.feedback for insert
    to authenticated
    with check (
        (select auth.uid()) = user_id
        and (
            scan_id is null
            or exists (
                select 1
                from public.scans
                where scans.id = feedback.scan_id
                  and scans.user_id = (select auth.uid())
            )
        )
    );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'crop-scans',
    'crop-scans',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
    name = excluded.name,
    public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can upload images to their own folder"
    on storage.objects;
create policy "Users can upload images to their own folder"
    on storage.objects for insert
    to authenticated
    with check (
        bucket_id in ('crop-scans', 'leaf-images')
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

drop policy if exists "Users can read images from their own folder"
    on storage.objects;
create policy "Users can read images from their own folder"
    on storage.objects for select
    to authenticated
    using (
        bucket_id in ('crop-scans', 'leaf-images')
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

drop policy if exists "Users can delete images from their own folder"
    on storage.objects;
create policy "Users can delete images from their own folder"
    on storage.objects for delete
    to authenticated
    using (
        bucket_id in ('crop-scans', 'leaf-images')
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

insert into public.diseases (id, category, crop, name, description, recommendation)
values
    (uuid_generate_v5(uuid_ns_url(), 'verdant:tomato:early-blight'), 'Vegetables', 'Tomato', 'Early blight', 'A fungal disease that causes dark, target-like leaf spots, often beginning on older foliage and moving upward.', 'Remove badly affected leaves, keep foliage dry, improve airflow, rotate crops, and consult local extension guidance if disease continues.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:potato:late-blight'), 'Vegetables', 'Potato', 'Late blight', 'A fast-spreading disease that produces water-soaked lesions and can rapidly damage leaves, stems, and tubers in cool, wet weather.', 'Remove and safely dispose of infected material, avoid moving contaminated soil, limit leaf wetness, and contact local extension services promptly.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:corn:common-rust'), 'Grains', 'Corn', 'Common rust', 'A fungal disease producing scattered reddish-brown pustules on both surfaces of corn leaves.', 'Use locally adapted resistant hybrids, monitor fields, and seek extension advice when lesions increase before grain fill.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:wheat:stripe-rust'), 'Grains', 'Wheat', 'Stripe rust', 'A cool-weather fungal disease with yellow-orange pustules arranged in stripes along wheat leaves.', 'Grow resistant varieties, scout early during cool wet periods, and follow local disease thresholds and registered-product guidance.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:apple:scab'), 'Fruits', 'Apple', 'Apple scab', 'A fungal disease causing olive-green to dark scabby spots on leaves and fruit, especially during wet spring weather.', 'Remove fallen leaves, prune for airflow, choose resistant cultivars, and follow locally recommended preventive management.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:grape:powdery-mildew'), 'Fruits', 'Grape', 'Powdery mildew', 'A fungal disease that forms pale powdery growth on grape leaves, shoots, and berries.', 'Open the canopy to improve airflow, remove heavily affected material, and use locally registered measures according to label directions.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:orange:citrus-greening'), 'Fruits', 'Orange', 'Citrus greening', 'A serious bacterial disease associated with blotchy yellow leaves, lopsided fruit, and gradual decline of citrus trees.', 'Contact local plant-health authorities, control vector insects using integrated guidance, and do not move suspect plants or budwood.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:banana:black-sigatoka'), 'Fruits', 'Banana', 'Black Sigatoka', 'A leaf-spot disease that begins as streaks and develops into dark lesions, reducing green leaf area.', 'Remove severely affected leaves where practical, maintain spacing and drainage, and follow regional disease-management guidance.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:rice:blast'), 'Grains', 'Rice', 'Rice blast', 'A fungal disease causing spindle-shaped lesions with pale centers on leaves and possible neck infection.', 'Use resistant varieties, balanced nitrogen, clean seed, and locally recommended water and residue management.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:soybean:rust'), 'Cash crops', 'Soybean', 'Soybean rust', 'A fungal disease that forms small tan to reddish lesions and pustules, often first on lower leaves.', 'Scout lower canopy leaves, use resistant or tolerant cultivars where available, and follow regional alerts and registered-product labels.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:cotton:bacterial-blight'), 'Cash crops', 'Cotton', 'Bacterial blight', 'A seed- and residue-associated disease that may cause angular leaf spots, blackened veins, and boll lesions.', 'Plant certified disease-free seed, use resistant cultivars, rotate crops, and manage crop residue as advised locally.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:coffee:leaf-rust'), 'Cash crops', 'Coffee', 'Coffee leaf rust', 'A fungal disease producing yellow-orange powdery patches beneath leaves and premature defoliation.', 'Maintain balanced shade and nutrition, remove badly affected material, and seek local extension advice on resistant varieties and control.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:cacao:black-pod-rot'), 'Cash crops', 'Cacao', 'Black pod rot', 'A destructive pod disease that develops as brown lesions and spreads rapidly in humid conditions.', 'Harvest diseased pods promptly, improve drainage and airflow, sanitize tools, and follow local integrated-management guidance.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:sugarcane:red-rot'), 'Cash crops', 'Sugarcane', 'Red rot', 'A stalk disease that can cause internal red discoloration with pale cross-bands and crop decline.', 'Use healthy setts and resistant varieties, remove infected clumps, disinfect cutting tools, and rotate affected fields.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:cassava:mosaic'), 'Cash crops', 'Cassava', 'Cassava mosaic disease', 'A viral disease causing leaf mosaic, distortion, and stunting, commonly spread by infected cuttings and whiteflies.', 'Plant certified healthy stems, remove infected plants early, use tolerant varieties, and control vectors using local integrated guidance.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:chili:anthracnose'), 'Vegetables', 'Chili pepper', 'Anthracnose', 'A fungal fruit rot that produces sunken dark lesions, often with concentric rings or salmon-colored spore masses.', 'Use clean seed, remove infected fruit, avoid overhead irrigation, rotate crops, and improve airflow.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:cucumber:downy-mildew'), 'Vegetables', 'Cucumber', 'Downy mildew', 'A disease causing angular yellow leaf patches bounded by veins and gray-purple growth beneath leaves in humid weather.', 'Choose resistant varieties, avoid prolonged leaf wetness, remove infected debris, and follow local forecasts and advice.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:eggplant:bacterial-wilt'), 'Vegetables', 'Eggplant', 'Bacterial wilt', 'A soilborne bacterial disease that causes rapid wilting while leaves may remain green initially.', 'Remove wilted plants and surrounding debris, rotate with non-host crops, improve drainage, and use healthy transplants.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:lettuce:downy-mildew'), 'Vegetables', 'Lettuce', 'Downy mildew', 'A disease causing pale angular patches on upper leaves and white growth on leaf undersides.', 'Use resistant varieties, provide spacing and airflow, irrigate early in the day, and remove crop residues.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:onion:purple-blotch'), 'Vegetables', 'Onion', 'Purple blotch', 'A fungal leaf disease producing small water-soaked lesions that enlarge into purple-brown spots.', 'Avoid prolonged leaf wetness, rotate crops, remove debris, and maintain balanced fertility and field airflow.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:garlic:white-rot'), 'Vegetables', 'Garlic', 'White rot', 'A persistent soilborne disease that causes yellowing, root decay, and white fungal growth around bulbs.', 'Avoid moving soil from affected areas, use clean planting stock, clean equipment, and seek local advice before replanting.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:carrot:alternaria-leaf-blight'), 'Vegetables', 'Carrot', 'Alternaria leaf blight', 'A fungal disease causing dark, irregular lesions and blighting of carrot foliage.', 'Use clean seed, rotate crops, remove residues, avoid overhead irrigation, and maintain adequate plant spacing.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:cabbage:black-rot'), 'Vegetables', 'Cabbage', 'Black rot', 'A bacterial disease marked by V-shaped yellow lesions from leaf margins and darkened veins.', 'Use certified disease-free seed and transplants, sanitize tools, avoid working wet plants, and rotate brassica crops.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:broccoli:clubroot'), 'Vegetables', 'Broccoli', 'Clubroot', 'A soilborne disease that causes swollen, misshapen roots and wilting during warm days.', 'Use clean transplants, improve drainage, rotate away from brassicas for several years, and avoid moving infested soil.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:strawberry:gray-mold'), 'Fruits', 'Strawberry', 'Gray mold', 'A fungal fruit rot with soft brown tissue and fuzzy gray spores, favored by humid, crowded canopies.', 'Remove rotting fruit, space plants, use drip irrigation where possible, and keep berries off wet soil.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:peach:brown-rot'), 'Fruits', 'Peach', 'Brown rot', 'A fungal disease that blights blossoms and causes brown fruit rot with tan spore tufts.', 'Remove mummified fruit and infected twigs, prune for airflow, and handle fruit carefully to prevent wounds.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:avocado:root-rot'), 'Fruits', 'Avocado', 'Phytophthora root rot', 'A root disease associated with poorly drained soil, sparse foliage, small leaves, and branch dieback.', 'Improve drainage, avoid over-irrigation, use healthy nursery stock, and consult local specialists about tolerant rootstocks.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:mango:anthracnose'), 'Fruits', 'Mango', 'Anthracnose', 'A fungal disease causing dark leaf spots, blossom blight, and sunken lesions on fruit.', 'Prune to improve airflow, remove infected plant material, avoid wetting flowers and fruit, and follow local guidance.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:papaya:ringspot'), 'Fruits', 'Papaya', 'Papaya ringspot', 'A viral disease causing leaf distortion, mosaic, and ring-shaped markings on fruit.', 'Remove infected plants promptly, use virus-free seedlings, manage aphids using integrated practices, and avoid planting near infected crops.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:watermelon:fusarium-wilt'), 'Vegetables', 'Watermelon', 'Fusarium wilt', 'A soilborne fungal disease that causes one-sided or progressive vine wilting and vascular browning.', 'Use resistant varieties and clean seed, rotate with non-cucurbit crops, and avoid moving infested soil.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:pumpkin:powdery-mildew'), 'Vegetables', 'Pumpkin', 'Powdery mildew', 'A fungal disease that forms white powdery patches on leaves and can reduce fruit development.', 'Choose resistant varieties, space vines for airflow, remove severely affected leaves, and monitor older foliage.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:bean:anthracnose'), 'Vegetables', 'Common bean', 'Anthracnose', 'A seedborne fungal disease that causes dark, sunken lesions on stems, pods, and leaf veins.', 'Plant certified clean seed, rotate crops, avoid handling wet plants, and remove infected residues.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:peanut:early-leaf-spot'), 'Cash crops', 'Peanut', 'Early leaf spot', 'A fungal disease causing circular brown leaf spots with yellow halos and premature defoliation.', 'Rotate crops, manage volunteer plants, reduce prolonged leaf wetness, and scout lower leaves regularly.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:sunflower:downy-mildew'), 'Cash crops', 'Sunflower', 'Downy mildew', 'A systemic disease that can cause stunting, chlorosis, and white growth on leaf undersides.', 'Use resistant hybrids and treated certified seed where recommended, rotate fields, and remove volunteer sunflowers.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:sorghum:anthracnose'), 'Grains', 'Sorghum', 'Anthracnose', 'A fungal disease producing reddish or dark leaf lesions and sometimes stalk rot.', 'Grow tolerant hybrids, rotate crops, manage residue, and avoid excessive plant stress.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:millet:downy-mildew'), 'Grains', 'Pearl millet', 'Downy mildew', 'A systemic disease causing pale striped leaves, malformed heads, and reduced grain production.', 'Plant resistant varieties and healthy seed, remove infected plants early, and rotate fields.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:barley:net-blotch'), 'Grains', 'Barley', 'Net blotch', 'A fungal disease causing elongated brown leaf lesions with a characteristic net-like pattern.', 'Use clean seed, rotate away from barley, manage infected residue, and select resistant cultivars.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:oats:crown-rust'), 'Grains', 'Oats', 'Crown rust', 'A fungal disease producing small orange pustules on oat leaves, often late in the season.', 'Choose resistant cultivars, remove nearby buckthorn where appropriate, and monitor crop development.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:tea:blister-blight'), 'Cash crops', 'Tea', 'Blister blight', 'A fungal disease that forms translucent blisters on young tea leaves and shoots in wet conditions.', 'Improve airflow through pruning, remove severely affected shoots, and follow regional tea-board guidance.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:tobacco:blue-mold'), 'Cash crops', 'Tobacco', 'Blue mold', 'A downy mildew disease causing pale yellow leaf patches and bluish-gray growth beneath leaves.', 'Use resistant varieties, improve ventilation, avoid excess leaf wetness, and follow official regional alerts.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:olive:olive-knot'), 'Fruits', 'Olive', 'Olive knot', 'A bacterial disease that forms rough swellings on twigs and branches, often entering through wounds.', 'Prune during dry weather, disinfect tools, protect against mechanical injury, and remove infected branches.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:almond:leaf-scorch'), 'Fruits', 'Almond', 'Bacterial leaf scorch', 'A bacterial disease that causes marginal leaf browning, reduced vigor, and gradual branch decline.', 'Use healthy nursery stock, manage water stress, prune affected wood when appropriate, and consult local extension specialists.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:blueberry:mummy-berry'), 'Fruits', 'Blueberry', 'Mummy berry', 'A fungal disease that causes shoot blight and shriveled, mummified berries.', 'Remove mummified berries, mulch beneath bushes, improve airflow, and follow locally timed management advice.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:pineapple:heart-rot'), 'Fruits', 'Pineapple', 'Heart rot', 'A crown and root disease associated with waterlogged conditions, causing central leaf discoloration and decay.', 'Use healthy planting material, ensure well-drained beds, avoid excessive irrigation, and remove badly affected plants.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:pea:powdery-mildew'), 'Vegetables', 'Pea', 'Powdery mildew', 'A fungal disease that covers pea leaves and pods with white powdery growth, often late in the season.', 'Grow resistant cultivars, provide airflow, avoid dense planting, and remove crop residues after harvest.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:lentil:ascochyta-blight'), 'Grains', 'Lentil', 'Ascochyta blight', 'A seedborne fungal disease causing tan lesions with dark margins on leaves, stems, and pods.', 'Use clean seed, rotate crops, avoid working wet fields, and select resistant varieties where available.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:mustard:alternaria-blight'), 'Cash crops', 'Mustard', 'Alternaria blight', 'A fungal disease causing dark concentric leaf spots and lesions on stems and pods.', 'Use healthy seed, rotate crops, remove infected debris, and maintain balanced crop nutrition.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:pomegranate:bacterial-blight'), 'Fruits', 'Pomegranate', 'Bacterial blight', 'A bacterial disease that produces water-soaked leaf spots, twig lesions, and cracked fruit.', 'Use clean planting material, prune infected twigs in dry weather, disinfect tools, and avoid overhead irrigation.'),
    (uuid_generate_v5(uuid_ns_url(), 'verdant:kiwi:bacterial-canker'), 'Fruits', 'Kiwifruit', 'Bacterial canker', 'A bacterial disease that can cause leaf spots, cane dieback, and reddish-brown sap from pruning wounds.', 'Use certified plants, disinfect pruning tools, avoid pruning in wet weather, and follow local quarantine guidance.')
on conflict (crop, name) do update set
    category = excluded.category,
    description = excluded.description,
    recommendation = excluded.recommendation;

do $$
begin
    if exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'scans'
    ) then
        return;
    end if;

    if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
        alter publication supabase_realtime add table public.scans;
    end if;
end
$$;

commit;
