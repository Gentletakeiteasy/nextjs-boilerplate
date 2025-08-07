import sql from "@/app/api/utils/sql";

// Get a single product
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const [product] = await sql`
      SELECT * FROM products WHERE id = ${id}
    `;
    
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return Response.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return Response.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// Update a product
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    // Build dynamic update query
    const setClauses = [];
    const values = [];
    let paramIndex = 1;
    
    const allowedFields = ['title', 'category', 'quantity', 'price_per_quantity', 'description', 'verified'];
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        setClauses.push(`${field} = $${paramIndex}`);
        values.push(updates[field]);
        paramIndex++;
      }
    }
    
    if (setClauses.length === 0) {
      return Response.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    
    const setClause = setClauses.join(', ');
    values.push(id); // Add ID as the last parameter
    
    const [product] = await sql(
      `UPDATE products SET ${setClause} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return Response.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return Response.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// Delete a product
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const [product] = await sql`
      DELETE FROM products WHERE id = ${id} RETURNING *
    `;
    
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return Response.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return Response.json({ error: 'Failed to delete product' }, { status: 500 });
  }
      }
