import sql from "@/app/api/utils/sql";

// Get all products
export async function GET() {
  try {
    const products = await sql`
      SELECT * FROM products 
      ORDER BY created_at DESC
    `;
    
    return Response.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// Create a new product
export async function POST(request) {
  try {
    const { title, category, quantity, price_per_quantity, description, verified } = await request.json();
    
    if (!title || !category || !quantity || !price_per_quantity || !description) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const [product] = await sql`
      INSERT INTO products (title, category, quantity, price_per_quantity, description, verified)
      VALUES (${title}, ${category}, ${quantity}, ${price_per_quantity}, ${description}, ${verified || true})
      RETURNING *
    `;
    
    return Response.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return Response.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
