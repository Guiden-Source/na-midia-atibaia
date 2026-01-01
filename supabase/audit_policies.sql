-- Query to list all existing policies on delivery tables
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check 
FROM 
    pg_policies 
WHERE 
    tablename LIKE 'delivery_%'
ORDER BY 
    tablename, cmd;
