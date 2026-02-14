# Kubernetes CRD Visualizer

A web application to help developers understand Kubernetes Custom Resource Definitions (CRDs) by parsing and visualizing their OpenAPI v3 schemas.

## Features

- **Parse CRDs**: Supports both YAML and JSON formats
- **Interactive Tree View**: Explore field types, requirements, and nested structures
- **Field Details**: View descriptions, validation rules, and constraints
- **Multi-Version Support**: Switch between different CRD versions
- **Type Indicators**: Color-coded badges for different field types
- **Error Handling**: Clear error messages for parsing issues

## Tech Stack

- **Nuxt 3** - Vue.js framework with SSR
- **TypeScript** - Type-safe development
- **Nuxt UI** - Pre-built UI components
- **js-yaml** - YAML parsing
- **Tailwind CSS** - Styling

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. Paste a Kubernetes CRD in YAML or JSON format
2. Click "Parse CRD" to visualize the schema
3. Click on fields to see detailed information
4. Expand/collapse nodes to explore the structure
5. Switch between versions if the CRD defines multiple versions

## Project Structure

```plain
crd-visualizer/
├── components/           # Vue components
│   ├── CrdInput.vue     # Input area for CRD
│   ├── SchemaVisualizer.vue  # Main visualization container
│   └── schema/          # Schema visualization components
├── composables/         # Reusable composition functions
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── pages/              # Nuxt pages
└── public/             # Static assets
    └── examples/       # Example CRD files
```
