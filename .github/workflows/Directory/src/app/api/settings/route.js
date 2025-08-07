import sql from "@/app/api/utils/sql";

// Get site settings
export async function GET() {
  try {
    const [settings] = await sql`
      SELECT * FROM site_settings ORDER BY id DESC LIMIT 1
    `;
    
    return Response.json(settings || { site_title: 'Digital Services Store', whatsapp_number: '+2348020674070' });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return Response.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// Update site settings
export async function PUT(request) {
  try {
    const { site_title, whatsapp_number } = await request.json();
    
    // Check if settings exist
    const [existing] = await sql`
      SELECT id FROM site_settings ORDER BY id DESC LIMIT 1
    `;
    
    let settings;
    
    if (existing) {
      // Update existing settings
      [settings] = await sql`
        UPDATE site_settings 
        SET site_title = ${site_title || 'Digital Services Store'}, 
            whatsapp_number = ${whatsapp_number || '+2348020674070'}
        WHERE id = ${existing.id}
        RETURNING *
      `;
    } else {
      // Create new settings
      [settings] = await sql`
        INSERT INTO site_settings (site_title, whatsapp_number)
        VALUES (${site_title || 'Digital Services Store'}, ${whatsapp_number || '+2348020674070'})
        RETURNING *
      `;
    }
    
    return Response.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return Response.json({ error: 'Failed to update settings' }, { status: 500 });
  }
    }
