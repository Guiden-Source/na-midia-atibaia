-- =================================================================
-- FIX: RPC COLUMN NAME ERROR (request_price -> price)
-- =================================================================
-- Data: 02/01/2026
-- Objetivo: Corrigir erro 42703 (coluna inexistente) na função de criar pedido
--           e adicionar colunas faltantes (notes) em delivery_order_items.
-- =================================================================

-- 1. Adicionar coluna 'notes' em delivery_order_items (se não existir)
ALTER TABLE public.delivery_order_items 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Recriar a função create_delivery_order_complete com as colunas corretas
--    Mudanças: 
--    - request_price -> price
--    - Adicionado product_name e product_image (que são obrigatórios/esperados na tabela)

CREATE OR REPLACE FUNCTION public.create_delivery_order_complete(
    p_user_id uuid,
    p_user_name text,
    p_user_phone text,
    p_user_email text,
    p_address_street text,
    p_address_number text,
    p_address_complement text,
    p_address_condominium text,
    p_address_block text,
    p_address_apartment text,
    p_address_reference text,
    p_payment_method text,
    p_change_for numeric,
    p_subtotal numeric,
    p_delivery_fee numeric,
    p_total numeric,
    p_notes text,
    p_items jsonb,
    p_scheduled_at timestamp with time zone DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    v_order_id uuid;
    v_order_number text;
    v_item jsonb;
BEGIN
    -- Gerar número do pedido (AAAA-MMDD-XXXX)
    v_order_number := to_char(now(), 'YYYY-MMDD') || '-' || substring(md5(random()::text) from 1 for 4);

    -- Inserir pedido
    INSERT INTO public.delivery_orders (
        user_id,
        user_name,
        user_phone,
        user_email,
        address_street,
        address_number,
        address_complement,
        address_condominium,
        address_block,
        address_apartment,
        address_reference,
        payment_method,
        change_for,
        subtotal,
        delivery_fee,
        total,
        notes,
        status,
        order_number,
        scheduled_at
    ) VALUES (
        p_user_id,
        p_user_name,
        p_user_phone,
        p_user_email,
        p_address_street,
        p_address_number,
        p_address_complement,
        p_address_condominium,
        p_address_block,
        p_address_apartment,
        p_address_reference,
        p_payment_method,
        p_change_for,
        p_subtotal,
        p_delivery_fee,
        p_total,
        p_notes,
        'pending',
        v_order_number,
        p_scheduled_at
    )
    RETURNING id INTO v_order_id;

    -- Inserir itens
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO public.delivery_order_items (
            order_id,
            product_id,
            product_name,    -- ADICIONADO
            product_image,   -- ADICIONADO
            price,           -- CORRIGIDO (era request_price)
            quantity,
            subtotal,
            notes            -- ADICIONADO
        ) VALUES (
            v_order_id,
            (v_item->>'product_id')::uuid,
            (v_item->>'product_name'),  -- Extrair do JSON
            (v_item->>'product_image'), -- Extrair do JSON
            (v_item->>'price')::numeric,
            (v_item->>'quantity')::integer,
            (v_item->>'subtotal')::numeric,
            v_item->>'notes'
        );
    END LOOP;

    -- Retornar dados do pedido criado
    RETURN jsonb_build_object(
        'id', v_order_id,
        'order_number', v_order_number,
        'status', 'pending',
        'total', p_total
    );
END;
$function$;
