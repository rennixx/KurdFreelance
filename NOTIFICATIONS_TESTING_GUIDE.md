# Notifications Testing Guide

## Database Structure

The notifications table has the following columns:
```sql
- id: UUID (auto-generated)
- user_id: UUID (references users table)
- type: TEXT (e.g., 'discount', 'new_job', 'proposal_received')
- title: TEXT (notification title)
- message: TEXT (notification body)
- data: JSONB (additional data like discount codes, links)
- is_read: BOOLEAN (default: false)
- created_at: TIMESTAMPTZ (auto-generated)
```

---

## Method 1: Insert via Supabase Dashboard (Easiest)

### Steps:
1. **Go to Supabase Dashboard**
   - Open your project: https://supabase.com/dashboard
   - Navigate to: Table Editor → `notifications`

2. **Click "Insert row"**

3. **Fill in the fields:**
   ```
   user_id: [YOUR_USER_ID]
   type: discount_offer
   title: 🎉 Special Discount - 50% Off!
   message: Limited time offer! Get 50% off on all premium features. Use code: NEWYEAR2026
   data: {"code": "NEWYEAR2026", "discount": 50, "expires": "2026-02-01"}
   is_read: false
   ```

4. **Click "Save"**

---

## Method 2: SQL Query (Fast for Multiple Notifications)

### 1. Send to ALL Users (No User ID Needed!)

#### Discount for Everyone
```sql
INSERT INTO notifications (user_id, type, title, message, data)
SELECT 
  id,
  'discount_offer',
  '🎉 Special Discount - 50% Off!',
  'Limited time offer! Get 50% off on all premium features. Use code: NEWYEAR2026',
  '{"code": "NEWYEAR2026", "discount": 50, "expires": "2026-02-01"}'
FROM users;
```

#### System Announcement for All Users
```sql
INSERT INTO notifications (user_id, type, title, message, data)
SELECT 
  id,
  'system_alert',
  '📢 Platform Update',
  'We have added new features! Check out our improved messaging system.',
  '{"version": "2.0", "features": ["messaging", "video_calls"]}'
FROM users;
```

### 2. Send to Specific User Groups

#### Send to All Freelancers Only
```sql
INSERT INTO notifications (user_id, type, title, message, data)
SELECT 
  id,
  'new_job',
  '💼 New Jobs Available!',
  'Check out the latest job postings in your category',
  '{"jobs_count": 25}'
FROM users
WHERE role = 'freelancer';
```

#### Send to All Clients Only
```sql
INSERT INTO notifications (user_id, type, title, message, data)
SELECT 
  id,
  'discount_offer',
  '🎁 Client Exclusive: 20% Off Job Posts',
  'Post your next job and get 20% off. Use code: CLIENT20',
  '{"code": "CLIENT20", "discount": 20}'
FROM users
WHERE role = 'client';
```

#### Send to Active Users (logged in last 7 days)
```sql
INSERT INTO notifications (user_id, type, title, message, data)
SELECT 
  id,
  'discount_offer',
  '👋 Welcome Back! Special Offer Inside',
  'Thank you for being an active user! Here is 30% off your next purchase.',
  '{"code": "ACTIVE30", "discount": 30}'
FROM users
WHERE last_sign_in_at > NOW() - INTERVAL '7 days';
```

#### Send to New Users (joined in last 30 days)
```sql
INSERT INTO notifications (user_id, type, title, message, data)
SELECT 
  id,
  'discount_offer',
  '🎉 Welcome Bonus: 50% Off!',
  'Welcome to KurdFreelance! Get 50% off as a new member. Code: WELCOME50',
  '{"code": "WELCOME50", "discount": 50, "new_user": true}'
FROM users
WHERE created_at > NOW() - INTERVAL '30 days';
```

### 3. Send to Users Based on Conditions

#### Freelancers with High Ratings
```sql
INSERT INTO notifications (user_id, type, title, message, data)
SELECT 
  u.id,
  'achievement',
  '⭐ Top Rated Freelancer!',
  'Congratulations! You are in our top 10% freelancers. Keep up the great work!',
  '{"badge": "top_rated"}'
FROM users u
JOIN freelancer_profiles fp ON u.id = fp.user_id
WHERE u.role = 'freelancer' 
  AND fp.rating >= 4.5;
```

#### Clients Who Posted Jobs
```sql
INSERT INTO notifications (user_id, type, title, message, data)
SELECT DISTINCT
  u.id,
  'discount_offer',
  '💼 Thank You for Posting!',
  'Get 25% off your next job post. Use code: THANKS25',
  '{"code": "THANKS25", "discount": 25}'
FROM users u
JOIN jobs j ON u.id = j.client_id
WHERE u.role = 'client';
```

#### Freelancers in Specific Location
```sql
INSERT INTO notifications (user_id, type, title, message, data)
SELECT 
  u.id,
  'event',
  '🌍 Kurdistan Meetup Event!',
  'Join us for a freelancer networking event in Erbil next month!',
  '{"event_date": "2026-03-15", "location": "Erbil"}'
FROM users u
JOIN freelancer_profiles fp ON u.id = fp.user_id
WHERE u.role = 'freelancer' 
  AND (fp.location ILIKE '%erbil%' OR fp.location ILIKE '%kurdistan%');
```

### 4. Bulk Send with Verification

#### Test First (See How Many Users Will Receive)
```sql
-- Check count before sending
SELECT COUNT(*) as total_recipients
FROM users
WHERE role = 'freelancer';

-- If count looks good, then send
INSERT INTO notifications (user_id, type, title, message, data)
SELECT id, 'discount_offer', '🎉 Flash Sale!', 'Limited time offer!', '{}'
FROM users
WHERE role = 'freelancer';
```

### 5. Quick Templates for Common Scenarios

#### A. Flash Sale for Everyone
```sql
INSERT INTO notifications (user_id, type, title, message, data)
SELECT id, 'discount_offer', '⚡ Flash Sale - 40% OFF!', 'Next 24 hours only! Code: FLASH40', '{"code": "FLASH40", "expires": "24h"}'
FROM users;
```

#### B. Weekend Discount for Freelancers
```sql
INSERT INTO notifications (user_id, type, title, message, data)
SELECT id, 'discount_offer', '🎊 Weekend Special!', 'Boost your profile this weekend - 50% off', '{"code": "WEEKEND50"}'
FROM users WHERE role = 'freelancer';
```

#### C. Job Alert for All Freelancers
```sql
INSERT INTO notifications (user_id, type, title, message, data)
SELECT id, 'new_job', '💼 50+ New Jobs Posted Today!', 'Browse jobs in Development, Design, and more', '{"jobs_count": 50}'
FROM users WHERE role = 'freelancer';
```

#### D. Thank You Message for Active Users
```sql
INSERT INTO notifications (user_id, type, title, message, data)
SELECT id, 'system_alert', '❤️ Thank You!', 'Thanks for being part of our community. Here is a gift!', '{"gift": "premium_badge"}'
FROM users WHERE last_sign_in_at > NOW() - INTERVAL '7 days';
```

---

## Method 3: Advanced Bulk Notifications

### Send to Multiple User IDs at Once
```sql
INSERT INTO notifications (user_id, type, title, message, data)
SELECT 
  id,
  'system_alert',
  '📢 Important Update',
  'Your feedback helped us improve the platform!',
  '{}'
FROM users
WHERE id IN (
  'user-id-1',
  'user-id-2',
  'user-id-3'
);
```

### Conditional Notifications Based on Activity
```sql
-- Send to users who haven't posted a job in 30 days
INSERT INTO notifications (user_id, type, title, message, data)
SELECT DISTINCT
  u.id,
  'reminder',
  '📝 Ready to Post a New Job?',
  'It has been a while! Post a job and find the perfect freelancer.',
  '{"cta": "post_job"}'
FROM users u
LEFT JOIN jobs j ON u.id = j.client_id AND j.created_at > NOW() - INTERVAL '30 days'
WHERE u.role = 'client' AND j.id IS NULL;
```

---

## Super Quick Commands (Copy & Paste)

```sql
-- 1. Send discount to ALL users
INSERT INTO notifications (user_id, type, title, message, data)
SELECT id, 'discount_offer', '🎉 50% OFF SALE!', 'Use code: SAVE50', '{"code":"SAVE50"}'
FROM users;

-- 2. Send to ALL freelancers
INSERT INTO notifications (user_id, type, title, message, data)
SELECT id, 'new_job', '💼 New Jobs!', 'Check latest jobs', '{}'
FROM users WHERE role = 'freelancer';

-- 3. Send to ALL clients
INSERT INTO notifications (user_id, type, title, message, data)
SELECT id, 'discount_offer', '🎁 Client Special!', 'Post jobs cheaper', '{}'
FROM users WHERE role = 'client';

-- 4. Check how many will receive (test first)
SELECT COUNT(*) FROM users WHERE role = 'freelancer';
```

---

## Method 4: Via API (Programmatic)

Create a simple API endpoint to send notifications:

```typescript
// app/api/notifications/send/route.ts
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: body.userId,
      type: body.type,
      title: body.title,
      message: body.message,
      data: body.data || {},
    });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true, data });
}
```

Then use it:
```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "type": "discount_offer",
    "title": "🎉 Flash Sale!",
    "message": "50% off everything!",
    "data": {"code": "FLASH50"}
  }'
```

---

## Notification Types Reference

### Common Notification Types:
- `discount_offer` - Special promotions and discounts
- `new_job` - New job postings matching skills
- `proposal_received` - Freelancer submitted proposal
- `proposal_accepted` - Your proposal was accepted
- `proposal_rejected` - Your proposal was declined
- `new_message` - New chat message
- `payment_received` - Payment completed
- `payment_sent` - Payment sent
- `milestone_completed` - Project milestone done
- `review_received` - New review/rating
- `account_update` - Account or profile changes
- `system_alert` - System maintenance or updates

---

## Testing the UI

After inserting notifications:

1. **Check Dashboard Header**
   - Look for the bell icon 🔔
   - Should show notification count badge

2. **Click Bell Icon**
   - Dropdown should show recent notifications
   - Unread notifications highlighted

3. **Mark as Read**
   ```sql
   UPDATE notifications 
   SET is_read = true 
   WHERE user_id = 'YOUR_USER_ID' AND id = 'NOTIFICATION_ID';
   ```

4. **Delete Notification**
   ```sql
   DELETE FROM notifications 
   WHERE id = 'NOTIFICATION_ID';
   ```

5. **Clear All Notifications**
   ```sql
   DELETE FROM notifications 
   WHERE user_id = 'YOUR_USER_ID';
   ```

---

## Example: Complete Test Scenario

```sql
-- Step 1: Get your user ID
SELECT id, email FROM users WHERE email = 'your@email.com';

-- Step 2: Insert 5 different test notifications
INSERT INTO notifications (user_id, type, title, message, data, is_read) VALUES
  -- Unread discount offer
  ('YOUR_USER_ID', 'discount_offer', '🎉 New Year Sale!', 'Get 50% off premium features', '{"code": "NY50", "expires": "2026-02-01"}', false),
  
  -- Unread job match
  ('YOUR_USER_ID', 'new_job', '💼 New Job Match', 'React Developer needed - $1000 budget', '{"job_id": "123"}', false),
  
  -- Unread message
  ('YOUR_USER_ID', 'new_message', '💬 New Message', 'Client sent you a message', '{"sender": "John"}', false),
  
  -- Read payment notification
  ('YOUR_USER_ID', 'payment_received', '💰 Payment Received', 'You received $500', '{"amount": 500}', true),
  
  -- Unread review
  ('YOUR_USER_ID', 'review_received', '⭐ 5-Star Review!', 'Client loved your work!', '{"rating": 5}', false);

-- Step 3: Verify notifications
SELECT id, type, title, is_read, created_at 
FROM notifications 
WHERE user_id = 'YOUR_USER_ID' 
ORDER BY created_at DESC;
```

---

## Pro Tips

1. **Use Emojis**: Make notifications visually appealing with emojis
2. **Keep Titles Short**: Max 50 characters for readability
3. **Action-Oriented Messages**: Tell users what they can do
4. **Use Data Field**: Store additional context (IDs, links, codes)
5. **Test Different States**: Test read/unread, old/new notifications

---

## Quick Commands Cheat Sheet

```sql
-- Get user ID
SELECT id, email FROM users WHERE email = 'your@email.com';

-- Quick discount notification
INSERT INTO notifications (user_id, type, title, message) 
VALUES ('YOUR_ID', 'discount_offer', '50% OFF!', 'Use code: SAVE50');

-- Mark all as read
UPDATE notifications SET is_read = true WHERE user_id = 'YOUR_ID';

-- Delete old notifications (older than 30 days)
DELETE FROM notifications 
WHERE user_id = 'YOUR_ID' AND created_at < NOW() - INTERVAL '30 days';

-- Count unread notifications
SELECT COUNT(*) FROM notifications 
WHERE user_id = 'YOUR_ID' AND is_read = false;
```

---

## Next Steps

After testing notifications manually, you can implement:
- Real-time notifications with Supabase Realtime subscriptions
- Email notifications using Supabase Edge Functions
- Push notifications for mobile apps
- Notification preferences/settings page
