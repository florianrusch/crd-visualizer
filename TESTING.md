# Testing Guide

## Quick Start

1. **Start the development server** (already running):
   ```bash
   npm run dev
   ```

2. **Open the application** at [http://localhost:3000](http://localhost:3000)

## Test Scenarios

### Test 1: Load Example CRD

1. Click the "Load Example" button on the input page
2. The example Deployment CRD should load into the textarea
3. Click "Parse CRD" button
4. **Expected results**:
   - Visualization appears
   - Header shows: "Deployment" and "apps.example.com"
   - Tree shows the schema structure starting with "spec"
   - Root node should be expanded by default

### Test 2: Explore Tree Structure

1. After loading the example, expand various nodes:
   - Click `spec` to expand it
   - Click `template` to see nested structure
   - Click `containers` (array type) to see container properties
2. **Expected results**:
   - Nodes expand/collapse with ▶/▼ icons
   - Required fields show red asterisk (*)
   - Type badges show different colors (blue for string, orange for object, red for array)

### Test 3: View Field Details

1. Click on various fields in the tree:
   - Click "replicas" - should show integer type with min/max validation
   - Click "name" under containers - should show pattern validation
   - Click "protocol" - should show enum values (TCP, UDP, SCTP)
2. **Expected results**:
   - Right panel updates with field details
   - Description appears
   - Validation rules display
   - Enum values show as badges

### Test 4: Expand/Collapse All

1. Click "Expand All" button
2. **Expected**: All nodes expand
3. Click "Collapse All" button
4. **Expected**: All nodes collapse

### Test 5: Load Complex CRD

1. Click "Load New CRD" button
2. Manually load the certificate example:
   ```bash
   # Copy content from public/examples/certificate.yaml
   ```
3. Paste into textarea and parse
4. **Expected results**:
   - More complex structure appears
   - Deep nesting works correctly
   - Keystores section shows multiple levels of nesting

### Test 6: Error Handling

**Test invalid YAML:**
```yaml
invalid: yaml: syntax: error
```
- **Expected**: Error message with line number

**Test invalid CRD (missing required fields):**
```yaml
apiVersion: v1
kind: ConfigMap
```
- **Expected**: Error message about invalid kind

**Test empty input:**
- Click parse with empty textarea
- **Expected**: Error message asking for input

### Test 7: File Upload

1. Save the example CRD to a file
2. Click "Upload File" button
3. Select the file
4. Click "Parse CRD"
5. **Expected**: File content loads and parses correctly

## Visual Checks

### Colors
- String fields: Blue badges
- Integer/Number fields: Green badges
- Boolean fields: Purple badges
- Object fields: Orange badges
- Array fields: Red badges
- Required fields: Red asterisk (*)

### Layout
- Input page: Centered, max-width container
- Visualization: Full-width layout
- Tree: Left side (60% width)
- Details panel: Right side (40% width)
- Split with visible border

### Interactions
- Hover effects on tree nodes (background changes)
- Selected node highlighted in blue
- Smooth expand/collapse animations
- Responsive buttons and badges

## Manual Testing Checklist

- [ ] Page loads without errors
- [ ] Example CRD loads successfully
- [ ] Parse button works
- [ ] Tree structure renders correctly
- [ ] Required fields show asterisk
- [ ] Type badges show correct colors
- [ ] Click field shows details
- [ ] Expand/collapse nodes works
- [ ] Expand All button works
- [ ] Collapse All button works
- [ ] Load New CRD button resets state
- [ ] File upload works
- [ ] Error messages display for invalid input
- [ ] Validation rules display in details panel
- [ ] Enum values display as badges
- [ ] Default values display
- [ ] Format constraints display
- [ ] Pattern validation displays

## Browser Console

Open browser console (F12) and check for:
- No JavaScript errors
- No Vue warnings
- Successful parsing messages

## Performance

Test with large CRDs:
- Should handle 100+ fields
- Tree rendering should be smooth
- Expand/collapse should be instant
- No lag when selecting fields

## Known Limitations

1. Very large CRDs (1000+ fields) may be slow
2. Circular references in schemas not supported
3. Some advanced OpenAPI features may not display
4. Mobile responsiveness not optimized yet

## Next Steps

If all tests pass:
1. Test with real-world CRDs from your Kubernetes cluster
2. Export CRD using: `kubectl get crd <name> -o yaml`
3. Paste into the visualizer
4. Explore the schema structure
