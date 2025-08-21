// Theme module using Tailwind CSS classes
// This module exports semantic class combinations for consistent styling

export const themeClasses = {
  // Container and layout classes
  container: 'flex-1 bg-sand',
  safeArea: 'flex-1 bg-sand',
  content: 'flex-1 justify-center items-center px-5',

  // Logo classes
  logo: 'w-20 h-20 rounded-2xl bg-cinnamon flex items-center justify-center mb-5 shadow-lg',
  logoText: 'text-white text-4xl font-bold',

  // Typography classes
  appTitle: 'text-4xl font-bold text-mahogany mb-2 text-center',
  subtitle: 'text-sm text-desertBrown mb-12 text-center',
  versionText: 'absolute bottom-5 text-gray-500 text-sm',

  // Button container and base styles
  buttonContainer: 'w-full max-w-60 items-center',
  buttonBase:
    'w-full px-5 py-3.5 rounded-xl text-base font-semibold text-center mb-4',

  // Button variants
  primaryButton: 'bg-cinnamon text-white',
  secondaryButton: 'bg-desertBrown text-white',
  continueButton: 'bg-sandy text-white',

  // Difficulty selector styles
  difficultyContainer: 'flex-1 bg-sand',
  backButtonContainer: 'px-5 pb-0 pt-5',
  backButton: 'self-start px-4 py-2 bg-cream rounded-lg border border-cinnamon',
  backButtonText: 'text-cinnamon text-base font-semibold',

  // Modal-specific styles
  modalOverlay: 'flex-1 bg-black/50',
  modalContainer:
    'bg-cream rounded-t-3xl border-t-4 border-x-4 border-mahogany shadow-2xl',
  modalDragHandle: 'items-center py-2',
  modalHandleBar: 'w-12 h-1.5 bg-desertBrown rounded-full',
  modalContent: 'flex-1',
};

export default themeClasses;
