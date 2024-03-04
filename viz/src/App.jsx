import { PanelDisplay, useModelData } from '@nextstrain/evofr-viz';
import '@nextstrain/evofr-viz/dist/index.css';

const customAddress = !!import.meta.env.VITE_DATA_HOST;
const mlrCladesConfig = {
    modelName: "mlr_clades",
    modelUrl: customAddress ?
      `${import.meta.env.VITE_DATA_HOST}/${import.meta.env.VITE_CLADES_PATH}` :
      `https://nextstrain-data.s3.amazonaws.com/files/workflows/forecasts-ncov/gisaid/nextstrain_clades/global/mlr/latest_results.json`,
}
const mlrLineagesConfig = {
    modelName: "mlr_lineages",
    modelUrl: customAddress ?
      `${import.meta.env.VITE_DATA_HOST}/${import.meta.env.VITE_LINEAGES_PATH}` :
      `https://nextstrain-data.s3.amazonaws.com/files/workflows/forecasts-ncov/gisaid/pango_lineages/global/mlr/latest_results.json`,
}

function App() {

  const mlrCladesData = useModelData(mlrCladesConfig);
  const mlrLineagesData = useModelData(mlrLineagesConfig);

  const cladesLocationsFiltered = mlrCladesData?.modelData?.get('locations')?.filter((loc)=>loc!=='hierarchical') || [];
  const lineagesLocationsFiltered = mlrLineagesData?.modelData?.get('locations')?.filter((loc)=>loc!=='hierarchical') || [];

  return (
    <div className="App">

      <div id="mainPanelsContainer">
        <h2>Clade frequencies over time</h2>
        <p>
          Each line represents the estimated frequency of a particular clade through time. 
          The equivalent Pango lineage is given in parentheses, e.g. clade 23I (lineage BA.2.86). 
          States with at least 90 sequences from samples collected in the previous 45 days are included. 
          Results last updated {mlrCladesData?.modelData?.get('updated') || 'loading'}.
        </p>
        <div id="cladeFrequenciesPanel" class="panelDisplay"> {/* surrounding div(s) used for static-images.js script */}
          <PanelDisplay data={mlrCladesData} locations={cladesLocationsFiltered} params={{preset: "frequency"}}/>
        </div>

        <h2>Clade growth advantage</h2>
        <p>
<<<<<<< HEAD
          These plots show the estimated growth advantage for given clades relative to clade 23I (lineage BA.2.86). 
          A variant’s growth advantage describes how many more secondary infections it causes on average relative 
          to clade 23I. Vertical bars show the 95% highest (posterior) density interval (HDI). The "hierarchical" panel 
=======
          These plots show the estimated growth advantage for given clades relative to clade 23I (lineage BA.2.86).
          A variant’s growth advantage describes how many more secondary infections it causes on average relative
          to clade 23I. Vertical bars show the 95% highest (posterior) density interval (HDI). The "hierarchical" panel
>>>>>>> 00c6b4c02ebd12bbcb8c8bedf37a03d4be2e8276
          shows pooled estimates of growth rates across different states.
          Results last updated {mlrCladesData?.modelData?.get('updated') || 'loading'}.
        </p>
        <div id="cladeGrowthAdvantagePanel" class="panelDisplay">
          <PanelDisplay data={mlrCladesData} params={{preset: "growthAdvantage"}}/>
        </div>

        <h2>Lineage frequencies over time</h2>
        <p>
          Each line represents the estimated frequency of a particular Pango lineage through time.
          Lineages with fewer than 200 observations are collapsed into the parental lineage. States with
          at least 90 sequences from samples collected in the previous 45 days are included.
          Results last updated {mlrLineagesData?.modelData?.get('updated') || 'loading'}.
        </p>
        <div id="lineageFrequenciesPanel" class="panelDisplay">
          <PanelDisplay data={mlrLineagesData} locations={lineagesLocationsFiltered} params={{preset: "frequency"}}/>
        </div>

        <h2>Lineage growth advantage</h2>
        <p>
<<<<<<< HEAD
          These plots show the estimated growth advantage for given Pango lineages relative to lineage JN.1. 
          A lineage’s growth advantage describes how many more secondary infections it causes on average relative 
          to lineage JN.1. Vertical bars show the 95% highest (posterior) density interval (HDI). The "hierarchical" 
          panel shows pooled estimates of growth rates across different states. 
=======
          These plots show the estimated growth advantage for given Pango lineages relative to lineage JN.1.
          A lineage’s growth advantage describes how many more secondary infections it causes on average relative
          to lineage JN.1. Vertical bars show the 95% highest (posterior) density interval (HDI). The "hierarchical"
          panel shows pooled estimates of growth rates across different states.
>>>>>>> 00c6b4c02ebd12bbcb8c8bedf37a03d4be2e8276
          Results last updated {mlrLineagesData?.modelData?.get('updated') || 'loading'}.
        </p>
        <div id="lineageGrowthAdvantagePanel" class="panelDisplay">
          <PanelDisplay data={mlrLineagesData} params={{preset: "growthAdvantage"}}/>
        </div>

      </div>
    </div>
  )
}

export default App
