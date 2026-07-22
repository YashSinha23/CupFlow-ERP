SELECT m.id AS materialId,
               m.material_type AS materialType,
               m.unit AS unit,
               m.min_threshold AS minThreshold,
               COALESCE(SUM(sl.quantity), 0) AS availableStock
        FROM materials m
        LEFT JOIN stock_ledger sl ON sl.material_id = m.id
            AND sl.movement_type IN ('STOCK_IN', 'RESERVED')
        GROUP BY m.id, m.material_type, m.unit, m.min_threshold
        ORDER BY m.material_type ASC