# ArchillesDC Roadmap

> The future vision for ArchillesDC framework.

## Current Version: v1.0.0 ✅

### Features Shipped
- ✅ CLI scaffolding tool
- ✅ 4 base templates (full-system, admin, dashboard, barebones)
- ✅ 6 system templates (POS, E-Commerce, Evaluation, Branch Management, BAC)
- ✅ Next.js 15 + React 19 + Tailwind v4
- ✅ Prisma ORM with multi-database support
- ✅ tRPC with type-safe APIs
- ✅ NextAuth.js with multiple providers
- ✅ Pre-built UI components
- ✅ Code generators (page, crud, api, module, component)
- ✅ Role-based access control
- ✅ Documentation website

---

## v1.1.0 - Charts & Analytics Module 📊

**Target:** Q1 2025

### Built-in Charts Module
```bash
archillesdc add charts
```

**Features:**
- Pre-configured chart components
- Recharts or Chart.js integration
- Dashboard widgets
- Real-time data visualization
- Export to PDF/PNG

**Components:**
- `LineChart` - Time series data
- `BarChart` - Comparisons
- `PieChart` - Proportions
- `AreaChart` - Trends
- `Sparkline` - Inline metrics
- `Heatmap` - Activity patterns

---

## v1.2.0 - AI Helper Module 🤖

**Target:** Q2 2025

### Built-in AI Integration
```bash
archillesdc add ai
```

**Features:**
- OpenAI/Anthropic/Groq integration
- Pre-built AI hooks and utilities
- Streaming responses
- Chat components
- Content generation helpers

**Capabilities:**
- `useAI()` hook for easy integration
- `<ChatInterface />` component
- `<AITextarea />` with autocomplete
- Content summarization
- Code generation
- Image generation (DALL-E)

**Example:**
```tsx
import { useAI } from "@/hooks/use-ai";

function MyComponent() {
  const { generate, isLoading } = useAI();
  
  const handleGenerate = async () => {
    const result = await generate("Write a product description for...");
    console.log(result);
  };
}
```

---

## v1.3.0 - Real-time WebSocket Module ⚡

**Target:** Q2 2025

### Built-in WebSocket Support
```bash
archillesdc add realtime
```

**Features:**
- WebSocket server setup
- Pusher/Ably integration option
- Real-time subscriptions
- Presence indicators
- Typing indicators

**Capabilities:**
- `useRealtime()` hook
- `<PresenceList />` component
- `<LiveCursor />` for collaboration
- Notifications system
- Live updates

**Example:**
```tsx
import { useRealtime } from "@/hooks/use-realtime";

function ChatRoom({ roomId }) {
  const { messages, send, presence } = useRealtime(`room:${roomId}`);
  
  return (
    <div>
      <PresenceList users={presence} />
      <MessageList messages={messages} />
      <MessageInput onSend={send} />
    </div>
  );
}
```

---

## v2.0.0 - Mobile App Generator 📱

**Target:** Q3 2025

### Expo React Native Support
```bash
archillesdc create my-mobile-app --mobile
# or
archillesdc generate mobile
```

**Features:**
- Expo SDK integration
- Shared components library
- Authentication sync
- API client sharing
- Push notifications

**Stack:**
- Expo SDK 51+
- React Native
- NativeWind (Tailwind for RN)
- React Navigation
- Expo Router

**Generated Structure:**
```
my-app/
├── apps/
│   ├── web/          # Next.js web app
│   └── mobile/       # Expo mobile app
├── packages/
│   ├── api/          # Shared tRPC client
│   ├── ui/           # Shared components
│   └── config/       # Shared config
```

---

## v2.1.0 - Plugin Marketplace 🔌

**Target:** Q4 2025

### Community Plugins
```bash
archillesdc plugin install @archillesdc/payments
archillesdc plugin install @archillesdc/email
archillesdc plugin install @archillesdc/storage
```

**Official Plugins:**
- `@archillesdc/payments` - Stripe, PayMongo
- `@archillesdc/email` - Resend, SendGrid
- `@archillesdc/storage` - S3, Cloudinary
- `@archillesdc/sms` - Twilio, Semaphore
- `@archillesdc/pdf` - PDF generation
- `@archillesdc/export` - Excel/CSV export

**Community Plugins:**
- Calendar integrations
- Social media posting
- Analytics (GA, Mixpanel)
- CMS integrations
- Payment gateways

---

## v3.0.0 - ArchillesDC Pro 💎

**Target:** 2026

### Premium Features

**Pro Templates:**
- SaaS Starter Kit
- Multi-tenant Applications
- Marketplace Platform
- Learning Management System
- Healthcare Management
- Hotel/Property Management
- Fleet Management
- CRM System

**Pro Features:**
- Advanced analytics dashboard
- White-label support
- Priority support
- Custom component library
- Design system builder
- CI/CD templates
- Deployment guides

**Pricing:**
- Individual: $99/year
- Team: $299/year
- Enterprise: Contact

---

## Long-term Vision 🚀

### 2025
- [ ] Charts & Analytics module
- [ ] AI integration module
- [ ] Real-time WebSocket support
- [ ] Mobile app generator
- [ ] Plugin system foundation

### 2026
- [ ] Plugin marketplace launch
- [ ] Pro version launch
- [ ] 50+ community plugins
- [ ] Visual template builder
- [ ] No-code admin panel generator

### 2027
- [ ] Full SaaS platform
- [ ] Multi-tenant architecture
- [ ] Kubernetes deployment templates
- [ ] Enterprise features
- [ ] Partner program

---

## Contributing 🤝

Want to help shape the future of ArchillesDC?

1. **Feature Requests** - Open an issue with `[FEATURE]` tag
2. **RFC Process** - Major features go through RFC
3. **Community Plugins** - Build and publish plugins
4. **Documentation** - Help improve docs
5. **Translations** - Help translate docs

---

## Feedback

Have ideas for the roadmap? 

- 📧 Email: roadmap@archillesdc.com
- 💬 Discord: [Join our server](https://discord.gg/archillesdc)
- 🐦 Twitter: [@archillesdc](https://twitter.com/archillesdc)
- 🐙 GitHub: [Discussions](https://github.com/archillesdc/core-framework/discussions)
