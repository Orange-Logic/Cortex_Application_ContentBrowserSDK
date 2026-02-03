function captureAnchor(container: HTMLElement, options: {
  itemSelector: string;
}) {
  const children = Array.from(
    container.querySelectorAll(options.itemSelector),
  );
  
  const containerTop = container.getBoundingClientRect().top;
  
  for (const el of children) {
    const rect = el.getBoundingClientRect();
    const id = (el as HTMLElement).dataset.id;
    if ((rect.bottom > containerTop && id)) {
      return {
        id,
        offset: rect.top - containerTop,
      };
    }
  }
}

export { captureAnchor };