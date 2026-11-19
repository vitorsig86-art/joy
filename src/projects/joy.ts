import type { ProjectConfig, ProjectLayerConfig } from "./types";
import { templateProject } from "./template";

const basemap: ProjectLayerConfig = { ...templateProject.layers[0], exclusiveGroup: "mapa-base" };
if (basemap.source.format !== "ion-world-imagery") throw new Error("Expected the template ion basemap.");
const googleBasemap: ProjectLayerConfig = {
  ...basemap, id: "basemap-google", name: "Google Satellite com rótulos",
  description: "Google Maps 2D Satellite with Labels via Cesium ion", defaultVisible: false,
  source: { ...basemap.source, assetId: 3830183 },
};
const r2 = "https://pub-96ef85504a2f4e21856c3803c375b9ea.r2.dev";

// Extensão dos tiles dos XMLs, não o limite da área efetiva do levantamento.
const rasterBounds: [number, number, number, number] = [-46.40625, -22.917923, -46.0546874, -22.593726];

function raster(id: string, name: string, kind: ProjectLayerConfig["kind"], folder: string, panelOrder: number): ProjectLayerConfig {
  return {
    id, name, description: "", kind, panelOrder, defaultVisible: false,
    opacityControl: true, exclusiveGroup: "derivados",
    source: {
      format: "tms", url: `${r2}/${folder}/{z}/{x}/{reverseY}.png`, credit: "",
      bounds: rasterBounds, minimumLevel: 10, maximumLevel: 19, tileWidth: 256, tileHeight: 256,
    },
  };
}

const mdt: ProjectLayerConfig = { ...raster("mdt", "Modelo Digital do Terreno", "dtm", "mdt", 1), legendMode: "embedded" };
// Unidade e legenda da declividade serão fornecidas posteriormente.
const declividade = raster("declividade", "Mapa da Declividade", "slope", "decli", 2);
const aspecto: ProjectLayerConfig = { ...raster("aspecto", "Mapa da Orientação das Vertentes", "aspect", "aspect", 3), legendMode: "embedded" };


// Arquivos Macro preservados como fonte; popups seguem os presets compartilhados.
const macroPolygon = (id: string, name: string, file: string, macroPopup: "municipality" | "climate" | "geology" | "geomorphology" | "soils" | "vegetation" | "ana-basin" | "simulated-basins", color: string, panelOrder: number, zIndex: number): ProjectLayerConfig => ({
  id, name, description: name, group: "macro", kind: "vector", defaultVisible: false, opacityControl: true, panelOrder,
  source: { format: "geojson", url: `${r2}/geojson/${file}.geojson`, autoZoom: false, ignoreAltitude: true, uniqueFeatureIds: true, macroPopup,
    style: { stroke: color, strokeWidth: 1.5, fill: color, fillOpacity: 0.12, clampToGround: true, zIndex } },
});
// Cor estável por STREAM_ID, sem alterar o GeoJSON publicado.
const basinColors = ["#E6194B", "#3CB44B", "#4363D8", "#F58231", "#911EB4", "#42D4F4", "#F032E6", "#BFEF45", "#FABED4", "#469990", "#DCBEFF", "#9A6324", "#FFE119", "#800000", "#AAFFC3", "#808000", "#FFD8B1", "#000075", "#A9A9A9"];
const macroLayers: ProjectLayerConfig[] = [
  {
    id: "dem-macro", name: "DEM Macro", description: "Raster de elevação de contexto regional", group: "macro", kind: "dtm", defaultVisible: false, opacityControl: true, panelOrder: 0, legendMode: "embedded",
    source: {
      format: "tms", url: `${r2}/dem_macro/{z}/{x}/{reverseY}.png`, credit: "",
      bounds: [-50.625, -27.0591258, -44.9999999, -21.9430455],
      minimumLevel: 6, maximumLevel: 15, tileWidth: 256, tileHeight: 256,
    },
  },
  macroPolygon("macro-clima", "Clima — IBGE", "clima_ibge", "climate", "#60A5FA", 2, 1),
  macroPolygon("macro-geologia", "Geologia — IBGE", "geologia_ibge", "geology", "#A78BFA", 3, 2),
  macroPolygon("macro-geomorfologia", "Geomorfologia — IBGE", "geomorfologia_ibge", "geomorphology", "#F59E0B", 4, 3),
  macroPolygon("macro-pedologia", "Pedologia — IBGE", "pedologia_ibge", "soils", "#B7794C", 5, 4),
  macroPolygon("macro-vegetacao", "Vegetação — IBGE", "vegetacao_ibge", "vegetation", "#22C55E", 6, 5),
  macroPolygon("macro-municipio", "Contexto municipal — IBGE", "info_municipio", "municipality", "#FFFFFF", 1, 6),
  macroPolygon("macro-bacia-ana", "Microbacia — ANA", "microbacia_ana", "ana-basin", "#38BDF8", 8, 7),
  {
    ...macroPolygon("macro-bacias-simuladas", "Microbacias simuladas", "simu_microbacia", "simulated-basins", "#F97316", 10, 8),
    source: {
      format: "geojson", url: `${r2}/geojson/simu_microbacia.geojson`, autoZoom: false, ignoreAltitude: true, uniqueFeatureIds: true, macroPopup: "simulated-basins",
      style: {
        stroke: "#F97316", strokeWidth: 1.5, fillOpacity: 0.35, clampToGround: true, zIndex: 8,
        classification: { property: "STREAM_ID", classes: Object.fromEntries(basinColors.map((color, index) => [String(index + 1), { fill: color, stroke: color }])) },
        outline: { property: "STREAM_ID", width: 1.5, colors: ["#F97316", ...basinColors] },
      },
    },
  },
  {
    id: "macro-curvas-10m", name: "Curvas de nível (10 m)", description: "Cotas da fonte; datum vertical não informado", group: "macro", kind: "contours", defaultVisible: false, panelOrder: 11,
    source: { format: "geojson", url: `${r2}/geojson/curvas_10m.geojson`, autoZoom: false, ignoreAltitude: true, uniqueFeatureIds: true, macroPopup: "macro-contours",
      style: { stroke: "#222222", strokeWidth: 1, clampToGround: true, zIndex: 10 } },
  },
  {
    id: "macro-drenagem-ana", name: "Drenagem — ANA", description: "Hidrografia da base ANA fornecida", group: "macro", kind: "drainage", defaultVisible: false, panelOrder: 7,
    source: { format: "geojson", url: `${r2}/geojson/drenagem_ana.geojson`, autoZoom: false, ignoreAltitude: true, uniqueFeatureIds: true, macroPopup: "ana-hydrography",
      style: { stroke: "#00BFFF", strokeWidth: 2, clampToGround: true, zIndex: 15 } },
  },
  {
    id: "macro-drenagem-simulada", name: "Drenagem simulada", description: "STRAHLER preservado da fonte", group: "macro", kind: "drainage", defaultVisible: false, panelOrder: 9,
    source: { format: "geojson", url: `${r2}/geojson/simu_drenagem.geojson`, autoZoom: false, ignoreAltitude: true, uniqueFeatureIds: true, macroPopup: "simulated-drainage", symbology: "simulated-drainage-strahler",
      style: { stroke: "#00E5FF", strokeWidth: 1, clampToGround: true, zIndex: 16 } },
  },
];

// O R2 recebeu os originais, não as cópias preparadas. ELEVATION e DRAIN_AREA
// já contêm suas unidades: não acrescentar suffix para evitar "m m" / "ha ha".
const microContours = (interval: 2 | 3, panelOrder: number): ProjectLayerConfig => ({
  id: `micro-curvas-${interval}m`, name: `Curvas de nível (${interval} m)`, description: "Cotas da fonte; datum vertical não informado", group: "vector", kind: "contours", defaultVisible: false, panelOrder, exclusiveGroup: "micro-curvas",
  source: { format: "geojson", url: `${r2}/geojson/micro/curvas_${interval}m.geojson`, autoZoom: false, ignoreAltitude: true, uniqueFeatureIds: true,
    style: { stroke: "#000000", strokeWidth: 1, clampToGround: true, zIndex: 20 },
    popup: { title: "Curva de nível", fields: [
      { property: "ELEVATION", label: "Cota da fonte" },
      { property: "cota_m", label: "Cota da fonte", decimals: 0, suffix: " m" },
    ] },
  },
});
const microLayers: ProjectLayerConfig[] = [
  microContours(2, 2),
  microContours(3, 3),
  {
    id: "micro-drenagem", name: "Rede de drenagem", description: "Ordem de Strahler preservada da fonte", group: "vector", kind: "drainage", defaultVisible: false, panelOrder: 4,
    source: { format: "geojson", url: `${r2}/geojson/micro/rede_drenagem.geojson`, autoZoom: false, ignoreAltitude: true, uniqueFeatureIds: true,
      style: { stroke: "#00E5FF", strokeWidth: 1, clampToGround: true, zIndex: 25,
        classification: { property: "STRAHLER", classes: {
          1: { stroke: "#00E5FF", strokeWidth: 1, zIndex: 25 },
          2: { stroke: "#14B8F0", strokeWidth: 1.6, zIndex: 26 },
          3: { stroke: "#1E88E5", strokeWidth: 2.4, zIndex: 27 },
          4: { stroke: "#1546D8", strokeWidth: 3.4, zIndex: 28 },
          5: { stroke: "#0B2A9E", strokeWidth: 4.4, zIndex: 29 },
        } },
      },
      popup: { title: "Drenagem", fields: [
        { property: "STREAM_ID", label: "Trecho", format: "integer" },
        { property: "STRAHLER", label: "Ordem de Strahler", format: "integer" },
        { property: "DRAIN_AREA", label: "Área de contribuição" },
        { property: "comprimento_m", label: "Comprimento", decimals: 1, suffix: " m" },
      ] },
    },
  },
  {
    id: "micro-perimetro", name: "Perímetro do imóvel", description: "Perímetro conforme arquivo fornecido; não substitui documento cadastral", group: "vector", kind: "property-boundary", defaultVisible: true, panelOrder: 1,
    source: { format: "geojson", url: `${r2}/geojson/micro/peri_imovel.geojson`, autoZoom: false, ignoreAltitude: true, uniqueFeatureIds: true,
      style: { stroke: "#FFD400", strokeWidth: 2.5, fillOpacity: 0, clampToGround: true, zIndex: 35 },
      popup: { titleProperty: "nome_area", fields: [
        { property: "registro_m", label: "Matrícula" },
        { property: "status", label: "Situação informada" },
        { property: "parcela_co", label: "Código da parcela" },
        { property: "data_aprov", label: "Data de aprovação informada" },
      ] },
    },
  },
];

export const project: ProjectConfig = {
  ...templateProject,
  id: "joy",
  name: "Joy",
  location: "Itapeva-MG",
  initialCamera: { longitude: -46.1432459, latitude: -22.6349566, height: 1973.5, heading: 225.54, pitch: -43.33, roll: 0 },
  layers: [basemap, googleBasemap, mdt, declividade, aspecto, ...macroLayers, ...microLayers],
  panel: { ...templateProject.panel, sectionTitles: { ...templateProject.panel?.sectionTitles, vector: "Análise Micro", macro: "Análise Macro" } },
  scenes: [],
  diagnostic: { steps: [] },
  developmentTools: { modelAlignment: false, cropAuthoring: false, cameraCapture: false },
};
