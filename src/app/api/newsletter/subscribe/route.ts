import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'src/data/subscribers.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, leadMagnet } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    // 1. Simulated / local database saving
    const dir = path.dirname(SUBSCRIBERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let subscribers = [];
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      try {
        const fileContent = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
        subscribers = JSON.parse(fileContent);
      } catch (err) {
        console.error('Error reading subscribers file:', err);
      }
    }

    // Check if already subscribed to avoid duplicate logs in the file
    const exists = subscribers.some((sub: any) => sub.email.toLowerCase() === email.toLowerCase() && sub.leadMagnet === leadMagnet);
    
    if (!exists) {
      subscribers.push({
        email,
        name: name || null,
        leadMagnet: leadMagnet || null,
        timestamp: new Date().toISOString(),
      });
      fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
    }

    // 2. Real API Integration check (ConvertKit / Mailchimp)
    const convertKitApiKey = process.env.CONVERTKIT_API_KEY;
    const convertKitFormId = process.env.CONVERTKIT_FORM_ID;

    if (convertKitApiKey && convertKitFormId) {
      console.log(`Sending subscriber ${email} to ConvertKit Form ID ${convertKitFormId}...`);
      
      const response = await fetch(`https://api.convertkit.com/v3/forms/${convertKitFormId}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: convertKitApiKey,
          email,
          first_name: name || undefined,
          tags: leadMagnet ? [leadMagnet] : undefined,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('ConvertKit API Error Response:', errText);
        // We log it, but fallback to success for the client since we recorded it locally
      } else {
        console.log(`ConvertKit subscription successful for ${email}.`);
      }
    } else {
      console.log(`[SIMULATION] Subscriber logged successfully: ${email} (Name: ${name || 'N/A'}, LeadMagnet: ${leadMagnet || 'None'})`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription successful! Thank you for joining OmniRank.' 
    });
  } catch (error: any) {
    console.error('Newsletter subscribe endpoint error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
