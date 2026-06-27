
# Product Requirements Document (PRD)

## OnmiRank Blog — Content Management System
## GEO Education & Affiliate Monetization Platform

**Version**: 1.0  
**Date**: June 27, 2026  
**Author**: Product Team (Solo Founder + AI Co-Builder)  
**Status**: Ready for Development  
**Default Language**: English (with Indonesian localization support)  
**Domain**: omnirank.web.id/blog

---

## 1. DOCUMENT CONTROL

### 1.1 Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-06-27 | Product Team | Initial PRD for Blog CMS MVP |

### 1.2 Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | [Founder] | TBD | — |
| Tech Lead | [Founder] | TBD | — |

---

## 2. EXECUTIVE SUMMARY

### 2.1 Product Vision

OnmiRank Blog is a **developer-first content management system** built as an integrated module within the OnmiRank platform (omnirank.web.id/blog). It serves dual purposes: (1) **GEO education hub** that drives organic traffic through high-quality, AI-search-optimized content, and (2) **affiliate monetization engine** that generates revenue through strategic integration of SEO/GEO tool recommendations.

Unlike traditional WordPress blogs, OnmiRank Blog is built with **Next.js + MDX** to deliver blazing-fast performance, perfect Core Web Vitals, and native schema markup generation — all critical for GEO (Generative Engine Optimization) visibility.

### 2.2 Problem Statement

**The Content-Affiliate Gap:**
- Most affiliate blogs use WordPress (slow, plugin-bloated, poor Core Web Vitals)
- AI search engines prioritize fast, well-structured, schema-rich content
- Developer-built tools often separate their blog from their product (fragmented brand, lost authority)
- Existing CMS solutions don't natively support GEO-optimized content structures (answer-first, SCUs, evidence density)
- Affiliate link management is manual and error-prone

**For OnmiRank Specifically:**
- Need a blog that **synergizes** with the GEO audit tool (not competes)
- Need content that **ranks in both Google AND AI search** (ChatGPT, Perplexity, Gemini)
- Need **automated affiliate link insertion** across 30+ articles
- Need **lead capture integration** with OnmiRank tool (free audit CTA)

### 2.3 Solution Overview

OnmiRank Blog provides:
1. **MDX-Based Content Authoring** — Write in Markdown + embed React components
2. **Auto Schema Generation** — Article, FAQPage, HowTo, ComparisonTable schemas auto-injected
3. **GEO-Optimized Content Structure** — Built-in templates for answer-first, SCU, evidence-based writing
4. **Affiliate Link Management** — Centralized affiliate database with auto-insertion and tracking
5. **Lead Magnet System** — Gated content (PDFs, templates) with email capture
6. **Newsletter Integration** — ConvertKit/Mailchimp API for subscriber management
7. **Analytics Dashboard** — Track views, affiliate clicks, conversions, email captures

### 2.4 Success Criteria

| Metric | Target (M1) | Target (M3) | Target (M6) |
|--------|-------------|-------------|-------------|
| Articles Published | 12 | 30 | 60 |
| Monthly Blog Visitors | 500 | 3,000 | 10,000 |
| Email Subscribers | 100 | 800 | 2,500 |
| Affiliate Clicks | 50 | 500 | 2,000 |
| Affiliate Conversions | 2 | 25 | 100 |
| Affiliate Revenue | $40 | $500 | $2,000/mo |
| OnmiRank Tool Signups (from blog) | 30 | 300 | 1,000 |
| Average Page Load Time | <1.5s | <1.2s | <1.0s |
| Core Web Vitals (all green) | 100% | 100% | 100% |

---

## 3. MARKET ANALYSIS

### 3.1 Target Audience for Blog Content

**Primary Readers:**
1. **Solo Developers / Indie Hackers** (Global)
   - Search: "how to get cited by ChatGPT", "GEO optimization"
   - Pain: Invisible in AI search despite good products

2. **Digital Marketers** (Indonesia + SEA)
   - Search: "GEO vs SEO", "AI search optimization"
   - Pain: Clients asking why they're not in ChatGPT

3. **Content Creators** (Global)
   - Search: "content structure for AI", "how to write AI-friendly content"
   - Pain: Quality content not cited by AI engines

4. **SEO Professionals** (Global)
   - Search: "schema markup for AI", "llms.txt guide"
   - Pain: SEO knowledge outdated for AI search era

### 3.2 Content Differentiation

| Aspect | Typical SEO Blog | OnmiRank Blog |
|--------|-----------------|---------------|
| **Content Focus** | Google rankings only | Google + AI search (GEO) |
| **Structure** | Keyword-stuffed | Answer-first, SCU, evidence-based |
| **Schema** | Basic Article | Article + FAQPage + HowTo + ComparisonTable |
| **Speed** | WordPress (2-4s) | Next.js (<1s) |
| **Affiliate Integration** | Banner ads | Contextual, educational |
| **Tool Integration** | None | Embedded OnmiRank audit widget |
| **Lead Capture** | Generic popup | GEO-specific lead magnets |

### 3.3 Competitive Content Analysis

| Competitor Blog | Domain Authority | Content Quality | GEO Focus | Speed |
|-----------------|-----------------|----------------|-----------|-------|
| Backlinko (Brian Dean) | 90 | High | Partial | Medium |
| Moz Blog | 88 | High | No | Medium |
| Ahrefs Blog | 85 | High | No | Medium |
| Search Engine Land | 82 | High | Partial | Fast |
| Surfer SEO Blog | 65 | Medium | No | Medium |
| **OnmiRank Blog** | **New** | **High** | **100%** | **Blazing** |

---

## 4. USER PERSONAS

### 4.1 Persona: "ReaderRachel" — Blog Visitor

```
Name: Rachel
Age: 29
Location: Singapore
Role: Digital Marketing Manager
Income: $3,500/month

Goals:
- Learn GEO strategies to offer new services
- Find tools that actually work (not just hype)
- Get actionable insights, not theory

Pain Points:
- "Most SEO blogs just repeat the same basics"
- "I need content that works for AI search, not just Google"
- "I hate blogs that are just affiliate link farms"

Behavior:
- Reads 2-3 articles before making a decision
- Skims for actionable takeaways
- Values data and case studies
- Will click affiliate links if trust is established

OnmiRank Blog Value:
- GEO-specific content she can't find elsewhere
- Embedded tool to test concepts immediately
- Honest tool recommendations with real use cases
```

---

## 5. PRODUCT REQUIREMENTS

### 5.1 Feature Overview

| Feature | Priority | MVP | Release |
|---------|----------|-----|---------|
| MDX Content Rendering | P0 | Yes | MVP |
| Auto Schema Generation | P0 | Yes | MVP |
| Article Listing Page | P0 | Yes | MVP |
| Article Detail Page | P0 | Yes | MVP |
| Category/Tag System | P0 | Yes | MVP |
| Affiliate Link Management | P0 | Yes | MVP |
| Lead Magnet System | P0 | Yes | MVP |
| Email Capture Forms | P0 | Yes | MVP |
| Search Functionality | P1 | Yes | MVP |
| Related Articles | P1 | Yes | MVP |
| Table of Contents (Auto) | P1 | Yes | MVP |
| Reading Time Estimation | P1 | Yes | MVP |
| Social Sharing | P1 | Yes | MVP |
| Newsletter Integration | P1 | Yes | MVP |
| Analytics Dashboard | P1 | No | v1.1 |
| Comment System | P2 | No | v1.1 |
| Content Series/Collections | P2 | No | v1.1 |
| RSS Feed | P2 | No | v1.1 |
| Multi-language Support | P2 | No | v1.2 |
| AI Content Assistant | P3 | No | v1.3 |

### 5.2 Detailed Feature Specifications

#### 5.2.1 MDX Content Rendering (P0)

**User Story:**
> As a content author, I want to write blog articles in Markdown with embedded React components so that I can create rich, interactive content without complex coding.

**Acceptance Criteria:**

1. **MDX File Structure**
   - Each article is a `.mdx` file in `/content/blog/` directory
   - Frontmatter metadata at top of file:
     ```yaml
     ---
     title: "What is Generative Engine Optimization (GEO)?"
     description: "Complete guide to GEO for 2026"
     date: "2026-06-30"
     author: "Ardyan Permana"
     category: "GEO Fundamentals"
     tags: ["GEO", "AI Search", "SEO"]
     featured: true
     coverImage: "/images/blog/geo-guide-cover.jpg"
     readingTime: 12
     affiliateLinks: ["surfer-seo", "notion-ai"]
     schema: ["Article", "FAQPage"]
     ---
     ```

2. **MDX Component Library**
   Built-in components available in MDX files:
   - `<AffiliateLink tool="surfer-seo" text="optimize content" />` — Contextual affiliate link
   - `<LeadMagnet type="checklist" title="GEO Checklist" />` — Gated content CTA
   - `<OnmiRankAuditCTA />` — Embedded free audit widget
   - `<ComparisonTable data={...} />` — SEO-friendly comparison table
   - `<FAQ items={...} />` — FAQ schema-compatible accordion
   - `<StatBox value="84%" label="brands invisible" />` — Highlighted statistics
   - `<TweetEmbed id="..." />` — Embedded tweet
   - `<YouTubeEmbed id="..." />` — Embedded video
   - `<CodeBlock language="json">{...}</CodeBlock>` — Syntax-highlighted code
   - `<Callout type="tip|warning|info">{...}</Callout>` — Styled callout boxes

3. **Rendering Pipeline**
   - MDX files compiled at build time (SSG)
   - Syntax highlighting via Shiki
   - Images optimized via Next.js Image component
   - Lazy loading for below-fold content
   - Table of Contents auto-generated from H2/H3 headings

4. **Content Validation**
   - Pre-build validation: required frontmatter fields
   - Link validation: check all internal/external links
   - Image validation: ensure referenced images exist
   - Affiliate link validation: ensure tool exists in database

---

#### 5.2.2 Auto Schema Generation (P0)

**User Story:**
> As a content author, I want schema markup (JSON-LD) to be automatically generated for each article so that AI search engines can properly understand and cite my content.

**Acceptance Criteria:**

1. **Automatic Schema Detection**
   System auto-detects which schemas to apply based on content:
   - All articles: `Article` schema
   - Articles with `<FAQ>` component: `FAQPage` schema
   - Articles with `<ComparisonTable>`: `ComparisonTable` schema
   - Articles with step-by-step instructions: `HowTo` schema
   - Articles mentioning Organization: `Organization` schema

2. **Article Schema Fields**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Article",
     "headline": "Article Title",
     "description": "Meta description",
     "author": {
       "@type": "Person",
       "name": "Ardyan Permana",
       "url": "https://omnirank.web.id/about"
     },
     "publisher": {
       "@type": "Organization",
       "name": "OnmiRank",
       "logo": {
         "@type": "ImageObject",
         "url": "https://omnirank.web.id/logo.png"
       }
     },
     "datePublished": "2026-06-30",
     "dateModified": "2026-06-30",
     "mainEntityOfPage": {
       "@type": "WebPage",
       "@id": "https://omnirank.web.id/blog/article-slug"
     },
     "image": "https://omnirank.web.id/images/blog/cover.jpg"
   }
   ```

3. **FAQPage Schema Fields**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "FAQPage",
     "mainEntity": [
       {
         "@type": "Question",
         "name": "What is GEO?",
         "acceptedAnswer": {
           "@type": "Answer",
           "text": "GEO stands for..."
         }
       }
     ]
   }
   ```

4. **HowTo Schema Fields**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "HowTo",
     "name": "How to Write llms.txt",
     "step": [
       {
         "@type": "HowToStep",
         "name": "Create the file",
         "text": "Create a file named llms.txt...",
         "url": "https://omnirank.web.id/blog/how-to-write-llms-txt#step-1"
       }
     ]
   }
   ```

5. **Schema Injection**
   - Schemas rendered as `<script type="application/ld+json">` in `<head>`
   - Multiple schemas can coexist on same page
   - Validation against Schema.org standards before build

---

#### 5.2.3 Article Listing Page (P0)

**User Story:**
> As a blog visitor, I want to browse all articles with filtering and pagination so that I can find content relevant to my interests.

**Acceptance Criteria:**

1. **Blog Homepage (`/blog`)**
   - Hero section: Featured article (large card)
   - Category pills: Filter by category (GEO Fundamentals, Technical, Case Studies, etc.)
   - Article grid: 3-column on desktop, 2 on tablet, 1 on mobile
   - Each card shows:
     - Cover image (16:9, lazy loaded)
     - Category badge
     - Title (max 2 lines)
     - Excerpt (max 120 chars)
     - Reading time
     - Date
     - Author avatar + name
   - Pagination or infinite scroll
   - "Load more" button (preferred over pagination for SEO)

2. **Category Pages (`/blog/category/[slug]`)**
   - Same layout as blog homepage
   - Filtered to category
   - Category description at top
   - Breadcrumb: Home > Blog > Category Name

3. **Tag Pages (`/blog/tag/[slug]`)**
   - Same layout, filtered by tag
   - Tag description at top

4. **Author Pages (`/blog/author/[slug]`)**
   - Author bio, photo, social links
   - All articles by author

5. **SEO Requirements**
   - Unique title: "[Category] Articles | OnmiRank Blog"
   - Meta description per category
   - Canonical URL
   - Pagination with `rel="next"` / `rel="prev"`

---

#### 5.2.4 Article Detail Page (P0)

**User Story:**
> As a blog visitor, I want to read articles in a clean, fast, readable format with related content suggestions so that I stay engaged longer.

**Acceptance Criteria:**

1. **Article Header**
   - Breadcrumb: Home > Blog > Category > Article Title
   - Category badge (clickable)
   - Title (H1)
   - Meta: Author + Date + Reading Time + Last Updated
   - Cover image (full-width, optimized)
   - Social share buttons (Twitter, LinkedIn, Facebook, Copy Link)

2. **Article Body**
   - Clean typography (serif or sans-serif, 18-20px base)
   - Max-width: 720px (optimal reading width)
   - Line height: 1.7
   - Paragraph spacing: 1.5em
   - H2/H3 with anchor links
   - Auto-generated Table of Contents (sticky sidebar on desktop)
   - Inline affiliate links (styled subtly)
   - Lead magnet CTAs (strategically placed)
   - OnmiRank audit CTA (after 50% scroll)
   - Code blocks with copy button
   - Images with captions and alt text
   - Blockquotes styled distinctly

3. **Article Footer**
   - Tags (clickable)
   - Author bio card with photo and social links
   - "Was this helpful?" feedback widget
   - Newsletter signup form
   - Related articles (3-5, based on category + tags)
   - Prev/Next article navigation

4. **Sticky Elements**
   - Table of Contents (desktop sidebar)
   - Progress bar (top of viewport)
   - "Back to top" button (after scrolling down)

5. **SEO Requirements**
   - Unique title: "Article Title | OnmiRank Blog"
   - Meta description from frontmatter
   - OG tags for social sharing
   - Twitter Card tags
   - Canonical URL
   - Auto-generated schema (Article, FAQPage, HowTo as applicable)

---

#### 5.2.5 Affiliate Link Management (P0)

**User Story:**
> As a content author, I want to manage affiliate links centrally so that I can update URLs across all articles without editing each file.

**Acceptance Criteria:**

1. **Affiliate Database**
   Centralized config file `/config/affiliates.ts`:
   ```typescript
   export const affiliates = {
     "surfer-seo": {
       name: "Surfer SEO",
       url: "https://surferseo.com/?fpr=onmirank",
       displayText: "Surfer SEO",
       description: "Content optimization tool",
       commission: "25% recurring",
       active: true
     },
     "notion-ai": {
       name: "Notion AI",
       url: "https://notion.so/product/ai?ref=onmirank",
       displayText: "Notion AI",
       description: "AI-powered workspace",
       commission: "50% first year",
       active: true
     },
     "writesonic": {
       name: "Writesonic",
       url: "https://writesonic.com?ref=onmirank",
       displayText: "Writesonic",
       description: "AI writing assistant",
       commission: "30% recurring",
       active: true
     }
   };
   ```

2. **MDX Affiliate Component**
   ```mdx
   I use <AffiliateLink tool="surfer-seo">Surfer SEO</AffiliateLink> 
   to optimize my content structure.
   ```
   Renders as:
   ```html
   <a href="https://surferseo.com/?fpr=onmirank" 
      rel="nofollow sponsored" 
      target="_blank"
      data-affiliate="surfer-seo">
     Surfer SEO
   </a>
   ```

3. **Auto-Insertion Rules**
   - First mention of tool name in article → auto-convert to affiliate link
   - Max 3 affiliate links per article (to avoid spam signal)
   - Links open in new tab
   - All affiliate links have `rel="nofollow sponsored"`
   - Affiliate disclosure auto-appended to articles with affiliate links

4. **Affiliate Disclosure**
   - Auto-generated notice at top of article:
     > "This article contains affiliate links. We only recommend tools we genuinely use and believe in."
   - Link to full disclosure page
   - Compliant with FTC and Indonesian advertising regulations

5. **Click Tracking**
   - Each affiliate click logged to database
   - Track: article, tool, timestamp, user (if authenticated)
   - Dashboard view: clicks per tool, clicks per article, CTR

---

#### 5.2.6 Lead Magnet System (P0)

**User Story:**
> As a blog visitor, I want to download free resources (templates, checklists) in exchange for my email so that I can get more value while the blog grows its audience.

**Acceptance Criteria:**

1. **Lead Magnet Types**
   - PDF downloads (checklists, guides, templates)
   - Notion templates
   - Code snippets/libraries
   - Spreadsheets
   - Email courses

2. **Lead Magnet Database**
   ```typescript
   export const leadMagnets = {
     "geo-checklist": {
       title: "The Complete GEO Checklist 2026",
       description: "25 actionable steps to optimize for AI search",
       type: "pdf",
       fileUrl: "/downloads/geo-checklist.pdf",
       thumbnail: "/images/lead-magnets/checklist.jpg",
       category: "GEO Fundamentals",
       emailRequired: true
     },
     "llms-templates": {
       title: "llms.txt Template Pack",
       description: "10 ready-to-use templates for any niche",
       type: "zip",
       fileUrl: "/downloads/llms-templates.zip",
       thumbnail: "/images/lead-magnets/llms.jpg",
       category: "Technical",
       emailRequired: true
     }
   };
   ```

3. **MDX Lead Magnet Component**
   ```mdx
   <LeadMagnet 
     slug="geo-checklist" 
     placement="inline"
   />
   ```
   Renders as styled CTA box with:
   - Thumbnail image
   - Title + description
   - Email input field
   - "Download Free" button
   - Privacy note: "No spam, unsubscribe anytime"

4. **Gating Logic**
   - User enters email → validated → added to ConvertKit
   - Download link emailed (or direct download if configured)
   - If user already subscribed → direct download
   - Track downloads per lead magnet

5. **Placement Strategy**
   - Inline: Within article content (after key sections)
   - Sticky: Bottom-right corner (desktop)
   - Exit-intent: Modal when user tries to leave
   - End of article: After conclusion
   - Sidebar: Sticky (desktop)

---

#### 5.2.7 Email Capture Forms (P0)

**User Story:**
> As a blog visitor, I want to subscribe to the newsletter so that I receive new GEO insights without visiting the blog.

**Acceptance Criteria:**

1. **Newsletter Signup Form**
   - Fields: Email (required), Name (optional)
   - Placement:
     - End of every article
     - Blog homepage sidebar
     - Dedicated `/newsletter` page
     - Sticky footer banner (optional)
   - Design: Clean, minimal, branded

2. **Integration**
   - ConvertKit API (primary)
   - Mailchimp API (backup)
   - Webhook on signup → add to database
   - Double opt-in (configurable)

3. **Welcome Sequence**
   - Email 1 (immediate): Welcome + lead magnet delivery
   - Email 2 (Day 2): Best GEO resources
   - Email 3 (Day 5): OnmiRank tool introduction + free audit
   - Email 4 (Day 7): Case study
   - Email 5 (Day 10): Affiliate product recommendation (soft)

4. **Segmentation**
   - Tag by lead magnet downloaded
   - Tag by article category read
   - Tag by engagement level

---

#### 5.2.8 Search Functionality (P1)

**User Story:**
> As a blog visitor, I want to search for specific topics so that I can quickly find relevant content.

**Acceptance Criteria:**

1. **Search Input**
   - Prominent search bar in header
   - Keyboard shortcut: `/` to focus
   - Placeholder: "Search GEO guides, tutorials..."

2. **Search Implementation**
   - Client-side search using Fuse.js or Pagefind
   - Index: title, description, content, tags
   - Results: title, excerpt with highlighted terms, date
   - Max 10 results, "View all" link

3. **Search Page (`/blog/search?q=...`)**
   - Full search results page
   - Filter by category
   - Sort by relevance/date
   - No results state with suggestions

---

#### 5.2.9 Related Articles (P1)

**User Story:**
> As a blog visitor, I want to see related articles at the end of each post so that I can continue learning.

**Acceptance Criteria:**

1. **Related Algorithm**
   - Primary: Same category
   - Secondary: Shared tags
   - Tertiary: Content similarity (TF-IDF or embedding)
   - Exclude current article
   - Max 5 articles

2. **Display**
   - Horizontal scroll (mobile) or grid (desktop)
   - Same card design as article listing
   - "You might also like" heading

---

#### 5.2.10 Table of Contents (P1)

**User Story:**
> As a blog visitor, I want a table of contents so that I can navigate long articles easily.

**Acceptance Criteria:**

1. **Auto-Generation**
   - Extracted from H2 and H3 headings
   - Nested structure (H3 under H2)
   - Anchor links to each section

2. **Display**
   - Desktop: Sticky sidebar (right side)
   - Mobile: Collapsible dropdown at top of article
   - Highlight current section on scroll
   - Smooth scroll on click

3. **Schema Integration**
   - HowTo schema steps linked to TOC items

---

### 5.3 Non-Functional Requirements

#### 5.3.1 Performance

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| First Contentful Paint (FCP) | <1.0s | Lighthouse |
| Largest Contentful Paint (LCP) | <1.5s | Lighthouse |
| Time to Interactive (TTI) | <2.0s | Lighthouse |
| Cumulative Layout Shift (CLS) | <0.05 | Lighthouse |
| Total Blocking Time (TBT) | <100ms | Lighthouse |
| Page Load (3G) | <3s | Lighthouse |
| Core Web Vitals | All green | Google Search Console |

#### 5.3.2 SEO Requirements

- **SSG (Static Site Generation)**: All pages pre-rendered at build time
- **Dynamic Sitemap**: Auto-generated `/sitemap.xml` with all articles
- **RSS Feed**: `/rss.xml` for feed readers
- **Robots.txt**: Optimized for AI crawlers
- **Canonical URLs**: Every page has self-referencing canonical
- **Hreflang**: For future multi-language support
- **OG Images**: Auto-generated social preview images
- **Structured Data**: JSON-LD for all applicable schemas

#### 5.3.3 Accessibility

- WCAG 2.1 Level AA compliance
- Keyboard navigation for all interactive elements
- Screen reader friendly (ARIA labels, semantic HTML)
- Color contrast ratio >4.5:1
- Focus indicators visible
- Alt text for all images
- Skip to content link

#### 5.3.4 Security

- No user input rendering (MDX is build-time only)
- CSP headers configured
- Affiliate links use `rel="nofollow sponsored"`
- Email validation on forms
- Rate limiting on API endpoints
- No sensitive data in client-side code

---

## 6. USER INTERFACE / USER EXPERIENCE

### 6.1 Information Architecture

```
omnirank.web.id/blog
├── / (Blog Homepage)
│   ├── Featured Article
│   ├── Category Filters
│   ├── Article Grid
│   └── Newsletter CTA
│
├── /category/[slug] (Category Pages)
│   ├── Category Header
│   └── Filtered Article Grid
│
├── /tag/[slug] (Tag Pages)
│   ├── Tag Header
│   └── Filtered Article Grid
│
├── /author/[slug] (Author Pages)
│   ├── Author Bio
│   └── Author's Articles
│
├── /[slug] (Article Detail)
│   ├── Article Header
│   ├── Table of Contents
│   ├── Article Body (MDX)
│   ├── Lead Magnets
│   ├── Affiliate CTAs
│   ├── Author Bio
│   ├── Related Articles
│   └── Newsletter Signup
│
├── /search (Search Results)
│   └── Search Results Grid
│
└── /newsletter (Newsletter Page)
    ├── Value Proposition
    ├── Sample Content
    └── Signup Form
```

### 6.2 Key Screen Designs

#### 6.2.1 Blog Homepage

**Layout:**
```
[Header: Logo | Nav | Search | CTA]
[Hero: Featured Article (full-width, large image)]
[Category Pills: All | GEO Fundamentals | Technical | Case Studies | ...]
[Article Grid: 3 columns]
  [Card] [Card] [Card]
  [Card] [Card] [Card]
[Load More Button]
[Newsletter Section]
[Footer]
```

**Card Design:**
- Image: 16:9, rounded corners, hover zoom effect
- Category badge: Top-left of image
- Title: 2 lines max, bold, hover color change
- Excerpt: 2 lines, muted color
- Meta: Reading time + Date, small text

#### 6.2.2 Article Detail Page

**Layout:**
```
[Header]
[Breadcrumb]
[Article Header: Category | Title | Meta | Cover Image]
[Content Area: 720px max-width, centered]
  [Table of Contents - Sticky Sidebar (desktop)]
  [Article Body]
  [Lead Magnet CTA]
  [Affiliate CTA]
  [Author Bio]
  [Related Articles: 3 columns]
  [Newsletter Signup]
[Footer]
```

---

## 7. TECHNICAL ARCHITECTURE

### 7.1 Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Framework** | Next.js 15 (App Router) | SSG, SSR, familiar stack, SEO-optimized |
| **Language** | TypeScript | Type safety, maintainability |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid development, consistent design |
| **Content** | MDX (next-mdx-remote) | Markdown + React components |
| **Syntax Highlighting** | Shiki | Fast, beautiful code blocks |
| **Search** | Pagefind / Fuse.js | Client-side, no backend needed |
| **Images** | Next.js Image + Cloudflare R2 | Optimization, CDN, zero egress |
| **Schema** | Custom utilities | Auto-generate JSON-LD |
| **Email** | ConvertKit API / Mailchimp | Newsletter management |
| **Analytics** | PostHog + Plausible | Privacy-friendly, product analytics |
| **Hosting** | Vercel | Edge network, automatic deployment |
| **CMS (Headless)** | Git-based (MDX files) | Version control, no database needed for content |

### 7.2 Project Structure

```
omnirank/
├── app/
│   ├── (blog)/
│   │   ├── blog/
│   │   │   ├── page.tsx                 # Blog homepage
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx             # Article detail
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx         # Category page
│   │   │   ├── tag/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx         # Tag page
│   │   │   ├── author/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx         # Author page
│   │   │   ├── search/
│   │   │   │   └── page.tsx             # Search page
│   │   │   └── newsletter/
│   │   │       └── page.tsx             # Newsletter page
│   │   └── layout.tsx                   # Blog layout
│   ├── api/
│   │   ├── newsletter/
│   │   │   └── subscribe/route.ts       # Newsletter API
│   │   └── affiliate/
│   │       └── click/route.ts           # Affiliate click tracking
│   └── layout.tsx                       # Root layout
│
├── content/
│   └── blog/
│       ├── what-is-geo.mdx
│       ├── geo-vs-seo.mdx
│       ├── how-to-write-llms-txt.mdx
│       └── ... (30 articles)
│
├── components/
│   ├── blog/
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleGrid.tsx
│   │   ├── ArticleHeader.tsx
│   │   ├── TableOfContents.tsx
│   │   ├── RelatedArticles.tsx
│   │   ├── NewsletterSignup.tsx
│   │   ├── LeadMagnet.tsx
│   │   ├── AffiliateLink.tsx
│   │   ├── AuthorBio.tsx
│   │   ├── CategoryPills.tsx
│   │   ├── SearchBar.tsx
│   │   └── Breadcrumb.tsx
│   ├── mdx/
│   │   ├── Callout.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── ComparisonTable.tsx
│   │   ├── FAQ.tsx
│   │   ├── StatBox.tsx
│   │   ├── TweetEmbed.tsx
│   │   └── YouTubeEmbed.tsx
│   └── ui/                              # shadcn/ui components
│
├── lib/
│   ├── mdx.ts                           # MDX parsing utilities
│   ├── schema.ts                        # Schema generation
│   ├── affiliates.ts                    # Affiliate config
│   ├── lead-magnets.ts                  # Lead magnet config
│   ├── search.ts                        # Search indexing
│   └── analytics.ts                     # Analytics utilities
│
├── config/
│   ├── site.ts                          # Site config
│   └── navigation.ts                    # Nav links
│
├── public/
│   ├── images/
│   │   └── blog/                        # Blog images
│   ├── downloads/                       # Lead magnet files
│   └── og/                              # OG images
│
├── types/
│   ├── blog.ts                          # Blog type definitions
│   └── mdx.ts                           # MDX type definitions
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 7.3 Content Processing Pipeline

```
MDX File (content/blog/*.mdx)
    │
    ▼
[Parse Frontmatter] → Metadata extraction
    │
    ▼
[Parse MDX] → next-mdx-remote
    │
    ▼
[Apply Components] → Custom MDX components
    │
    ▼
[Generate Schema] → JSON-LD based on content
    │
    ▼
[Build Page] → Static HTML (SSG)
    │
    ▼
[Deploy] → Vercel CDN
```

### 7.4 API Endpoints

```
Newsletter:
  POST /api/newsletter/subscribe
    Body: { email: string, name?: string, leadMagnet?: string }
    Response: { success: boolean, message: string }

Affiliate Tracking:
  POST /api/affiliate/click
    Body: { tool: string, article: string, url: string }
    Response: { success: boolean }

Search:
  GET /api/search?q={query}
    Response: { results: SearchResult[] }
```

---

## 8. CONTENT MANAGEMENT WORKFLOW

### 8.1 Authoring Flow

```
1. Create new file: content/blog/article-slug.mdx
2. Add frontmatter metadata
3. Write content in Markdown + MDX components
4. Add affiliate links via <AffiliateLink> component
5. Add lead magnets via <LeadMagnet> component
6. Commit to Git
7. Push to repository
8. Vercel auto-deploys
9. Article live in <2 minutes
```

### 8.2 Content Validation (Pre-build)

```
1. Check required frontmatter fields
2. Validate affiliate tool references
3. Check image file existence
4. Validate internal links
5. Check schema compatibility
6. Generate OG image if missing
7. Build fails if validation errors
```

---

## 9. AFFILIATE INTEGRATION DETAIL

### 9.1 Affiliate Configuration

```typescript
// config/affiliates.ts
export interface Affiliate {
  id: string;
  name: string;
  url: string;
  displayText: string;
  description: string;
  commission: string;
  category: string;
  active: boolean;
  utmParams?: Record<string, string>;
}

export const affiliates: Record<string, Affiliate> = {
  "surfer-seo": {
    id: "surfer-seo",
    name: "Surfer SEO",
    url: "https://surferseo.com",
    displayText: "Surfer SEO",
    description: "Content optimization and SEO tool",
    commission: "25% recurring",
    category: "SEO Tools",
    active: true,
    utmParams: { ref: "onmirank", utm_source: "blog" }
  },
  "notion-ai": {
    id: "notion-ai",
    name: "Notion AI",
    url: "https://notion.so/product/ai",
    displayText: "Notion AI",
    description: "AI-powered workspace and planning",
    commission: "50% first year",
    category: "Productivity",
    active: true
  },
  "writesonic": {
    id: "writesonic",
    name: "Writesonic",
    url: "https://writesonic.com",
    displayText: "Writesonic",
    description: "AI writing assistant",
    commission: "30% recurring",
    category: "AI Writing",
    active: true
  }
};
```

### 9.2 Affiliate Link Component

```tsx
// components/blog/AffiliateLink.tsx
interface AffiliateLinkProps {
  tool: string;
  children: React.ReactNode;
  className?: string;
}

export function AffiliateLink({ tool, children, className }: AffiliateLinkProps) {
  const affiliate = affiliates[tool];
  if (!affiliate || !affiliate.active) {
    return <span className={className}>{children}</span>;
  }

  const url = new URL(affiliate.url);
  Object.entries(affiliate.utmParams || {}).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return (
    <a
      href={url.toString()}
      target="_blank"
      rel="nofollow sponsored"
      data-affiliate={tool}
      className={cn("text-blue-600 hover:underline", className)}
      onClick={() => trackAffiliateClick(tool)}
    >
      {children}
      <ExternalLink className="inline w-3 h-3 ml-0.5" />
    </a>
  );
}
```

---

## 10. LEAD MAGNET SYSTEM DETAIL

### 10.1 Lead Magnet Configuration

```typescript
// config/lead-magnets.ts
export interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "zip" | "notion" | "email-course";
  fileUrl: string;
  thumbnail: string;
  category: string;
  emailRequired: boolean;
  convertKitTag?: string;
}

export const leadMagnets: Record<string, LeadMagnet> = {
  "geo-checklist": {
    id: "geo-checklist",
    title: "The Complete GEO Checklist 2026",
    description: "25 actionable steps to optimize your brand for AI search engines",
    type: "pdf",
    fileUrl: "/downloads/geo-checklist-2026.pdf",
    thumbnail: "/images/lead-magnets/checklist-thumb.jpg",
    category: "GEO Fundamentals",
    emailRequired: true,
    convertKitTag: "lead-magnet-checklist"
  },
  "llms-templates": {
    id: "llms-templates",
    title: "llms.txt Template Pack",
    description: "10 ready-to-use llms.txt templates for any niche or industry",
    type: "zip",
    fileUrl: "/downloads/llms-templates.zip",
    thumbnail: "/images/lead-magnets/llms-thumb.jpg",
    category: "Technical",
    emailRequired: true,
    convertKitTag: "lead-magnet-llms"
  },
  "schema-snippets": {
    id: "schema-snippets",
    title: "Schema.org JSON-LD Snippet Library",
    description: "50+ copy-paste schema snippets for maximum AI citation",
    type: "zip",
    fileUrl: "/downloads/schema-snippets.zip",
    thumbnail: "/images/lead-magnets/schema-thumb.jpg",
    category: "Technical",
    emailRequired: true,
    convertKitTag: "lead-magnet-schema"
  }
};
```

### 10.2 Lead Magnet Component

```tsx
// components/blog/LeadMagnet.tsx
interface LeadMagnetProps {
  slug: string;
  placement?: "inline" | "sidebar" | "banner";
}

export function LeadMagnet({ slug, placement = "inline" }: LeadMagnetProps) {
  const magnet = leadMagnets[slug];
  if (!magnet) return null;

  return (
    <div className={cn(
      "rounded-xl border bg-gradient-to-br from-blue-50 to-indigo-50 p-6",
      placement === "banner" && "my-8",
      placement === "sidebar" && "sticky top-24"
    )}>
      <div className="flex gap-4">
        <img src={magnet.thumbnail} alt={magnet.title} className="w-20 h-20 rounded-lg object-cover" />
        <div>
          <h3 className="font-bold text-lg">{magnet.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{magnet.description}</p>
        </div>
      </div>
      <LeadMagnetForm magnetId={magnet.id} />
    </div>
  );
}
```

---

## 11. DEPLOYMENT PLAN

### 11.1 Environment Strategy

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| Development | `feature/*` | localhost:3000 | Local development |
| Preview | PR | `*.vercel.app` | PR preview |
| Staging | `develop` | staging.omnirank.web.id | Pre-production testing |
| Production | `main` | omnirank.web.id | Live |

### 11.2 MVP Launch Checklist (Blog Module)

**Week 1: Foundation**
- [ ] Setup `/blog` route in Next.js
- [ ] Install MDX dependencies (next-mdx-remote, shiki)
- [ ] Create content directory structure
- [ ] Setup Tailwind + shadcn/ui for blog
- [ ] Create base layout components

**Week 2: Core Features**
- [ ] Article listing page
- [ ] Article detail page with MDX rendering
- [ ] Table of contents component
- [ ] Category/tag system
- [ ] Related articles
- [ ] Search functionality

**Week 3: Monetization**
- [ ] Affiliate link system
- [ ] Lead magnet components
- [ ] Newsletter signup forms
- [ ] Email integration (ConvertKit)
- [ ] Affiliate click tracking

**Week 4: Polish & Launch**
- [ ] Auto schema generation
- [ ] OG image generation
- [ ] Sitemap + RSS
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Publish first 3 articles
- [ ] Launch announcement

---

## 12. METRICS & ANALYTICS

### 12.1 Blog-Specific Metrics

| Metric | Tool | Target |
|--------|------|--------|
| Page views | PostHog | Track growth |
| Unique visitors | PostHog | Track reach |
| Average time on page | PostHog | >3 minutes |
| Bounce rate | PostHog | <60% |
| Scroll depth | PostHog | >70% reach bottom |
| Article shares | PostHog | Track per article |
| Affiliate clicks | Custom + PostHog | Track per tool/article |
| Affiliate conversions | Affiliate dashboard | Track revenue |
| Email signups | ConvertKit | Track growth |
| Lead magnet downloads | Custom + ConvertKit | Track per magnet |
| OnmiRank tool signups | PostHog | Track from blog |
| Search queries | Pagefind analytics | Track popular topics |

### 12.2 Dashboard Views

**Content Performance:**
- Top articles by views
- Top articles by affiliate clicks
- Top articles by email signups
- Articles needing update (old, low traffic)

**Affiliate Performance:**
- Clicks per tool
- CTR per article
- Revenue per tool
- Best performing content

**Audience Growth:**
- Email subscribers over time
- Lead magnet downloads
- Newsletter open/click rates
- Subscriber source attribution

---

## 13. RISKS & MITIGATION

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Build time increases with many articles | Medium | Medium | ISR for listing pages, optimize MDX compilation |
| Affiliate program rejections | Medium | High | Apply to multiple programs, focus on own products |
| Low organic traffic initially | High | High | Build-in-public distribution, paid promotion budget |
| Content creation bottleneck | High | High | Batch writing, AI assistance, guest contributors |
| MDX learning curve | Low | Low | Simple components, good documentation |
| Git-based CMS too technical | Low | Low | Create simple CLI tool for new article scaffolding |

---

## 14. FUTURE ROADMAP

### 14.1 Version Timeline

| Version | Timeline | Features |
|---------|----------|----------|
| **Blog MVP** | Month 1 | MDX rendering, schema, affiliate, lead magnets |
| **v1.1** | Month 2 | Comments, analytics dashboard, content series |
| **v1.2** | Month 3 | Multi-language (ID/EN), RSS, API access |
| **v1.3** | Month 4 | AI content assistant, auto-summarize, auto-tag |
| **v1.4** | Month 5 | Video embed optimization, podcast support |
| **v2.0** | Month 6 | Headless CMS UI (non-technical authors), collaboration |

### 14.2 Long-Term Vision

1. **OnmiRank Media**: Expand beyond blog to YouTube, podcast, newsletter
2. **Community Platform**: Forum/Q&A for GEO practitioners
3. **Certification Program**: GEO certification course
4. **Marketplace**: Buy/sell GEO-optimized content templates
5. **API**: Content API for third-party integrations

---

## 15. APPENDICES

### 15.1 Glossary

| Term | Definition |
|------|------------|
| **MDX** | Markdown + JSX — allows React components in Markdown |
| **SSG** | Static Site Generation — pre-render pages at build time |
| **Frontmatter** | YAML metadata at top of MDX files |
| **Schema** | Structured data (JSON-LD) for search engines |
| **Lead Magnet** | Free resource offered in exchange for email |
| **Affiliate Link** | Tracked link that earns commission on sales |
| **OG Image** | Open Graph image for social media sharing |
| **TOC** | Table of Contents |
| **SCU** | Self-Contained Unit — standalone content block |
| **ISR** | Incremental Static Regeneration |

### 15.2 Sample MDX Article

```mdx
---
title: "What is Generative Engine Optimization (GEO)?"
description: "Complete guide to GEO for 2026"
date: "2026-06-30"
author: "Ardyan Permana"
category: "GEO Fundamentals"
tags: ["GEO", "AI Search", "SEO", "ChatGPT"]
featured: true
coverImage: "/images/blog/geo-guide-cover.jpg"
readingTime: 12
affiliateLinks: ["surfer-seo", "notion-ai"]
schema: ["Article", "FAQPage"]
---

# What is Generative Engine Optimization (GEO)?

Generative Engine Optimization (GEO) is the practice of optimizing your content and website to be discovered, cited, and trusted by AI search engines like ChatGPT, Perplexity, Gemini, and Claude.

<StatBox value="84%" label="of brands are invisible to AI search" />

## Why GEO Matters in 2026

Traditional SEO focuses on ranking in Google. But AI search is different:

- **60% of AI searches end without a click**
- Only **16% of brands appear** in AI-generated answers
- AI traffic converts at **14.2%** — nearly 5x organic

I use <AffiliateLink tool="surfer-seo">Surfer SEO</AffiliateLink> alongside GEO strategies for maximum visibility.

## The 3 Pillars of GEO

### 1. Technical Signals
Your robots.txt, schema markup, and AI-specific files...

### 2. Content Structure
Answer-first format, self-contained units, evidence density...

### 3. Brand Entity
NAP consistency, third-party presence, authority signals...

<LeadMagnet slug="geo-checklist" />

## FAQ

<FAQ items={[
  { question: "Is GEO replacing SEO?", answer: "No, GEO complements SEO..." },
  { question: "How long does GEO take to work?", answer: "Typically 4-12 weeks..." }
]} />

<OnmiRankAuditCTA />

---

*Want to track your GEO progress? <AffiliateLink tool="notion-ai">Plan your strategy in Notion</AffiliateLink> and monitor with OnmiRank.*
```

### 15.3 Reference Links

- **Next.js MDX**: https://nextjs.org/docs/app/building-your-application/configuring/mdx
- **next-mdx-remote**: https://github.com/hashicorp/next-mdx-remote
- **Shiki**: https://shiki.style/
- **Pagefind**: https://pagefind.app/
- **Schema.org**: https://schema.org/
- **ConvertKit API**: https://developers.convertkit.com/

---

## NOTES FOR GEMINI/AI CO-BUILDER

1. **This is a module**, not a separate project. It lives inside the existing OnmiRank Next.js app at `/blog`.

2. **Content is git-based**, not database-based. Articles are MDX files in `/content/blog/`.

3. **All pages must be SSG** (Static Site Generation) for optimal SEO and speed.

4. **Schema markup is auto-generated** based on MDX components used, not manually written.

5. **Affiliate links are centralized** in config — never hardcode affiliate URLs in articles.

6. **Lead magnets are also centralized** — easy to add new ones without code changes.

7. **The blog must feel integrated** with the tool, not separate. Use same design system, same colors, same typography.

8. **Performance is critical** — every millisecond counts for both Google and AI search rankings.

---

*End of PRD*

**Document Owner**: [Founder Name]  
**Last Updated**: June 27, 2026  
**Next Review**: July 27, 2026 (post-MVP launch)
