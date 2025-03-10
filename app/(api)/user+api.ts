import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { name, email, clerkId } = await request.json();

    if (!name || !email || !clerkId) {
      return Response.json(
        {
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const response =
      await sql`INSERT INTO USERS(NAME, EMAIL, CLERK_ID) VALUES (${name}, ${email}, ${clerkId})`;

    return new Response(JSON.stringify({ data: response }), { status: 201 });
  } catch (error: any) {
    console.log("Error:", error);
    return Response.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      }
    );
  }
}

// export function GET(request: Request) {
  
//   return Response.json({ hello: 'world' });
// }