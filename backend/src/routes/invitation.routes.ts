// backend/src/routes/invitation.routes.ts
import { Router, Request, Response } from 'express';
import { sendInviteEmails } from '../services/emailService';

const router = Router();

interface InviteRequest {
  name: string;
  email: string;
  phone?: string;
  program: string;
  date: string;
  location?: string;
  message?: string;
}

router.post('/invite', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, program, date, location, message } = req.body;

    // Validate required fields
    if (!name || !email || !program || !date) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, program, and date are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Send emails
    await sendInviteEmails({
      name,
      email,
      phone,
      program,
      date,
      location,
      message,
    });

    res.status(200).json({ 
      success: true, 
      message: 'Invitation sent successfully' 
    });
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ 
      error: 'Failed to send invitation. Please try again later.' 
    });
  }
});

export default router;