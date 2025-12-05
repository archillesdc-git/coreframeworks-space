# Components Reference

Complete documentation for all UI components.

## UI Essentials

### Button

A versatile button component with multiple variants.

```tsx
import { Button } from "@/components/ui/button";
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger"` | `"primary"` | Button style |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| `loading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable button |
| `className` | `string` | - | Additional classes |

#### Examples

```tsx
// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Saving...</Button>
<Button disabled>Disabled</Button>

// With icon
<Button>
  <PlusIcon className="h-4 w-4 mr-2" />
  Add Item
</Button>
```

---

### Input

Text input with label and error states.

```tsx
import { Input } from "@/components/ui/input";
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `error` | `string` | - | Error message |
| `className` | `string` | - | Additional classes |
| `...props` | `InputHTMLAttributes` | - | Standard input props |

#### Examples

```tsx
// Basic
<Input placeholder="Enter email" />

// With label
<Input label="Email" type="email" placeholder="you@example.com" />

// With error
<Input 
  label="Password" 
  type="password"
  error="Password must be at least 8 characters" 
/>

// Controlled
const [value, setValue] = useState("");
<Input 
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

### Card

Container component with variants.

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "glass"` | `"default"` | Card style |
| `className` | `string` | - | Additional classes |

#### Examples

```tsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
</Card>

// Glass variant
<Card variant="glass">
  <CardContent>
    Glassmorphism effect
  </CardContent>
</Card>

// Custom styling
<Card className="hover:border-primary-500 transition-colors">
  <CardContent>Interactive card</CardContent>
</Card>
```

---

### Badge

Status badges for labels.

```tsx
import { Badge } from "@/components/ui/badge";
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "success" \| "warning" \| "error" \| "info"` | `"default"` | Badge color |
| `className` | `string` | - | Additional classes |

#### Examples

```tsx
<Badge>Default</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">New</Badge>
```

---

### Avatar

User avatar with fallback.

```tsx
import { Avatar } from "@/components/ui/avatar";
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string \| null` | - | Image URL |
| `alt` | `string` | - | Alt text |
| `fallback` | `string` | - | Fallback text (initials) |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Avatar size |

#### Examples

```tsx
// With image
<Avatar src="/avatar.jpg" alt="John Doe" />

// With fallback
<Avatar alt="John Doe" fallback="JD" />

// Sizes
<Avatar src="/avatar.jpg" size="sm" />
<Avatar src="/avatar.jpg" size="md" />
<Avatar src="/avatar.jpg" size="lg" />

// From user object
<Avatar 
  src={user.image} 
  alt={user.name || "User"} 
  fallback={user.name?.charAt(0)} 
/>
```

---

### Spinner

Loading spinner indicator.

```tsx
import { Spinner } from "@/components/ui/spinner";
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Spinner size |
| `className` | `string` | - | Additional classes |

#### Examples

```tsx
<Spinner />
<Spinner size="sm" />
<Spinner size="lg" />
<Spinner className="text-white" />
```

---

## Feedback Components

### Toast

Toast notification system.

```tsx
import { ToastProvider, useToast } from "@/components/ui/toast";
```

#### Setup

```tsx
// layout.tsx
export default function Layout({ children }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
```

#### Usage

```tsx
function MyComponent() {
  const { addToast } = useToast();

  const handleSave = () => {
    addToast("Saved successfully!", "success");
  };

  const handleError = () => {
    addToast("Something went wrong", "error");
  };

  return (
    <Button onClick={handleSave}>Save</Button>
  );
}
```

#### Toast Types

| Type | Color | Usage |
|------|-------|-------|
| `success` | Green | Success messages |
| `error` | Red | Error messages |
| `warning` | Yellow | Warning messages |
| `info` | Blue | Info messages |

---

### Modal

Modal dialog component.

```tsx
import { Modal } from "@/components/ui/modal";
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Modal visibility |
| `onClose` | `() => void` | - | Close handler |
| `title` | `string` | - | Modal title |
| `children` | `ReactNode` | - | Modal content |

#### Examples

```tsx
const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Open Modal</Button>

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Delete"
>
  <p>Are you sure you want to delete this item?</p>
  
  <div className="flex justify-end gap-2 mt-6">
    <Button variant="ghost" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </div>
</Modal>
```

---

## Data Display

### Table

Generic data table component.

```tsx
import { Table } from "@/components/ui/table";
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Array of data items |
| `columns` | `Column<T>[]` | Column definitions |
| `className` | `string` | Additional classes |

#### Column Definition

```ts
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}
```

#### Examples

```tsx
const users = [
  { id: "1", name: "John", email: "john@example.com", role: "admin" },
  { id: "2", name: "Jane", email: "jane@example.com", role: "user" },
];

const columns = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { 
    key: "role", 
    header: "Role",
    render: (role) => <Badge variant={role === "admin" ? "info" : "default"}>{role}</Badge>
  },
  {
    key: "id",
    header: "Actions",
    render: (_, row) => (
      <Button size="sm" variant="ghost" onClick={() => handleEdit(row.id)}>
        Edit
      </Button>
    ),
  },
];

<Table data={users} columns={columns} />
```

---

### StatCard

Statistics card for dashboards.

```tsx
import { StatCard } from "@/components/ui/stats";
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Stat title |
| `value` | `string \| number` | Main value |
| `change` | `number` | Percentage change |
| `icon` | `ReactNode` | Optional icon |

#### Examples

```tsx
<div className="grid grid-cols-4 gap-4">
  <StatCard title="Total Users" value="1,234" change={12.5} />
  <StatCard title="Revenue" value="$45,678" change={-2.3} />
  <StatCard title="Orders" value="892" change={8.1} />
  <StatCard title="Conversion" value="3.2%" change={0.5} />
</div>
```

---

## Form Components

### Select

Select dropdown component.

```tsx
import { Select } from "@/components/ui/select";
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Select label |
| `options` | `{ label: string; value: string }[]` | Options |
| `error` | `string` | Error message |

#### Examples

```tsx
<Select
  label="Country"
  options={[
    { label: "United States", value: "us" },
    { label: "United Kingdom", value: "uk" },
    { label: "Canada", value: "ca" },
  ]}
/>
```

---

### Checkbox

Checkbox input component.

```tsx
import { Checkbox } from "@/components/ui/checkbox";
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Checkbox label |
| `...props` | `InputHTMLAttributes` | Standard checkbox props |

#### Examples

```tsx
<Checkbox label="Remember me" />
<Checkbox label="I agree to the terms" required />

// Controlled
const [checked, setChecked] = useState(false);
<Checkbox 
  label="Subscribe" 
  checked={checked} 
  onChange={(e) => setChecked(e.target.checked)} 
/>
```

---

### Textarea

Multi-line text input.

```tsx
import { Textarea } from "@/components/ui/textarea";
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Textarea label |
| `error` | `string` | Error message |
| `...props` | `TextareaHTMLAttributes` | Standard textarea props |

#### Examples

```tsx
<Textarea label="Description" placeholder="Enter description..." />
<Textarea label="Bio" rows={5} maxLength={500} />
```

---

## Layout Components

### Sidebar

Collapsible sidebar navigation.

```tsx
import { Sidebar } from "@/components/layout/sidebar";
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `items` | `NavItem[]` | Navigation items |
| `logo` | `ReactNode` | Logo component |

#### NavItem

```ts
interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
}
```

#### Examples

```tsx
<Sidebar
  logo={<span className="font-bold">MyApp</span>}
  items={[
    { label: "Dashboard", href: "/dashboard", icon: <HomeIcon /> },
    { label: "Users", href: "/users", icon: <UsersIcon /> },
    { label: "Settings", href: "/settings", icon: <SettingsIcon /> },
  ]}
/>
```

---

### Header

Page header component.

```tsx
import { Header } from "@/components/layout/header";
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `user` | `{ name?: string; image?: string }` | User data |

#### Examples

```tsx
<Header user={session?.user} />
```

---

### Container

Content container with max-width.

```tsx
import { Container } from "@/components/ui/container";
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | `"lg"` | Max width |
| `className` | `string` | - | Additional classes |

#### Examples

```tsx
<Container size="md">
  <Content />
</Container>
```

---

## Utilities

### cn (Class Names)

Merge Tailwind classes conditionally.

```tsx
import { cn } from "@/utils/cn";
```

#### Examples

```tsx
<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "large" && "text-lg",
  className // allow override
)}>
  Content
</div>
```
