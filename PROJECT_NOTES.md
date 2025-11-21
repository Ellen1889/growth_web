# Growth Garden - Project Documentation

## 🌱 Project Overview
A personal digital garden website showcasing experiments, reviews, newsletter, knowledge base, and tools - all powered by Notion databases.

**Live Site:** https://ellens-growth.vercel.app
**GitHub:** https://github.com/Ellen1889/growth_web

---

## 📋 What We Built

### Features:
- ✅ Dashboard with overview of all content
- ✅ Experiments log with AI hypothesis generator
- ✅ Content reviews library (books, videos, podcasts, articles)
- ✅ Newsletter/blog posts
- ✅ Knowledge base (marketing terms and concepts)
- ✅ Tools & tech stack showcase

### Tech Stack:
- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS
- **Database:** Notion (via @notionhq/client)
- **AI:** Google Gemini (for experiment hypothesis generation)
- **Deployment:** Vercel
- **Version Control:** GitHub

---

## 🔧 Setup & Configuration

### Environment Variables
Located in `.env.local` (NOT committed to git):

```env
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID_NEWSLETTER=your_newsletter_database_id
NOTION_DATABASE_ID_EXPERIMENTS=your_experiments_database_id
NOTION_DATABASE_ID_REVIEWS=your_reviews_database_id
NOTION_DATABASE_ID_KNOWLEDGE=your_knowledge_database_id
NOTION_DATABASE_ID_TOOLS=your_tools_database_id
```

**Note:** Your actual values are in `.env.local` (local) and Vercel Environment Variables (production)

**⚠️ Important:** These same variables must be added in Vercel → Project Settings → Environment Variables

### Notion Database Structure

#### Newsletter Database Properties:
- Title (title)
- Excerpt (rich text)
- Date (date)
- Cover Image (files)
- Category (multi-select) - displays as tags
- URL (url) - for "Read Full Article" link

#### Experiments Database Properties:
- Name (title)
- Problem (rich text)
- Hypothesis (rich text)
- Status (select: Running/Success/Failed/Inconclusive)
- Metric (rich text)
- Result Summary (rich text)
- Date (date) - optional for sorting

#### Reviews Database Properties:
- Title (title)
- Author (rich text)
- Rating (number)
- Takeaways (multi-select)
- Type (select: Video/Podcast/Article/Book)
- Tags (multi-select)
- URL (url)
- Cover Image (files)

#### Knowledge Base Properties:
- Term (title)
- Definition (rich text)
- Category (select)
- Formula (rich text) - optional
- Long Description (rich text) - optional

#### Tools Database Properties:
- Name (title)
- Description (rich text)
- Category (select)
- URL (url)
- Icon (files)
- Price (select: Free/Freemium/Paid)

---

## 📁 Project Structure

```
growth-garden/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page (server component with revalidation)
│   ├── components/
│   │   ├── DashboardClient.tsx # Main client component with all views
│   │   └── ExperimentGenerator.tsx # AI hypothesis generator
│   ├── lib/
│   │   └── notion.ts           # Notion API integration
│   ├── services/
│   │   └── geminiService.ts    # Google Gemini AI integration
│   └── types.ts                # TypeScript interfaces
├── .env.local                  # Environment variables (NOT in git)
├── package.json
└── PROJECT_NOTES.md            # This file
```

---

## 🔄 How Auto-Updates Work

### Notion Content Updates:
- **Automatic!** No code changes needed
- Data revalidates every 60 seconds
- Just update Notion → wait 60 seconds → refresh browser

### Code/Design Changes:
```bash
# 1. Make your changes
# 2. Commit and push:
git add .
git commit -m "Description of changes"
git push

# 3. Vercel auto-deploys in ~1-2 minutes
```

### Changing Revalidation Time:
In `src/app/page.tsx`, line 5:
```typescript
export const revalidate = 60; // Change to 30, 10, etc. for faster updates
```

---

## 🐛 Common Issues & Solutions

### Issue: Notion data not updating
**Solution:**
1. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
2. Wait 60 seconds for revalidation
3. Check Notion API key is correct in Vercel environment variables

### Issue: Build errors about Notion properties
**Solution:**
- Check that property names in `src/lib/notion.ts` match your Notion database exactly
- Property names are case-sensitive
- Add optional chaining (`?.`) for optional properties

### Issue: Newsletter categories showing "General"
**Solution:**
- Ensure Category property in Notion is **multi-select** (not select)
- Code expects: `props.Category.multi_select` (line 82 in notion.ts)

### Issue: Cover images not centered
**Solution:**
- Uses `object-contain` for centered images
- See `src/components/DashboardClient.tsx` line 320

---

## 🚀 Deployment Checklist

1. ✅ Code pushed to GitHub
2. ✅ Vercel connected to GitHub repo
3. ✅ Environment variables added in Vercel
4. ✅ Custom domain set: ellens-growth.vercel.app
5. ✅ Auto-revalidation configured (60s)
6. ✅ Old domain redirects to new

---

## 📝 Important Files to Know

### `src/lib/notion.ts`
- All Notion API calls
- Data fetching functions
- Error handling with try-catch
- Returns empty arrays on error (graceful degradation)

### `src/components/DashboardClient.tsx`
- Main client component
- All view logic (Dashboard, Newsletter, Reviews, etc.)
- Navigation and UI state

### `src/app/page.tsx`
- Server component
- Fetches all data from Notion
- Revalidation configuration
- Passes data to DashboardClient

---

## 🔑 Key Lessons Learned

1. **File Organization:** Everything in `src/` directory for Next.js best practices
2. **Notion Client Version:** Use v2.2.15 (not v5.x) for compatibility
3. **Environment Variables:** Database names must match exactly (REVIEWS not CONTENTREVIEWS)
4. **Multi-select vs Select:** Different property types in Notion need different code
5. **Revalidation:** Required for dynamic Notion content updates
6. **Error Handling:** Always add try-catch to prevent build failures

---

## 📞 Support Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Notion API Docs:** https://developers.notion.com
- **Vercel Docs:** https://vercel.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## 🎯 Future Improvements Ideas

- [ ] Add custom domain (buy from Namecheap/Google Domains)
- [ ] Implement search functionality
- [ ] Add filtering/sorting options
- [ ] Create individual pages for each content type
- [ ] Add analytics (Vercel Analytics or Google Analytics)
- [ ] Implement dark mode
- [ ] Add RSS feed for newsletter
- [ ] Create shareable experiment cards
- [ ] Add reading progress indicators

---

**Last Updated:** November 21, 2025
**Created with:** Claude Code
