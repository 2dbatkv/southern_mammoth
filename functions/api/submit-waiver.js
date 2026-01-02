/**
 * Cloudflare Pages Function to handle waiver submissions
 * Sends emails via Resend API
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'cave',
      'participantName',
      'email',
      'phone',
      'address',
      'birthDate',
      'tripDate',
      'emergency1Name',
      'emergency1Phone',
      'signature',
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          error: `Missing required fields: ${missingFields.join(', ')}`
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Validate signature matches name
    if (data.signature.trim().toLowerCase() !== data.participantName.trim().toLowerCase()) {
      return new Response(
        JSON.stringify({
          error: 'Signature must match your full name exactly'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Get Resend API key from environment
    const RESEND_API_KEY = env.RESEND_API_KEY;
    const ADMIN_EMAIL = env.ADMIN_EMAIL || 'admin@example.com';
    const PROPERTY_OWNER_EMAIL = env.PROPERTY_OWNER_EMAIL;

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({
          error: 'Email service not configured. Please contact support.'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Format the waiver data for email
    const waiverHtml = generateWaiverEmail(data);
    const submissionDate = new Date(data.submittedAt).toLocaleString();

    // Determine recipient based on cave
    const isHatcherPit = data.cave.includes('Hatcher');
    const propertyOwnerEmail = isHatcherPit && PROPERTY_OWNER_EMAIL
      ? PROPERTY_OWNER_EMAIL
      : ADMIN_EMAIL;

    // Send emails via Resend
    const emailPromises = [];

    // Email to participant (confirmation)
    emailPromises.push(
      sendResendEmail(RESEND_API_KEY, {
        from: 'Southern Mammoth Waivers <noreply@yourdomain.com>',
        to: [data.email],
        subject: `Waiver Confirmation - ${data.cave}`,
        html: `
          <h2>Waiver Submission Confirmed</h2>
          <p>Dear ${data.participantName},</p>
          <p>Thank you for submitting your waiver for <strong>${data.cave}</strong>.</p>
          ${isHatcherPit ? '<p><strong>Note:</strong> Your waiver has been sent to the property owner for review. You will receive confirmation once it has been approved. Please wait for this confirmation before planning your trip.</p>' : ''}
          <p><strong>Submitted:</strong> ${submissionDate}</p>
          <p><strong>Planned Trip Date:</strong> ${new Date(data.tripDate).toLocaleDateString()}</p>
          <hr>
          <h3>Your Waiver Details:</h3>
          ${waiverHtml}
          <hr>
          <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        `,
      })
    );

    // Email to property owner/admin (notification)
    emailPromises.push(
      sendResendEmail(RESEND_API_KEY, {
        from: 'Southern Mammoth Waivers <noreply@yourdomain.com>',
        to: [propertyOwnerEmail],
        subject: `New Waiver Submission - ${data.cave} - ${data.participantName}`,
        html: `
          <h2>New Waiver Submission</h2>
          <p><strong>Cave:</strong> ${data.cave}</p>
          <p><strong>Participant:</strong> ${data.participantName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Planned Trip Date:</strong> ${new Date(data.tripDate).toLocaleDateString()}</p>
          <p><strong>Submitted:</strong> ${submissionDate}</p>
          ${isHatcherPit ? '<p style="background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107;"><strong>Action Required:</strong> This waiver requires property owner approval. Please review and contact the participant if needed.</p>' : ''}
          <hr>
          <h3>Full Waiver Details:</h3>
          ${waiverHtml}
        `,
      })
    );

    // Wait for all emails to send
    const results = await Promise.allSettled(emailPromises);

    // Check if any email failed
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.error('Email sending failed:', failures);
      return new Response(
        JSON.stringify({
          error: 'Failed to send confirmation emails. Please contact support.'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Waiver submitted successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error processing waiver:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing your waiver. Please try again.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
}

/**
 * Send email via Resend API
 */
async function sendResendEmail(apiKey, emailData) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return await response.json();
}

/**
 * Generate HTML for waiver details email
 */
function generateWaiverEmail(data) {
  const checkmark = data.wnsAcknowledge ? '✓' : '✗';
  const submissionDate = new Date(data.submittedAt).toLocaleString();

  return `
    <table style="width: 100%; border-collapse: collapse; font-family: sans-serif;">
      <tr style="background: #f8f9fa;">
        <th style="text-align: left; padding: 12px; border: 1px solid #dee2e6;">Cave</th>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${data.cave}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 12px; border: 1px solid #dee2e6;">Full Name</th>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${data.participantName}</td>
      </tr>
      <tr style="background: #f8f9fa;">
        <th style="text-align: left; padding: 12px; border: 1px solid #dee2e6;">Email</th>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${data.email}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 12px; border: 1px solid #dee2e6;">Phone</th>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${data.phone}</td>
      </tr>
      <tr style="background: #f8f9fa;">
        <th style="text-align: left; padding: 12px; border: 1px solid #dee2e6;">Address</th>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${data.address}${data.cityStateZip ? '<br>' + data.cityStateZip : ''}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 12px; border: 1px solid #dee2e6;">Birth Date</th>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${new Date(data.birthDate).toLocaleDateString()}</td>
      </tr>
      <tr style="background: #f8f9fa;">
        <th style="text-align: left; padding: 12px; border: 1px solid #dee2e6;">Planned Trip Date</th>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${new Date(data.tripDate).toLocaleDateString()}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 12px; border: 1px solid #dee2e6;">Emergency Contact #1</th>
        <td style="padding: 12px; border: 1px solid #dee2e6;">
          ${data.emergency1Name}<br>
          ${data.emergency1Phone}
          ${data.emergency1Relationship ? '<br>Relationship: ' + data.emergency1Relationship : ''}
        </td>
      </tr>
      ${data.emergency2Name ? `
      <tr style="background: #f8f9fa;">
        <th style="text-align: left; padding: 12px; border: 1px solid #dee2e6;">Emergency Contact #2</th>
        <td style="padding: 12px; border: 1px solid #dee2e6;">
          ${data.emergency2Name}<br>
          ${data.emergency2Phone || 'N/A'}
          ${data.emergency2Relationship ? '<br>Relationship: ' + data.emergency2Relationship : ''}
        </td>
      </tr>
      ` : ''}
      <tr>
        <th style="text-align: left; padding: 12px; border: 1px solid #dee2e6;">Acknowledgments</th>
        <td style="padding: 12px; border: 1px solid #dee2e6;">
          ${data.wnsAcknowledge ? '✓' : '✗'} White-nose Syndrome Prevention<br>
          ${data.risksAcknowledge ? '✓' : '✗'} Risks and Hazards<br>
          ${data.rulesAcknowledge ? '✓' : '✗'} Conservation and Safety Rules<br>
          ${data.liabilityAcknowledge ? '✓' : '✗'} Liability Release
        </td>
      </tr>
      <tr style="background: #f8f9fa;">
        <th style="text-align: left; padding: 12px; border: 1px solid #dee2e6;">Electronic Signature</th>
        <td style="padding: 12px; border: 1px solid #dee2e6; font-style: italic;">${data.signature}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 12px; border: 1px solid #dee2e6;">Submission Date/Time</th>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${submissionDate}</td>
      </tr>
    </table>
  `;
}
