#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BUSINESS_SKILLS = [{
  name: 'startup-metrics.md',
  content: `# Startup Metrics

Track and optimize key metrics: MRR, ARR, churn, LTV, CAC, payback period, burn multiple, net dollar retention.

## Formulas
- MRR = ∑(subscription revenue per month)
- Churn Rate = customers lost / customers at start
- LTV = ARPU × Gross Margin / Churn Rate
- CAC = total sales & marketing / new customers acquired
- Payback Period = CAC / (MRR per customer × Gross Margin)
`,
}, {
  name: 'growth-strategy.md',
  content: `# Growth Strategy

Frameworks for product-led growth, viral loops, referral programs, and PLG motions.

## Channels
- PLG (Product-Led Growth)
- Community-Led Growth
- Sales-Led Growth
- API-Led Growth

## Loops
- Viral loop: user invites → friend joins → friend invites more
- Content loop: publish → rank → attract → convert
- Sales loop: demo → close → expand → refer
`,
}, {
  name: 'pricing-optimization.md',
  content: `# Pricing Optimization

Value-based pricing, tier design, packaging strategy, and price anchoring.

## Models
- Tiered (Free / Pro / Enterprise)
- Per-seat vs Usage-based
- Flat vs Tiered volume
- Freemium with conversion triggers

## Metrics
- Conversion rate per tier
- Expansion MRR
- Contraction MRR
- Average Revenue Per Account (ARPA)
`,
}, {
  name: 'market-sizing.md',
  content: `# Market Sizing

TAM / SAM / SOM estimation with top-down and bottom-up approaches.

## TAM (Total Addressable Market)
Top-down: total global spend in category
Bottom-up: total potential customers × average revenue

## SAM (Serviceable Addressable Market)
Segment of TAM reachable by product/geography

## SOM (Serviceable Obtainable Market)
Realistic capture in 3-5 years based on team, capital, distribution
`,
}, {
  name: 'competitive-landscape.md',
  content: `# Competitive Landscape

Competitive analysis frameworks: Porter's Five Forces, SWOT, positioning maps.

## Dimensions
- Feature matrix comparison
- Pricing comparison
- G2/Capterra review analysis
- Funding and team analysis
- Distribution channel analysis

## Output
- Positioning map (2x2 grid)
- Feature gap analysis
- Pricing comparison table
- Go-to-market differentiation
`,
}, {
  name: 'product-discovery.md',
  content: `# Product Discovery

Customer interviews, JTBD framework, problem validation, solution interviews.

## Process
1. Define hypothesis
2. Recruit 5-10 target users
3. Problem interview (no solution mentioned)
4. Solution interview (with mock/prototype)
5. Synthesize findings
6. Pivot or proceed

## Signals
- Strong: user has tried to solve this manually
- Medium: user pays for current solution
- Weak: user says "interesting"
`,
}, {
  name: 'fundraising-prep.md',
  content: `# Fundraising Preparation

Pitch deck, financial model, data room, investor targeting, cap table management.

## Deck Sections
1. Problem (1 slide)
2. Solution (1 slide)
3. Market size (1 slide)
4. Product (2-3 slides)
5. Traction (2-3 slides)
6. Business model (1 slide)
7. Competition (1 slide)
8. Team (1 slide)
9. Ask (1 slide)

## Key Metrics
- Month-over-month growth
- Revenue (MRR/ARR)
- Gross margin
- CAC and LTV
- Burn multiple
- Runway
`,
}, {
  name: 'hiring-interviews.md',
  content: `# Hiring & Interviewing

Structured hiring process: scorecards, rubrics, take-home tests, culture add.

## Process
1. Screen (30 min) - resume + brief call
2. Technical (60 min) - skills assessment
3. Team (45 min) - collaboration / culture
4. Executive (30 min) - vision alignment

## Rubrics
- Technical: 1-4 scale on coding, architecture, debugging
- Behavioral: 1-4 scale on communication, ownership, growth
- Every interviewer scores independently before discussion
`,
}];

const AGENCY_AGENTS = [{
  name: 'venture-capitalist.md',
  role: 'Venture Capitalist',
  expertise: 'fundraising, pitch decks, cap tables, valuations, term sheets',
}, {
  name: 'product-marketer.md',
  role: 'Product Marketing Manager',
  expertise: 'positioning, messaging, launches, competitive analysis, GTM strategy',
}, {
  name: 'customer-support-lead.md',
  role: 'Customer Support Lead',
  expertise: 'ticketing workflows, SLAs, knowledge base, CSAT, escalation',
}, {
  name: 'data-analyst.md',
  role: 'Data Analyst',
  expertise: 'SQL, dashboards, funnels, cohort analysis, A/B test analysis',
}, {
  name: 'chief-of-staff.md',
  role: 'Chief of Staff',
  expertise: 'OKRs, prioritization, async communication, meeting facilitation',
}, {
  name: 'recruiter.md',
  role: 'Recruiter',
  expertise: 'sourcing, screening, interview process, offers, negotiation',
}, {
  name: 'legal-counsel.md',
  role: 'Legal Counsel',
  expertise: 'terms of service, privacy policy, IP, compliance, data processing',
}, {
  name: 'financial-analyst.md',
  role: 'Financial Analyst',
  expertise: 'financial modeling, budgeting, forecasting, unit economics',
}];

function main() {
  const skillsDir = path.join(__dirname, '..', 'skills');
  const agentsDir = path.join(__dirname, '..', 'agents');

  let imported = 0;
  for (const sk of BUSINESS_SKILLS) {
    const fp = path.join(skillsDir, sk.name);
    if (!fs.existsSync(fp)) {
      fs.writeFileSync(fp, sk.content);
      imported++;
    }
  }

  for (const ag of AGENCY_AGENTS) {
    const fp = path.join(agentsDir, ag.name);
    if (!fs.existsSync(fp)) {
      const content = `# ${ag.role}

## Role
${ag.role}

## Expertise
${ag.expertise}

## Behavior
- Think step by step
- Provide data-backed recommendations
- Flag risks and assumptions
- Ask clarifying questions when needed
`;
      fs.writeFileSync(fp, content);
      imported++;
    }
  }

  console.log(JSON.stringify({ status: 'ok', imported }));
}

if (require.main === module) main();
module.exports = { BUSINESS_SKILLS, AGENCY_AGENTS };
