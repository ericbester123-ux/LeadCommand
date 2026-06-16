# LeadCommand Production Launch Checklist

Use this path to move LeadCommand from local testing to production.

## 1. Push Latest Code To GitHub

Make sure the latest local LeadCommand code is uploaded to:

```text
ericbester123-ux/LeadCommand
```

## 2. Deploy On Vercel

Go to Vercel and create a new project from the GitHub repository.

Vercel should detect Next.js automatically.

## 3. Add Environment Variables In Vercel

Add the production values from `.env.local` into Vercel Project Settings:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
LEADCOMMAND_ADMIN_EMAILS=
```

Add GHL, Retell, and Meta values later if needed.

## 4. Confirm Supabase Is Ready

In Supabase:

- Confirm the SQL schema has been run.
- Create your admin user.
- Create a test client user.
- Confirm your admin email is listed in `LEADCOMMAND_ADMIN_EMAILS`.
- Make sure email/password login is enabled.

## 5. Set Supabase Auth URL Settings

In Supabase, go to:

```text
Authentication > URL Configuration
```

Add the Vercel production URL, for example:

```text
https://leadcommand.vercel.app
```

Also add the same URL to allowed redirect URLs if Supabase asks for it.

## 6. Test Production

Open the Vercel URL and test:

- Admin login works.
- Client login works.
- Client users cannot see Settings.
- Admin users can see Settings and the client switcher.
- GHL connection test passes.
- Integration settings save correctly.

## 7. Add Custom Domain Later

Once stable, connect a branded domain such as:

```text
app.estateselevate.com
```

After adding the custom domain, update Supabase Auth URL settings again.

## Recommended Production Model

Use one hosted LeadCommand app managed by Estates Elevate.

Clients should log in through the hosted app. They should not receive source code, `.env` files, or direct database credentials.
