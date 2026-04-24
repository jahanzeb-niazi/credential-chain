// Tiny hash router. Routes register a handler that returns HTML (string)
// and an optional `mount(rootEl)` for post-render interactivity.

const routes = []; // { pattern: RegExp, paramKeys: [], handler }

export function registerRoute(pattern, handler) {
  // pattern e.g. "/admin/issue" or "/posts/:id"
  const keys = [];
  const re = new RegExp("^" + pattern.replace(/:([a-zA-Z]+)/g, (_, k) => {
    keys.push(k); return "([^/]+)";
  }) + "$");
  routes.push({ pattern, re, keys, handler });
}

function parseHash() {
  const raw = location.hash.replace(/^#/, "") || "/";
  const [path, query = ""] = raw.split("?");
  return { path: path.replace(/\/+$/, "") || "/", query };
}

async function render() {
  const { path } = parseHash();
  const root = document.getElementById("app");
  for (const r of routes) {
    const m = path.match(r.re);
    if (m) {
      const params = {};
      r.keys.forEach((k, i) => params[k] = decodeURIComponent(m[i + 1]));
      const result = await r.handler({ path, params });
      root.innerHTML = typeof result === "string" ? result : result.html;
      window.scrollTo(0, 0);
      if (typeof result === "object" && typeof result.mount === "function") {
        result.mount(root);
      }
      return;
    }
  }
  root.innerHTML = `
    <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px;">
      <div style="text-align:center; max-width:420px;">
        <h1 class="serif" style="font-size:72px; color:var(--navy); margin:0;">404</h1>
        <p class="muted">The page you're looking for doesn't exist.</p>
        <a class="btn btn-primary" href="#/" style="margin-top:16px">Go home</a>
      </div>
    </div>`;
}

export function startRouter() {
  window.addEventListener("hashchange", render);
  window.addEventListener("DOMContentLoaded", render);
  if (document.readyState !== "loading") render();
}

export function currentPath() { return parseHash().path; }
