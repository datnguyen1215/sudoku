# Sudoku App Style Guide

## Theme Overview

Desert-inspired warm color palette with sand tones and natural textures. The design emphasizes clarity and readability while maintaining a cohesive visual identity.

## Grid Structure

- **Row**: Horizontal line of 9 cells
- **Column**: Vertical line of 9 cells
- **3x3 Box**: Square region containing 9 cells (sudoku has 9 boxes total)
- **Related Cells**: All cells containing the same number as the selected cell

## Color Palette

### Primary Colors

- **Cinnamon** (#D2691E): Primary actions, logo, active states
- **Desert Brown** (#8B6B47): Secondary actions, borders, text
- **Sandy** (#DDA15E): Continue button, highlights
- **Mahogany** (#4A2C2A): Headers, given numbers
- **Sienna** (#6B4423): Thick borders, grid outlines

### Background Colors

- **Sand** (#FAF3E0): Main background
- **Cream** (#FFF8E7): Grid background, cards
- **Pale Cream** (#F5F0E6): Given cell background
- **Wheat** (#F5DEB3): Gradients
- **Pale Wheat** (#FFF5E0): Light backgrounds

### Accent Colors

- **Apricot** (#FFE5B4): Selected cell, related cells, hover states
- **Dark Chocolate** (#3E2723): Default text
- **Brown** (#5D4E37): User input text

### Validation Colors

- **Sage Green**: Correct input
- **Terracotta**: Incorrect input
- **Light Pink**: Errors/conflicts

## Game State Visual Hierarchy

### Cell State Descriptions

**Given Numbers** (pre-filled puzzle numbers)

- Background: Pale cream
- Text: Mahogany, bold weight
- Purpose: Distinguishes immutable puzzle numbers from user input

**User Input** (numbers entered by player)

- Text: Brown
- Purpose: Visually differentiates player entries from given numbers

**Selected Cell** (currently active cell)

- Background: Apricot
- Border: Sandy
- Text: Bold weight
- Shadow: Soft shadow for depth

### Selection Highlights

**Selected Row & Column**

- Background: Pale wheat with transparency
- Purpose: Shows alignment context for selected cell

**Selected 3x3 Box**

- Border: Cinnamon outline
- Purpose: Highlights the sudoku box containing selected cell

**Related Numbers** (same value as selected)

- Background: Apricot
- Purpose: Shows all instances of the selected number

### Validation States

**Correct Input**

- Background: Sage green
- Text: Green

**Incorrect Input**

- Background: Terracotta
- Text: Red

**Conflict/Error** (duplicate in row/column/box)

- Background: Light pink
- Text: Red
- Border: Red emphasis

### State Priority Order

When multiple states overlap, apply in this priority:

1. **Error/conflict** (highest priority) - Must be clearly visible
2. **Selected cell** - Active interaction state
3. **Validation states** (correct/incorrect)
4. **Related numbers** - Same value highlighting
5. **Box outline** - 3x3 region indicator
6. **Row/column highlight** - Alignment guides
7. **Default state** (lowest priority)

## Responsive Guidelines

- **Mobile** (320px+): Base styles, single column layouts
- **Tablet** (640px+): Larger touch targets, optimized spacing

## Design Principles

### Color Usage

- Maintain contrast ratios for accessibility
- Use opacity for overlays and disabled states
- Prefer semantic color names over hex values

### Consistency Guidelines

- All interactive elements should have hover states
- Maintain 44px minimum touch target size
- Use consistent border radius within component types
- Apply transitions to all state changes

## Animation & Motion Guidelines

### Timing Principles

- **Micro-interactions**: Immediate feedback
- **State transitions**: Smooth visual changes
- **Modal/overlay appearances**: Gradual with easing
- **Loading animations**: Continuous loops
- **Success celebrations**: Brief completion feedback

### Animation Curves

- **Ease-out**: For elements entering view
- **Ease-in-out**: For state changes
- **Linear**: For continuous progress
- **Spring**: For playful interactions

### Motion Hierarchy

- Primary actions animate first
- Secondary elements follow
- Background elements animate last

## Visual Feedback Principles

### Interaction Feedback

- **Immediate response**: Quick visual acknowledgment
- **Touch feedback**: Scale down on press, return on release
- **Hover states**: Brightness increase or border emphasis
- **Active states**: Depth reduction to show depression

### Feedback Intensity

- **Success**: Subtle intensity, slow animation
- **Warning**: Medium intensity, moderate speed
- **Error**: Strong intensity, fast animation
- **Critical**: Full intensity, pulsing effect

### Overlay Standards

- **Light overlay**: Subtle separation
- **Medium overlay**: Modals and focus
- **Heavy overlay**: Critical actions
- **Loading overlay**: With spinner

### Elevation & Shadows

- Use shadows to indicate depth and hierarchy
- Flat elements have no shadow
- Interactive elements need subtle shadows
- Modals and popups need stronger shadows

## Mobile Interaction Standards

### Touch Targets

- **Minimum size**: Adequate for finger taps
- **Preferred size**: Larger for primary actions
- **Spacing between targets**: Sufficient gap to prevent mis-taps
- **Edge padding**: Comfortable distance from screen edges

### Gesture Zones

- **Swipe threshold**: Minimum movement required
- **Long-press duration**: Standard activation time
- **Double-tap window**: Quick succession timing
- **Pinch-zoom sensitivity**: Responsive scaling

### Haptic Feedback Triggers

- **Light impact**: Selection changes, toggle switches
- **Medium impact**: Button presses, successful actions
- **Heavy impact**: Errors, warnings, completions
- **Selection feedback**: For picker wheel movements

### Safe Areas

- **Top safe area**: Account for notches and status bars
- **Bottom safe area**: Account for home indicators
- **Landscape margins**: Extra space for thumb reach
- **Keyboard avoidance**: Scroll content above keyboard

## Visual Hierarchy

### Focus Levels

- **Primary**: High contrast - Active elements
- **Secondary**: Medium contrast - Available actions
- **Tertiary**: Low contrast - Supporting content
- **Disabled**: Minimal contrast - Unavailable items

### Visual Weight

- **Heavy elements**: Dark colors, large sizes, bold text
- **Medium elements**: Standard colors and sizes
- **Light elements**: Pale colors, small sizes, thin borders

## Color Application Rules

### Distribution Principles

- **60% Base**: Sand/Cream backgrounds for breathing room
- **30% Support**: Desert Brown/Mahogany for structure
- **10% Accent**: Cinnamon/Sandy for key actions

### Color Restrictions

- **Never use pure black** - Use Mahogany instead
- **Never use pure white** - Use Cream instead
- **Maximum 3 accent colors** per screen
- **Maintain 2:1 ratio** between light and dark elements

### Transparency Usage

- **Avoid stacking** multiple transparent elements
- Use appropriate opacity levels for different UI states

### Semantic Consistency

- **Actions**: Always use same color for same action type
- **States**: Consistent colors across all components
- **Feedback**: Same color = same meaning everywhere
- **Branding**: Cinnamon as primary brand color throughout

## Responsive Scaling

### Text Scaling

- **Mobile**: Base size 16px, headings 1.5x larger
- **Tablet**: Base size 18px, headings 1.75x larger

### Spacing Multipliers

- **Mobile**: 1x base spacing
- **Tablet**: 1.25x increased spacing

### Component Adaptations

- **Borders**: Slightly thicker on tablets
- **Shadows**: Increase blur radius on larger screens
- **Border radius**: Scale proportionally with component size
- **Icons**: Larger on tablets for better visibility

## Accessibility & Color Contrast

### Color Contrast Guidelines

**Avoid these combinations** (poor contrast):

- White text on Cinnamon, Sandy, or Desert Brown backgrounds
- Desert Brown text on Cream or Apricot backgrounds

**Use these instead** (good contrast):

- Mahogany text on all light backgrounds
- White text on Mahogany background only
- Cream text on Desert Brown background

### Recommended Combinations

- Dark text (Mahogany/Dark Chocolate) on light backgrounds
- Light text (Cream/White) only on dark backgrounds (Mahogany/Desert Brown)
- Ensure sufficient contrast for all interactive elements

### Color Blindness Considerations

- Avoid relying solely on red/green for validation states
- Use icons or patterns in addition to color
- Ensure sufficient contrast between all states
- Test with deuteranopia (red-green) and protanopia simulators

### Focus Indicators

- All interactive elements must have visible focus states
- Use high-contrast colors (Mahogany or Cinnamon) for focus
- Ensure focus is clearly visible
