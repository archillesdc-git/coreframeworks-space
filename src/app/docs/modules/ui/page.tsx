export const metadata = {
    title: "UI Module - ArchillesDC Docs",
    description: "Pre-built UI components documentation",
};

export default function UiModulePage() {
    return (
        <article className="max-w-none prose prose-invert">
            <h1 className="text-4xl font-bold mb-4 text-white">UI Module</h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Pre-styled, accessible UI components ready to use.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Component Groups</h2>
            <div className="overflow-x-auto mb-8 rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                        <tr><th className="px-4 py-3 font-medium">Group</th><th className="px-4 py-3 font-medium">Components</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-gray-300">
                        <tr><td className="px-4 py-3 font-medium text-white">UI Essentials</td><td className="px-4 py-3">Button, Input, Card, Badge, Avatar, Spinner</td></tr>
                        <tr><td className="px-4 py-3 font-medium text-white">Feedback</td><td className="px-4 py-3">Toast, Modal, Alert, Tooltip</td></tr>
                        <tr><td className="px-4 py-3 font-medium text-white">Navigation</td><td className="px-4 py-3">Sidebar, Header, Navbar, Tabs</td></tr>
                        <tr><td className="px-4 py-3 font-medium text-white">Data Display</td><td className="px-4 py-3">Table, Stats, List</td></tr>
                        <tr><td className="px-4 py-3 font-medium text-white">Forms</td><td className="px-4 py-3">Select, Checkbox, Textarea, Switch</td></tr>
                        <tr><td className="px-4 py-3 font-medium text-white">Layout</td><td className="px-4 py-3">Container, Grid, Divider</td></tr>
                    </tbody>
                </table>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Button</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { Button } from "@/components/ui/button";

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Loading state
<Button loading>Saving...</Button>

// Disabled
<Button disabled>Disabled</Button>`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Input</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { Input } from "@/components/ui/input";

// Basic
<Input placeholder="Enter email" />

// With label
<Input label="Email" placeholder="you@example.com" />

// With error
<Input 
  label="Password" 
  type="password"
  error="Password is required" 
/>`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Card</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>

// Glass variant
<Card variant="glass">
  <CardContent>Glassmorphism effect</CardContent>
</Card>`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Badge</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Avatar</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { Avatar } from "@/components/ui/avatar";

// With image
<Avatar src="/avatar.jpg" alt="User" />

// With fallback
<Avatar fallback="JD" />

// Sizes
<Avatar src="/avatar.jpg" size="sm" />
<Avatar src="/avatar.jpg" size="md" />
<Avatar src="/avatar.jpg" size="lg" />`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Toast</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { useToast, ToastProvider } from "@/components/ui/toast";

// Wrap your app with ToastProvider
function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}

// Use the hook
function Component() {
  const { addToast } = useToast();

  const handleClick = () => {
    addToast("Saved successfully!", "success");
    addToast("Something went wrong", "error");
    addToast("Please review", "warning");
    addToast("New update available", "info");
  };
}`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Modal</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { Modal } from "@/components/ui/modal";
import { useState } from "react";

function Component() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      
      <Modal 
        open={open} 
        onClose={() => setOpen(false)}
        title="Confirm Action"
      >
        <p>Are you sure you want to continue?</p>
        <div className="flex gap-2 mt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button>Confirm</Button>
        </div>
      </Modal>
    </>
  );
}`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Table</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { Table } from "@/components/ui/table";

const data = [
  { id: "1", name: "John", email: "john@example.com" },
  { id: "2", name: "Jane", email: "jane@example.com" },
];

const columns = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { 
    key: "id", 
    header: "Actions",
    render: (_, row) => (
      <Button size="sm" variant="ghost">Edit</Button>
    ),
  },
];

<Table data={data} columns={columns} />`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">StatCard</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { StatCard } from "@/components/ui/stats";

<StatCard 
  title="Total Users"
  value="1,234"
  change={12.5}
  icon={<UsersIcon />}
/>`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Form Components</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { Select, Checkbox, Textarea } from "@/components/ui";

// Select
<Select
  label="Country"
  options={[
    { label: "USA", value: "us" },
    { label: "UK", value: "uk" },
  ]}
/>

// Checkbox
<Checkbox label="I agree to terms" />

// Textarea
<Textarea 
  label="Description"
  placeholder="Enter description..."
/>`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">Layout Components</h2>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { Sidebar, Header, Container } from "@/components/layout";

// Sidebar with navigation
<Sidebar
  items={[
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings", href: "/settings" },
  ]}
  logo={<Logo />}
/>

// Header
<Header user={session.user} />

// Container
<Container size="lg">
  <Content />
</Container>`}</pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-white">cn Utility</h2>
            <p className="text-gray-400 mb-4">Merge Tailwind classes conditionally:</p>
            <div className="bg-[#12121a] rounded-lg border border-white/10 p-4 mb-8 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300">{`import { cn } from "@/utils/cn";

<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "large" && "text-lg"
)}>
  Content
</div>`}</pre>
            </div>
        </article>
    );
}
