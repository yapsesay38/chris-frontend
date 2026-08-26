import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

export const GET: APIRoute = async ({ params, url }) => {
    const { tableId } = params;
    const province = url.searchParams.get('province');

    const validTables = ['plantvigorandleaf', 'culm', 'panicle', 'grain', 'growth'];
    if (!tableId || !validTables.includes(tableId)) {
        return new Response(
          JSON.stringify(
            { success: false, error: 'Invalid table ID'}
            ),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const supabaseInternalUrl = process.env.SUPABASE_INTERNAL_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    console.log('URL:', supabaseInternalUrl, 'Key:' , supabaseAnonKey ? 'exists' : 'missing');

    if (!supabaseInternalUrl || !supabaseAnonKey) {
      console.error('Missing Supabase credentials');
      return new Response(
        JSON.stringify(
          { success: false, error: 'Supabase credentials missing' }
        ),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseInternalUrl, supabaseAnonKey);

    let query = supabase
      .from('rice_data')
      .select('*')
      .eq('table_id', tableId);

    if (province && province !== 'null' && province !== 'undefined' && province !== '') {
      query = query.eq('province', province);
    }
    
    try {
        const { data, error } = await query;

        if (error) {
          console.error('Supabase query error:', error);
          return new Response(
            JSON.stringify(
              { success: false, error: error.message }
            ),
              { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const items = data.map((record: any) => ({
            province: record.province,
            municipality: record.municipality,
            barangay: record.barangay,
            treatmentNo: record.block_treatment_no,
            landraceId: record.landrace_id,
            trialNumber: record.trial_number,
            recordedAt: record.record_date,
            ...record.agro_params,
        }));
        
        return new Response(
          JSON.stringify({
            success: true,
            data: items,
            tableId,
            province: province || null,
            totalItems: items.length,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
        
    } catch (error: any) {
        console.error('Error fetching from Supabase:', error);
        return new Response(
          JSON.stringify({
            success: false,
            error: error.message,
            stack: error.stack
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
