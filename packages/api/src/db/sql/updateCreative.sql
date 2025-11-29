UPDATE creatives
SET
    /*SET*/
WHERE id = $ID
RETURNING
    id,
    name,
    status,
    owner,
    channel,
    campaign,
    budget::text,
    impressions,
    clicks,
    ctr::text,
    conversions,
    created_at::text,
    updated_at::text;
