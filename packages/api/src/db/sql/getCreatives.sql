SELECT
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
    updated_at::text
FROM creatives
/*WHERE*/
ORDER BY /*ORDERBY*/ /*ORDERDIR*/
LIMIT /*LIMIT*/ OFFSET /*OFFSET*/;
