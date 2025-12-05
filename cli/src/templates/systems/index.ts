// System Templates Index
// Export all system-specific templates

export * from "./pos.js";
export * from "./ecommerce.js";
export * from "./evaluation.js";
export * from "./branch-management.js";
export * from "./bac.js";

// Template generator mapping
export const SYSTEM_TEMPLATE_GENERATORS = {
    pos: {
        name: "POS System",
        description: "Point of Sale system for retail businesses",
        generateSchema: () => import("./pos.js").then((m) => m.generatePOSSchema()),
        generateRouter: () => import("./pos.js").then((m) => m.generatePOSRouter()),
        generatePage: () => import("./pos.js").then((m) => m.generatePOSPage()),
    },
    ecommerce: {
        name: "E-Commerce",
        description: "Online store with cart and checkout",
        generateSchema: () => import("./ecommerce.js").then((m) => m.generateEcommerceSchema()),
        generateRouter: () => import("./ecommerce.js").then((m) => m.generateEcommerceRouter()),
    },
    evaluation: {
        name: "Evaluation System",
        description: "Teacher/Employee evaluation and ranking",
        generateSchema: () => import("./evaluation.js").then((m) => m.generateEvaluationSchema()),
        generateRouter: () => import("./evaluation.js").then((m) => m.generateEvaluationRouter()),
    },
    "branch-management": {
        name: "Branch Management",
        description: "Multi-branch business management",
        generateSchema: () => import("./branch-management.js").then((m) => m.generateBranchManagementSchema()),
        generateRouter: () => import("./branch-management.js").then((m) => m.generateBranchManagementRouter()),
    },
    bac: {
        name: "BAC System",
        description: "Bids and Awards Committee management",
        generateSchema: () => import("./bac.js").then((m) => m.generateBACSchema()),
        generateRouter: () => import("./bac.js").then((m) => m.generateBACRouter()),
    },
} as const;

export type SystemTemplateType = keyof typeof SYSTEM_TEMPLATE_GENERATORS;

export function isSystemTemplate(template: string): template is SystemTemplateType {
    return template in SYSTEM_TEMPLATE_GENERATORS;
}

export function getSystemTemplateInfo(template: SystemTemplateType) {
    return SYSTEM_TEMPLATE_GENERATORS[template];
}
