/* ============================================================
 * api_client.js · 前端适配器（engine.js 接入后端）
 *
 * 策略（对齐 FRS 5.1）：
 *  - 优先调后端 /api/choice 拿权威 effects（防客户端篡改）
 *  - 后端不可达时降级为本地计算（离线可用，开发友好）
 *  - 提供 generateSessionId / startSession
 *
 * 用法：在 runner.html 中 <script src="api_client.js"> 置于 engine.js 之后，
 *       并在 Runner 的 loadCard / onAdvance 里用 APIClient.submitChoice 替换本地 applyEffects。
 * ============================================================ */
(function (global) {
  "use strict";

  const DEFAULT_API = "http://localhost:3000";

  function generateSessionId() {
    return "sess-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function APIClient(opts) {
    this.base = (opts && opts.base) || DEFAULT_API;
    this.sessionId = (opts && opts.sessionId) || generateSessionId();
    this.online = true; // 是否成功连过后端
  }

  APIClient.prototype._url = function (path) { return this.base + path; };

  APIClient.prototype._post = function (path, body) {
    return fetch(this._url(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
    }).then((res) => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });
  };

  // 拉取单卡（按需渲染，避免打包全量）
  APIClient.prototype.fetchCard = function (cardId) {
    return fetch(this._url("/api/card/" + encodeURIComponent(cardId) + "?sessionId=" + this.sessionId))
      .then((res) => { if (!res.ok) throw new Error("HTTP " + res.status); return res.json(); })
      .then((data) => data.card);
  };

  // 提交选择：后端权威计算；失败降级本地
  APIClient.prototype.submitChoice = function (cardId, side, reactionMs, timedOut, localFallback) {
    const payload = { sessionId: this.sessionId, cardId: String(cardId), side, reactionMs: reactionMs || 0, timedOut: !!timedOut };
    if (!this.online) return Promise.resolve(localFallback(payload)); // 离线：直接用本地 card 算
    return this._post("/api/choice", payload).then(
      (resp) => {
        this.online = true;
        return { source: "server", response: resp };
      },
      (err) => {
        this.online = false;
        console.warn("[api_client] 后端不可达，降级本地计算：", err.message);
        return { source: "local", response: localFallback(payload) };
      }
    );
  };

  // 结算结局
  APIClient.prototype.judge = function () {
    if (!this.online) return Promise.resolve(null); // 离线：由前端 judge()
    return this._post("/api/judge", { sessionId: this.sessionId }).then(
      (resp) => { this.online = true; return resp.ending; },
      (err) => { this.online = false; return null; }
    );
  };

  APIClient.prototype.reset = function () {
    return this._post("/api/reset", { sessionId: this.sessionId }).catch(() => ({}));
  };

  if (typeof window !== "undefined") globalThis.APIClient = APIClient;
  if (typeof module !== "undefined" && module.exports) module.exports = APIClient;
})(typeof window !== "undefined" ? window : globalThis);
