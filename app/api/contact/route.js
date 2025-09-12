export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    // Basic server-side validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ success: false, message: 'All fields are required' }),
        { status: 400 }
      );
    }

    console.log('Contact form submitted:', { name, email, message });

    return new Response(
      JSON.stringify({ success: true, message: 'Message sent' }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: 'Server error' }),
      { status: 500 }
    );
  }
}
