export default function animate(el, opts = {}) {
  let fromStyle = null;

  return {
    from: function (style) {
      fromStyle = style;
      return this;
    },
    to: async function (style) {
      const { duration = '0.4s', effect = 'ease-in-out' } = opts;

      return new Promise((resolve, reject) => {
        if (!el) reject(el);

        el.addEventListener('transitionend', () => resolve(el), { once: true });

        if (fromStyle) {
          Object.entries(fromStyle).forEach(([key, value]) => {
            el.style[key] = value;
          });
        }

        el.style.transition = Object.keys(style)
          .map((key) => key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())
          .map((key) => `${key} ${duration} ${effect}`)
          .join(',');

        setTimeout(() => {
          Object.entries(style).forEach(([key, value]) => {
            el.style[key] = value;
          });
        });
      });
    },
  };
}
