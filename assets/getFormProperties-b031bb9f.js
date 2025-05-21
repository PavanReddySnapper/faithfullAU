function s(r){const e={};if(!r)return e;const t=r.querySelectorAll('[name^="properties"]');return t&&[...t].forEach(n=>{const o=n.name.match(/\[(.*)\]/)[1];e[o]=n.value}),e}export{s as g};
