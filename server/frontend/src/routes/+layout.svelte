<script>
  import '../app.css';

  const { children } = $props();
</script>

<div class="page-transition">
  {@render children?.()}
</div>

<style>
  .page-transition {
    animation: pageEnter var(--transition-base);
  }

  @keyframes pageEnter {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
