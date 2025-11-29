INSERT INTO creatives (
    name,
    status,
    owner,
    channel,
    campaign,
    budget,
    impressions,
    clicks,
    ctr,
    conversions,
    created_at,
    updated_at
)
SELECT
    'Creative #' || g.id AS name,
    (ARRAY['draft','active','paused','archived'])[(random()*3)::int + 1] AS status,
    'user_' || ((g.id % 50) + 1) AS owner,
    (ARRAY['facebook','google','tiktok','instagram'])[(random()*3)::int + 1] AS channel,
    'Campaign ' || ((g.id % 200) + 1) AS campaign,
    round((random()*1000 + 100)::numeric, 2) AS budget,
    (random()*100000)::int AS impressions,
    (random()*20000)::int AS clicks,
    round((random()*10)::numeric, 2) AS ctr,
    (random()*5000)::int AS conversions,
    NOW() - (g.id || ' minutes')::interval AS created_at,
    NOW() AS updated_at
FROM generate_series(1, 50000) AS g(id);
