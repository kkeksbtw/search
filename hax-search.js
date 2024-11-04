/**
 * Copyright 2024 dashawnpaige27
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `hax-search`
 *
 * @demo index.html
 * @element hax-search
 */
export class HaxSearch extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "hax-search";
  }

  constructor() {
    super();
    this.title = "";
    this.siteUrl = "";
    this.results = [];
    this.t = {
      title: "Title",
    };

    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/hax-search.ar.json", import.meta.url).href + "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      siteUrl: { type: String },
      results: { type: Array },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
        }
        .wrapper {
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
        }
        h3 span {
          font-size: var(--hax-search-label-font-size, var(--ddd-font-size-s));
        }

        .card {
          background: #f0f0f0;
          border-radius: 10px;
          padding: 15px;
          width: 22%;
          text-align: left;
          margin: 10px;
          display: inline-block;
        }

        .card img {
          width: 100%;
          height: auto;
          border-radius: 5px;
        }

        .card a {
          text-decoration: none;
          color: blue;
        }

        .input-area {
          margin-bottom: 20px;
        }
      `,
    ];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        <h3><span>${this.t.title}:</span> ${this.title}</h3>
        <div class="input-area">
          <input
            type="text"
            .value="${this.siteUrl}"
            @input="${this._updateUrl}"
            placeholder="Enter HAX site URL"
          />
          <button @click="${this._fetchData}">Analyze</button>
        </div>
        <div id="results">
          ${this.results.map((item) => this._renderCard(item))}
        </div>
      </div>
    `;
  }

  _updateUrl(event) {
    this.siteUrl = event.target.value;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(HaxSearch.tag, HaxSearch);
