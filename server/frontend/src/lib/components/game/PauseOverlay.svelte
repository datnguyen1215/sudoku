<script>
  let { onResume = () => {} } = $props();
</script>

<div class="pause-overlay">
  <div class="pause-content">
    <h2 class="pause-title">GAME PAUSED</h2>
    <button
      class="resume-button"
      onclick={onResume}
      type="button"
    >
      Resume Game
    </button>
  </div>
</div>

<style>
  .pause-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 40;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .pause-content {
    text-align: center;
    padding: 2rem;
    background-color: var(--color-neutral-50);
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    max-width: 280px;
    margin: 1rem;
  }

  .pause-title {
    font-size: 1.5rem;
    font-weight: var(--font-weight-bold);
    color: var(--color-neutral-900);
    margin: 0 0 1.5rem 0;
    letter-spacing: 0.05em;
  }

  .resume-button {
    background-color: var(--color-primary-500);
    color: white;
    border: none;
    border-radius: var(--radius-lg);
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-fast);
    min-height: 44px;
    min-width: 120px;
  }

  .resume-button:active {
    transform: scale(0.98);
    background-color: var(--color-primary-600);
  }

  @media (max-width: 640px) {
    .pause-content {
      padding: 1.5rem;
      max-width: 240px;
    }

    .pause-title {
      font-size: 1.25rem;
    }

    .resume-button {
      padding: 0.625rem 1.5rem;
      font-size: 0.875rem;
    }
  }
</style>