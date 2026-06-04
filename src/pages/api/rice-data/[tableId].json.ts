import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, url }) => {
    const { tableId } = params;
    const province = url.searchParams.get('province');

    const PB_URL = process.env.PB_URL || 'http://localhost:8090';

    console.log(`API called: tableId=${tableId}, province=${province}`);
    console.log(`PB_URL: ${PB_URL}`);
    
    const validTables = ['plantvigorandleaf', 'culm', 'panicle', 'grain', 'growth'];
    
    if (!tableId || !validTables.includes(tableId)) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Invalid table ID'
        }), { status: 400 });
    }
    
    try {
        // Build filter - by table_id AND province
        let filter = `(table_id='${tableId}')`;
        if (province) {
            filter += ` && (province='${province}')`;
        }
        
        const response = await fetch(
            `${PB_URL}/api/collections/rice_data/records?filter=${encodeURIComponent(filter)}&perPage=500&sort=created`
        );
        
        if (!response.ok) {
            throw new Error(`PocketBase error: ${response.status}`);
        }
        
        const data = await response.json();
        
        const items = data.items.map(item => ({
            id: item.id,
            province: item.province,
            treatmentNo: item.block_treatment_no,
            landraceId: item.landrace_id,
            trialNumber: item.trial_number,
            recordedAt: item.record_date,
            ...item.agro_params
        }));
        
        return new Response(JSON.stringify({
            success: true,
            data: items,
            tableId: tableId,
            province: province,
            totalItems: data.totalItems
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error fetching from PocketBase:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), { status: 500 });
    }
};
