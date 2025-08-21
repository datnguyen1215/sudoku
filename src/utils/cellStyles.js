/**
 * Cell styling utility functions
 */

/**
 * Determine cell background based on state (priority order matters)
 * @param {Object} cellState - Cell state object
 * @returns {string} Background class name
 */
export const getCellBackground = ({
  hasError,
  isConflicting,
  isSelected,
  hasSameValue,
  isInSameRow,
  isInSameCol,
  isGiven,
  value,
}) => {
  if (isConflicting) return 'bg-red-500';
  if (hasError) return 'bg-lightPink';
  if (isSelected) return 'bg-apricot';
  if (hasSameValue && value !== null) return 'bg-apricot';
  if (isInSameRow || isInSameCol) return 'bg-paleWheat';
  if (isGiven) return 'bg-paleCream';
  return 'bg-cream';
};

/**
 * Determine border styles for 3x3 subgrids
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {boolean} isSelected - Whether cell is selected
 * @returns {string} Border class names
 */
export const getBorderStyles = (row, col, isSelected, isInSameBox = false) => {
  let borderClasses = 'border border-desertBrown/30';

  // Thicker borders for 3x3 subgrid boundaries
  if (row % 3 === 0 && row !== 0)
    borderClasses += ' border-t-2 border-t-sienna';
  if (col % 3 === 0 && col !== 0)
    borderClasses += ' border-l-2 border-l-sienna';
  if (row === 0) borderClasses += ' border-t-2 border-t-sienna';
  if (col === 0) borderClasses += ' border-l-2 border-l-sienna';

  // Add 3x3 box highlight
  if (isInSameBox && !isSelected) {
    borderClasses += ' border-cinnamon/50';
  }

  // Add selection border (highest priority)
  if (isSelected) borderClasses += ' border-2 border-cinnamon';

  return borderClasses;
};

/**
 * Text color based on cell state
 * @param {boolean} hasError - Whether cell has error
 * @param {boolean} isGiven - Whether cell is given/fixed
 * @returns {string} Text color class names
 */
export const getTextColor = (hasError, isGiven) => {
  if (hasError) return 'text-mahogany'; // Using mahogany for errors as it's dark red
  if (isGiven) return 'text-mahogany font-bold';
  return 'text-brown'; // User input uses brown per style guide
};
