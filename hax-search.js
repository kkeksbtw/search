import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class HaxSearch extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "hax-search";
  }

  constructor() {
    super();
    this.siteUrl = "";
    this.siteData = null;
    this.results = [];
    this.loading = false;
    this.error = "";
    this.t = {
      analyze: "Analyze",
      enterUrl: "Enter HAX site URL",
      name: "Name",
      description: "Description",
      theme: "Theme",
      created: "Created",
      lastUpdated: "Last updated",
      openContent: "Open Content",
      openSource: "Open Source",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/hax-search.ar.json", import.meta.url).href + "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  static get properties() {
    return {
      ...super.properties,
      siteUrl: { type: String },
      siteData: { type: Object },
      results: { type: Array },
      loading: { type: Boolean },
      error: { type: String },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: Arial, sans-serif;
          padding: 16px;
          background-color: white; /* Set overall background to white */
        }

        .input-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding: 10px;
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
        }

        .input-container span {
          padding: 0 10px;
          font-weight: bold;
          color: black; /* Set label text color to black */
        }

        input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          color: black; /* Set input text color to black */
        }

        button {
          padding: 8px 16px;
          background-color: #0078d4;
          color: #fff; /* Keep button text white */
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .site-overview {
          display: flex;
          align-items: center;
          border: 1px solid #000; /* Set overview border to black */
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 20px;
          background-color: rgba(0, 0, 0, 0.05);
        }

        .site-overview img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          margin-right: 16px;
          border-radius: 4px;
        }

        .site-info {
          text-align: center;
          flex: 1;
          color: black; /* Set site info text color to black */
        }

        .site-info div {
          margin: 4px 0;
        }

        .results-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .card {
          border: 1px solid #000; /* Set card border to black */
          border-radius: 4px;
          padding: 16px;
          width: calc(25% - 16px);
          box-sizing: border-box;
          cursor: pointer;
          background-color: white; /* Set card background to white */
          transition: background-color 0.2s ease;
          text-align: center; /* Center text in the card */
        }

        .card:hover {
          background-color: #f0f0f0; /* Slightly darker on hover */
        }

        .card img {
          max-width: 100%; /* Ensure the image fits within the card */
          height: auto; /* Maintain aspect ratio */
          margin: 0 auto; /* Center the image */
          display: block; /* Ensure the image is treated as a block element */
        }

        .card-content {
          color: black; /* Set card content text color to black */
        }

        .card-content h3 {
          margin: 0 0 8px;
        }

        .info-points {
          list-style-type: none; /* Remove default bullets */
          padding-left: 0; /* Remove padding */
          margin: 10px 0; /* Add margin above and below */
        }

        .info-points li {
          position: relative; /* Allow positioning for pseudo-element */
          padding-left: 20px; /* Space for dash */
        }

        .info-points li::before {
          content: "—"; /* Dash point */
          position: absolute; /* Positioning relative to the list item */
          left: 0; /* Align to the left */
          color: black; /* Dash color */
        }

        .link-buttons {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        .link-button {
          padding: 6px 10px;
          background-color: #0078d4;
          color: #fff; /* Keep link button text white */
          border: none;
          border-radius: 4px;
          text-decoration: none;
          font-size: 14px;
        }

        .link-button:hover {
          background-color: #005fa3;
        }

        @media (max-width: 768px) {
          .card {
            width: calc(50% - 16px);
          }
        }

        @media (max-width: 480px) {
          .card {
            width: 100%;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="input-container">
          <span>HAX site</span>
          <input
            type="url"
            placeholder="${this.t.enterUrl}"
            .value="${this.siteUrl}"
            @input="${this._updateUrl}"
            required
          />
          <button @click="${this._fetchData}" ?disabled="${!this.siteUrl}">
            ${this.t.analyze}
          </button>
        </div>

        ${this.siteData ? this._renderSiteOverview() : ""}
        ${this.results.length > 0 ? this._renderResultsGrid() : ""}
        ${this.error ? html`<div class="error">${this.error}</div>` : ""}
      </div>
    `;
  }

  _renderSiteOverview() {
    return html`
      <div class="site-overview">
        <img
          src="${this.siteData?.metadata?.logo || "/placeholder-image.jpg"}"
          alt="Site Logo"
        />
        <div class="site-info">
          <div><strong>${this.t.name}:</strong> ${this.siteData.title}</div>
          <div>
            <strong>${this.t.description}:</strong>
            ${this.siteData.description}
          </div>
          <div>
            <strong>${this.t.theme}:</strong> ${this.siteData.metadata?.theme}
          </div>
          <div>
            <strong>${this.t.created}:</strong>
            ${this.siteData.metadata?.created}
          </div>
          <div>
            <strong>${this.t.lastUpdated}:</strong>
            ${this.siteData.metadata?.updated}
          </div>
        </div>
      </div>
    `;
  }

  _renderResultsGrid() {
    return html`
      <div class="results-grid">
        ${this.results.map((item) => this._renderCard(item))}
      </div>
    `;
  }

  _renderCard(item) {
    return html`
      <div class="card" @click="${() => this._openCard(item)}">
        <img
          src="${item.metadata?.image || "/placeholder.svg"}"
          alt="${item.title}"
        />
        <div class="card-content">
          <h3>${item.title}</h3>
          <ul class="info-points">
            <li>${this.t.lastUpdated}: ${item.metadata?.updated}</li>
            <li>${item.description}</li>
          </ul>
          <div class="link-buttons">
            <a class="link-button" href="${item.location}" target="_blank"
              >Open Content</a
            >
            <a
              class="link-button"
              href="${item.slug}/index.html"
              target="_blank"
              >Open Source</a
            >
          </div>
        </div>
      </div>
    `;
  }

  _updateUrl(event) {
    this.siteUrl = event.target.value;
  }

  async _fetchData() {
    this.error = "";
    this.siteData = null;
    this.results = [];
    if (!this.siteUrl || !this.siteUrl.endsWith("site.json")) {
      this.error = "Please enter a valid site.json URL.";
      return;
    }

    try {
      const response = await fetch(this.siteUrl);
      if (!response.ok) throw new Error("Failed to fetch site data");
      const data = await response.json();
      if (!data || !data.items || !data.metadata) {
        throw new Error("Invalid site.json schema");
      }
      this.siteData = data;
      this.results = data.items || [];
    } catch (error) {
      this.error = error.message;
      console.error("Error fetching site data:", error);
    }
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

customElements.define(HaxSearch.tag, HaxSearch);
