<script>
  import { goto } from '$app/navigation';

  /**
   * Navigates to the difficulty selection page
   */
  const startGame = () => {
    goto('/difficulty');
  };
</script>

<div class="page-container">
  <main class="main-content">
    <div class="welcome-header">
      <h1 class="app-title">SUDOKU MASTER</h1>
      <p
        class="text-center"
        style="color: var(--color-neutral-600); font-size: var(--font-size-lg);"
      >
        Challenge your mind with modern minimalist sudoku
      </p>
    </div>

    <div class="flex-center">
      <button class="btn btn-primary btn-large" onclick={startGame}>START GAME</button>
    </div>

    <div class="flex-center gap-4">
      <button class="btn btn-secondary">Settings</button>
      <button class="btn btn-secondary">Stats</button>
    </div>
  </main>
</div>
