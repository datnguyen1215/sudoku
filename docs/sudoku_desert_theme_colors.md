# Sudoku Warm Desert Theme - Color Guide

## Grid Structure
- **Row**: Horizontal line of 9 cells
- **Column**: Vertical line of 9 cells  
- **3x3 Box**: Square region containing 9 cells (sudoku has 9 boxes total)
- **Related Cells**: All cells containing the same number as the selected cell

## Base Colors
- **Background**: Warm sand #FAF3E0 (page gradient)
- **Grid Background**: Light cream #FFF8E7
- **Grid Lines**: Desert brown #8B6B47 (thin), Dark sienna #6B4423 (thick for boxes)
- **Default Text**: Dark chocolate #3E2723

## Cell States

**Given Numbers** (pre-filled puzzle numbers)
- Background: Pale cream #F5F0E6
- Text: Mahogany #4A2C2A, bold weight

**User Input** (numbers entered by player)
- Text: Brown #5D4E37, italic style
- Distinguishes from given numbers visually

**Selected Cell** (currently active cell)
- Background: Peach #FFE5B4
- Border: Coral #DDA15E, 2px solid
- Text: Bold weight
- Soft shadow for depth

## Selection Highlights

**Selected Row & Column**
- Background: Pale wheat rgba(245,222,179,0.4)
- Subtle overlay to show alignment

**Selected 3x3 Box**
- Border: Cinnamon #D2691E, 3px outline
- No background fill, only border highlight

**Related Numbers** (same value as selected)
- Background: Apricot #FFE4B5
- Text: Burnt umber #8B4513, semi-bold
- Border: Thin peach #FFDAB9

## Validation States

**Correct Input**
- Background: Sage green rgba(135,169,107,0.3)
- Text: Forest green #228B22

**Incorrect Input**
- Background: Terracotta rgba(204,107,90,0.3)
- Text: Brick red #B22222

**Conflict/Error** (duplicate in row/column/box)
- Background: Light pink rgba(255,200,200,0.5)
- Text: Dark red #B22222
- Border: Indian red #CD5C5C, 2px solid

## Visual Hierarchy
Priority when multiple states overlap:
1. Error/conflict (highest priority)
2. Selected cell
3. Correct/incorrect input
4. Related numbers
5. Box outline
6. Row/column highlight
7. Default state (lowest priority)