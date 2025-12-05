// Base template types
export type TemplateType = "full-system" | "admin" | "dashboard" | "barebones";

// Extended template types including system templates
export type ExtendedTemplateType = TemplateType |
    "pos" |
    "branch-management" |
    "evaluation" |
    "ecommerce" |
    "bac";

export interface SystemTemplateConfig {
    name: string;
    description: string;
    features: string[];
    models: string[];
    pages: string[];
    components: string[];
}

export const SYSTEM_TEMPLATES: Record<ExtendedTemplateType, SystemTemplateConfig> = {
    "full-system": {
        name: "Full System",
        description: "Complete application with all features",
        features: ["auth", "dashboard", "admin", "api", "crud"],
        models: ["User", "Post", "Category", "Tag", "Activity", "Notification", "Setting"],
        pages: ["dashboard", "admin", "settings", "profile"],
        components: ["all"],
    },
    "admin": {
        name: "Admin Dashboard",
        description: "Admin panel with data management",
        features: ["auth", "admin", "api", "tables"],
        models: ["User", "Activity", "Setting"],
        pages: ["dashboard", "users", "settings", "logs"],
        components: ["ui-essentials", "feedback", "data-display", "layout"],
    },
    "dashboard": {
        name: "Dashboard",
        description: "User dashboard with widgets",
        features: ["auth", "widgets", "api"],
        models: ["User", "Setting"],
        pages: ["dashboard", "settings", "profile"],
        components: ["ui-essentials", "feedback", "layout"],
    },
    "barebones": {
        name: "Barebones",
        description: "Minimal setup",
        features: ["auth"],
        models: ["User"],
        pages: ["home"],
        components: ["ui-essentials"],
    },
    "pos": {
        name: "POS System",
        description: "Point of Sale system for retail businesses",
        features: ["auth", "inventory", "sales", "reports", "receipts"],
        models: ["User", "Product", "Category", "Sale", "SaleItem", "Customer", "Payment", "Inventory"],
        pages: ["pos", "products", "sales", "customers", "reports", "settings"],
        components: ["all"],
    },
    "branch-management": {
        name: "Branch Management",
        description: "Multi-branch business management system",
        features: ["auth", "branches", "employees", "inventory", "reports"],
        models: ["User", "Branch", "Employee", "Inventory", "Transfer", "Report", "Activity"],
        pages: ["dashboard", "branches", "employees", "inventory", "transfers", "reports"],
        components: ["all"],
    },
    "evaluation": {
        name: "Evaluation System",
        description: "Teacher/Employee evaluation and ranking system",
        features: ["auth", "evaluations", "rankings", "reports", "analytics"],
        models: ["User", "Subject", "Criteria", "Evaluation", "Response", "Rating", "Period"],
        pages: ["dashboard", "evaluations", "subjects", "criteria", "reports", "rankings"],
        components: ["all"],
    },
    "ecommerce": {
        name: "E-Commerce",
        description: "Online store with cart and checkout",
        features: ["auth", "products", "cart", "checkout", "orders", "payments"],
        models: ["User", "Product", "Category", "Cart", "CartItem", "Order", "OrderItem", "Payment", "Review", "Wishlist"],
        pages: ["shop", "product", "cart", "checkout", "orders", "account", "admin"],
        components: ["all"],
    },
    "bac": {
        name: "BAC System",
        description: "Bids and Awards Committee management system",
        features: ["auth", "procurement", "bidding", "contracts", "reports"],
        models: ["User", "Project", "Bid", "Bidder", "Award", "Contract", "Document", "Timeline"],
        pages: ["dashboard", "projects", "bids", "bidders", "awards", "contracts", "reports"],
        components: ["all"],
    },
};

export function getTemplateConfig(template: ExtendedTemplateType): SystemTemplateConfig {
    return SYSTEM_TEMPLATES[template];
}

export function isSystemTemplate(template: string): template is ExtendedTemplateType {
    return template in SYSTEM_TEMPLATES;
}
