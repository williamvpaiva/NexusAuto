---
name: analytics
description: "When user wants to set up, improve, or audit analytics tracking and measurement. Also use when user mentions 'Google Analytics', 'GA4', 'event tracking', 'conversion tracking', 'analytics setup', or 'tracking plan'"
---

# Analytics - Event Tracking & Measurement

## When to Use
- User wants to set up analytics
- User mentions Google Analytics, GA4, or tracking
- User asks about event tracking
- User wants to measure conversions
- User needs help with a tracking plan

## Portuguese Triggers
- "setup Google Analytics"
- "GA4 configuração"
- "tracking de eventos"
- "conversões trackear"
- "setup analytics"
- "plano de eventos"
- "pixel do Facebook"
- "tracking plan"

## Analytics Setup Framework

### 1. Platform Selection

| Platform | Best For | Setup Complexity |
|----------|----------|-----------------|
| Google Analytics 4 | General web/mobile apps | Medium |
| Mixpanel | Product analytics, funnels | Medium |
| Amplitude | Product analytics | Medium |
| PostHog | Self-hosted, privacy-focused | High |
| Heap | Auto-capture events | Low |
| Plausible | Privacy-focused, simple | Low |

### 2. GA4 Implementation

#### Install Code (Website)
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### Install Code (GA4 via Google Tag Manager)
1. Create GTM container
2. Add GA4 Configuration tag
3. Set trigger to All Pages
4. Publish container

### 3. Essential Events to Track

#### E-commerce Events
| Event | When | Parameters |
|-------|------|------------|
| view_item | Product page viewed | items, value, currency |
| add_to_cart | Add to cart | items, value |
| begin_checkout | Checkout started | items, value |
| add_payment_info | Payment info added | payment type |
| purchase | Order completed | transaction_id, value, tax, shipping |

#### User Engagement Events
| Event | When | Parameters |
|-------|------|------------|
| page_view | Page loaded | page_location, page_title |
| scroll | 90% scroll depth | engagement_time_in_msec |
| video_start | Video started | video_id, video_title |
| search | Site search | search_term |
| file_download | File downloaded | file_name, file_extension |

#### Custom Events
```javascript
// Track custom event
gtag('event', 'share', {
  method: 'twitter',
  content_id: 'article-123'
});

// Track custom interaction
gtag('event', 'generate_lead', {
  source: 'newsletter',
  campaign: 'summer-sale'
});
```

### 4. Conversion Tracking

#### Google Ads Conversion
```javascript
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXXXX/XXXXXX',
  'value': 99.00,
  'currency': 'USD',
  'transaction_id': 'T12345'
});
```

#### Facebook Pixel
```javascript
fbq('track', 'Purchase', {
  value: 99.00,
  currency: 'USD',
  content_ids: ['product-123'],
  content_type: 'product'
});
```

### 5. Tracking Plan Template

```markdown
# Tracking Plan

## Business Objectives
1. [Objective] - [KPI to measure]
2. ...

## Key User Actions
| Action | Event Name | Parameters | Where |
|--------|------------|------------|-------|
| Sign up | sign_up | method, location | Form submit |
| First purchase | first_purchase | value, currency | Order complete |
| Subscription | subscribe | plan_name, value | Payment success |

## Event Taxonomy
- Category: Object (verb)
- Example: user.sign_up, item.view, cart.add

## Quality Checks
- [ ] All events have test coverage
- [ ] PII is not tracked
- [ ] Consent mechanisms in place
- [ ] Event naming is consistent
```

### 6. Analytics Best Practices

#### DO
- Track user actions, not page views (primary)
- Use consistent naming conventions
- Include relevant parameters/context
- Test events in debug mode
- Document all tracking

#### DON'T
- Track Personal Identifiable Information (PII)
- Track everything blindly
- Use generic event names (e.g., "click")
- Track without consent (GDPR/CCPA)

### 7. Debugging & QA

#### GA4 Debug Mode
1. Install GA Debugger Chrome extension
2. Enable debug view in GA4
3. Trigger events and verify
4. Check Real-time reports

#### Network Inspect
```javascript
// Check if events are firing
// Look for /collect endpoint in Network tab
// Verify event payload structure
```

## Related Skills
- ab-testing: For experiment tracking
- cro: For conversion optimization
- seo-audit: For measuring organic traffic impact