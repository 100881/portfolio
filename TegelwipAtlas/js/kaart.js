const map = L.map('map', {
  zoomControl: false,
  minZoom: 7,
  maxZoom: 18,
  maxBounds: [[50.2, 2.8], [54.2, 7.7]],
  maxBoundsViscosity: 0.8,
  worldCopyJump: false,
  noWrap: true
}).setView([52.2, 5.3], 8);


L.control.zoom({
  position: 'bottomleft'
}).addTo(map);


const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
  maxZoom: 18
});

const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenTopoMap contributors',
  maxZoom: 17
});


const baseLayers = {
  "🗺️ Stratenkaart": streetLayer,
  "🛰️ Satelliet": satelliteLayer,
  "🏔️ Topografisch": topoLayer
};

L.control.layers(baseLayers).addTo(map);


const provincieStatistieken = {
  "Utrecht": { 
    groeneDaken: 14250, 
    initiatieven: 42, 
    co2: 2180,
    bevolking: 1380000,
    bomen: 85000,
    parken: 120
  },
  "Noord-Holland": { 
    groeneDaken: 21500, 
    initiatieven: 67, 
    co2: 3450,
    bevolking: 2900000,
    bomen: 180000,
    parken: 210
  },
  "Zuid-Holland": { 
    groeneDaken: 23200, 
    initiatieven: 58, 
    co2: 3200,
    bevolking: 3700000,
    bomen: 165000,
    parken: 190
  },
  "Gelderland": { 
    groeneDaken: 18800, 
    initiatieven: 52, 
    co2: 2950,
    bevolking: 2100000,
    bomen: 220000,
    parken: 180
  },
  "Noord-Brabant": { 
    groeneDaken: 25000, 
    initiatieven: 71, 
    co2: 3800,
    bevolking: 2600000,
    bomen: 190000,
    parken: 165
  },
  "Limburg": { 
    groeneDaken: 16000, 
    initiatieven: 38, 
    co2: 2500,
    bevolking: 1100000,
    bomen: 140000,
    parken: 95
  },
  "Overijssel": { 
    groeneDaken: 13500, 
    initiatieven: 34, 
    co2: 2100,
    bevolking: 1200000,
    bomen: 160000,
    parken: 110
  },
  "Drenthe": { 
    groeneDaken: 11500, 
    initiatieven: 28, 
    co2: 1900,
    bevolking: 500000,
    bomen: 180000,
    parken: 85
  },
  "Groningen": { 
    groeneDaken: 10700, 
    initiatieven: 25, 
    co2: 1750,
    bevolking: 600000,
    bomen: 95000,
    parken: 70
  },
  "Friesland": { 
    groeneDaken: 12400, 
    initiatieven: 31, 
    co2: 2000,
    bevolking: 650000,
    bomen: 120000,
    parken: 90
  },
  "Flevoland": { 
    groeneDaken: 9600, 
    initiatieven: 22, 
    co2: 1600,
    bevolking: 430000,
    bomen: 65000,
    parken: 45
  },
  "Zeeland": { 
    groeneDaken: 8900, 
    initiatieven: 19, 
    co2: 1450,
    bevolking: 380000,
    bomen: 75000,
    parken: 55
  }
};

let geselecteerdeProvincie = null;
let locatieMarker = null;
let nederlandGeoJSON = null; 


async function zoekLocatie(query) {
  try {
 
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=nl&limit=5&addressdetails=1`);
    const results = await response.json();
    
    return results.map(result => ({
      name: result.display_name,
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      address: result.address,
      type: result.type,
      importance: result.importance
    }));
  } catch (error) {
    console.error('Zoekfout:', error);
    return [];
  }
}


function getProvincieVoorCoordinaten(lat, lon) {
  if (!nederlandGeoJSON) {
    console.warn('Nederlandse provinciedata nog niet geladen');
    return 'Onbekend';
  }

  const point = turf.point([lon, lat]);
  

  for (const feature of nederlandGeoJSON.features) {
    try {
      if (turf.booleanPointInPolygon(point, feature)) {
        return getProvincieNaam(feature);
      }
    } catch (error) {
      console.warn('Fout bij provincie detectie:', error);
    }
  }
  
 
  let dichtsteBij = null;
  let kleinsteAfstand = Infinity;
  
  for (const feature of nederlandGeoJSON.features) {
    try {
      const centroid = turf.centroid(feature);
      const afstand = turf.distance(point, centroid);
      
      if (afstand < kleinsteAfstand) {
        kleinsteAfstand = afstand;
        dichtsteBij = feature;
      }
    } catch (error) {
      console.warn('Fout bij afstandsberekening:', error);
    }
  }
  
  return dichtsteBij ? getProvincieNaam(dichtsteBij) : 'Onbekend';
}


function extractLokaleInfo(address, lat, lon) {
  let locatie = 'Onbekende locatie';
  let stad = 'Onbekend';
  let provincie = getProvincieVoorCoordinaten(lat, lon);
  
  if (address) {
   
    if (address.road) {
      locatie = address.road;
      if (address.house_number) {
        locatie += ' ' + address.house_number;
      }
    } else if (address.neighbourhood) {
      locatie = address.neighbourhood;
    } else if (address.suburb) {
      locatie = address.suburb;
    } else if (address.hamlet) {
      locatie = address.hamlet;
    } else if (address.village) {
      locatie = address.village;
    } else if (address.town) {
      locatie = address.town;
    } else if (address.city) {
      locatie = address.city;
    }
    
   
    stad = address.city || address.town || address.village || address.municipality || address.hamlet || 'Onbekend';
    
  
    if (address.state) {
      provincie = address.state;
    }
  }
  
  return { locatie, stad, provincie };
}


function genereerLokaleStatistieken(lat, lon, address) {
  
  const isStedelijk = address && (address.city || address.town || address.village);
  const populatieDichtheid = isStedelijk ? Math.random() * 3000 + 1000 : Math.random() * 500 + 100;
  
 
  const lokaleStats = {
    groeneDaken: Math.floor(Math.random() * 50 + 10),
    straatbomen: Math.floor(Math.random() * 200 + 50),
    co2Reductie: Math.floor(Math.random() * 100 + 20),
    groeneRuimte: Math.floor(Math.random() * 30 + 5),
    parkeerplaatsen: Math.floor(Math.random() * 15 + 3),
    fietsenstallingen: Math.floor(Math.random() * 25 + 5),
    zonnepanelen: Math.floor(Math.random() * 80 + 20),
    regenwater: Math.floor(Math.random() * 40 + 10)
  };


  const { locatie, stad, provincie } = extractLokaleInfo(address, lat, lon);

  return {
    ...lokaleStats,
    locatie,
    stad,
    provincie
  };
}


function toonZoekresultaten(resultaten) {
  const resultsContainer = document.getElementById('search-results');
  
  if (resultaten.length === 0) {
    resultsContainer.innerHTML = '<div class="search-result-item">Geen resultaten gevonden</div>';
    return;
  }
  
  resultsContainer.innerHTML = '';
  
  resultaten.forEach(result => {
    const resultItem = document.createElement('div');
    resultItem.className = 'search-result-item';
    
 
    const { locatie, stad, provincie } = extractLokaleInfo(result.address, result.lat, result.lon);
    
    resultItem.innerHTML = `
      <strong>${locatie}</strong><br>
      <small>${stad}${result.address?.postcode ? ', ' + result.address.postcode : ''}</small><br>
      <small style="color: #666;">${provincie}</small>
    `;
    
    resultItem.addEventListener('click', () => {
      selecteerLocatie(result);
    });
    
    resultsContainer.appendChild(resultItem);
  });
}


function selecteerLocatie(locatie) {
 
  if (locatieMarker) {
    map.removeLayer(locatieMarker);
  }
 
  locatieMarker = L.marker([locatie.lat, locatie.lon], {
    icon: L.divIcon({
      className: 'location-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })
  }).addTo(map);
  
  
  map.setView([locatie.lat, locatie.lon], 15);
  
 
  const lokaleStats = genereerLokaleStatistieken(locatie.lat, locatie.lon, locatie.address);
  
  
  locatieMarker.bindPopup(`
    <div style="text-align: center; padding: 12px; min-width: 200px;">
      <h3 style="color: #1b5e20; margin-bottom: 12px; font-size: 16px;">📍 ${lokaleStats.locatie}</h3>
      <p style="margin: 4px 0; font-size: 13px;"><strong>🏘️ Stad:</strong> ${lokaleStats.stad}</p>
      <p style="margin: 4px 0; font-size: 13px;"><strong>🗺️ Provincie:</strong> ${lokaleStats.provincie}</p>
      <hr style="margin: 8px 0; border: 1px solid #e0e0e0;">
      <p style="margin: 4px 0; font-size: 13px;"><strong>🏠 Groene daken:</strong> ${lokaleStats.groeneDaken} m²</p>
      <p style="margin: 4px 0; font-size: 13px;"><strong>🌳 Straatbomen:</strong> ${lokaleStats.straatbomen}</p>
      <p style="margin: 4px 0; font-size: 13px;"><strong>♻️ CO₂-reductie:</strong> ${lokaleStats.co2Reductie} kg/jaar</p>
      <p style="margin: 4px 0; font-size: 13px;"><strong>🌿 Groene ruimte:</strong> ${lokaleStats.groeneRuimte}%</p>
      <p style="margin: 4px 0; font-size: 13px;"><strong>☀️ Zonnepanelen:</strong> ${lokaleStats.zonnepanelen}%</p>
    </div>
  `).openPopup();
  
 
  document.getElementById('search-results').innerHTML = '';
  document.getElementById('search-input').value = '';
}


document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const searchResults = document.getElementById('search-results');
  

  searchButton.addEventListener('click', async function() {
    const query = searchInput.value.trim();
    if (query) {
      searchButton.textContent = 'Zoeken...';
      searchButton.disabled = true;
      
      try {
        const resultaten = await zoekLocatie(query);
        toonZoekresultaten(resultaten);
      } catch (error) {
        console.error('Zoekfout:', error);
        searchResults.innerHTML = '<div class="search-result-item">Fout bij zoeken</div>';
      }
      
      searchButton.textContent = 'Zoeken';
      searchButton.disabled = false;
    }
  });
  
 
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchButton.click();
    }
  });
  
 
  let searchTimeout;
  searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    
    clearTimeout(searchTimeout);
    
    if (query.length >= 3) {
      searchTimeout = setTimeout(async () => {
        try {
          const resultaten = await zoekLocatie(query);
          toonZoekresultaten(resultaten);
        } catch (error) {
          console.error('Live zoekfout:', error);
        }
      }, 500);
    } else {
      searchResults.innerHTML = '';
    }
  });
});


fetch('https://cartomap.github.io/nl/wgs84/provincie_2023.geojson')
  .then(response => response.json())
  .then(data => {
   
    nederlandGeoJSON = data;
    
    
    const nederlandLayer = L.geoJSON(data, {
      style: function(feature) {
        return {
          fillColor: getProvincieKleur(feature),
          weight: 2,
          opacity: 0.9,
          color: '#1b5e20',
          fillOpacity: 0.4
        };
      },
      onEachFeature: onEachProvince
    }).addTo(map);

  
    const bounds = nederlandLayer.getBounds();
    map.fitBounds(bounds, {
      padding: [20, 400],
      maxZoom: 8
    });


    createNederlandMask(data, nederlandLayer);
  })
  .catch(error => {
    console.error('Fout bij laden van kaartgegevens:', error);
    document.querySelector('.panel-content').innerHTML = 
      '<div class="loading">⚠️ Fout bij laden van kaartgegevens</div>';
  });

function getProvincieKleur(feature) {
  const naam = getProvincieNaam(feature);
  const stats = provincieStatistieken[naam];
  
  if (!stats) return '#81c784';

  const dakenPerInwoner = stats.groeneDaken / stats.bevolking * 1000;
  
  if (dakenPerInwoner > 9) return '#0d4f1c';
  if (dakenPerInwoner > 7) return '#1b5e20';
  if (dakenPerInwoner > 5) return '#2e7d32';
  if (dakenPerInwoner > 3) return '#4caf50';
  return '#66bb6a';
}

function createNederlandMask(nederlandData, nederlandLayer) {
 
  let union = null;
  nederlandData.features.forEach(feature => {
    if (!union) {
      union = feature;
    } else {
      union = turf.union(union, feature);
    }
  });


  const wereldMask = turf.bboxPolygon([-180, -85, 180, 85]);
  const mask = turf.difference(wereldMask, union);

  if (mask) {
    L.geoJSON(mask, {
      style: {
        fillColor: '#e8f5e8',
        fillOpacity: 1.0,
        stroke: false
      },
      interactive: false,
      pane: 'overlayPane'
    }).addTo(map);
  }


  if (union) {
    L.geoJSON(union, {
      style: {
        fillColor: 'transparent',
        weight: 3,
        opacity: 0.9,
        color: '#1b5e20',
      },
      interactive: false
    }).addTo(map);
  }

  map.on('zoomend', function() {
    const currentZoom = map.getZoom();
    
    if (nederlandLayer) {
      const opacity = currentZoom >= 12 ? 0.2 : 0.4;
      nederlandLayer.setStyle({
        fillOpacity: opacity
      });
    }
  });
}

function onEachProvince(feature, layer) {
  const naam = getProvincieNaam(feature);

  layer.on('mouseover', function() {
    if (geselecteerdeProvincie !== layer) {
      layer.setStyle({
        weight: 4,
        fillOpacity: 0.6,
        color: '#0d4f1c'
      });
    }
  });

  layer.on('mouseout', function() {
    if (geselecteerdeProvincie !== layer) {
      const currentZoom = map.getZoom();
      const opacity = currentZoom >= 12 ? 0.2 : 0.4;
      layer.setStyle({
        weight: 2,
        fillOpacity: opacity,
        color: '#1b5e20'
      });
    }
  });


  layer.on('click', function() {
    selecteerProvincie(layer, naam);
  });

  // Popup
  const stats = provincieStatistieken[naam];
  if (stats) {
    layer.bindPopup(`
      <div style="text-align: center; padding: 8px;">
        <h3 style="color: #1b5e20; margin-bottom: 12px; font-size: 18px;">${naam}</h3>
        <p style="margin: 6px 0;"><strong>🏠 Groene daken:</strong> ${stats.groeneDaken.toLocaleString()} m²</p>
        <p style="margin: 6px 0;"><strong>🌱 Initiatieven:</strong> ${stats.initiatieven}</p>
        <p style="margin: 6px 0;"><strong>🌍 CO₂-reductie:</strong> ${stats.co2.toLocaleString()} ton</p>
        <p style="margin: 6px 0;"><strong>🌳 Bomen:</strong> ${stats.bomen.toLocaleString()}</p>
      </div>
    `);
  }
}

function selecteerProvincie(layer, naam) {

  if (geselecteerdeProvincie) {
    const currentZoom = map.getZoom();
    const opacity = currentZoom >= 12 ? 0.2 : 0.4;
    geselecteerdeProvincie.setStyle({
      weight: 2,
      fillOpacity: opacity,
      color: '#1b5e20'
    });
  }


  geselecteerdeProvincie = layer;
  layer.setStyle({
    weight: 5,
    fillOpacity: 0.7,
    color: '#0d4f1c'
  });

  updateInfoPanel(naam);
}

function updateInfoPanel(provincieNaam) {
  const stats = provincieStatistieken[provincieNaam];
  const panelContent = document.querySelector('.panel-content');

  if (stats) {
    const dakenPerInwoner = (stats.groeneDaken / stats.bevolking * 1000).toFixed(1);
    const co2PerInwoner = (stats.co2 / stats.bevolking * 1000).toFixed(1);
    const bomenPerInwoner = (stats.bomen / stats.bevolking * 1000).toFixed(0);

    panelContent.innerHTML = `
      <div class="province-info">
        <h3>🌿 ${provincieNaam}</h3>
        
        <div class="stat-item">
          <div class="stat-icon">🏠</div>
          <div class="stat-details">
            <div class="stat-label">Groene Daken Totaal</div>
            <div class="stat-value">${stats.groeneDaken.toLocaleString()} m²</div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon">🌱</div>
          <div class="stat-details">
            <div class="stat-label">Groene Initiatieven</div>
            <div class="stat-value">${stats.initiatieven} projecten</div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon">🌍</div>
          <div class="stat-details">
            <div class="stat-label">CO₂-reductie Totaal</div>
            <div class="stat-value">${stats.co2.toLocaleString()} ton</div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon">🌳</div>
          <div class="stat-details">
            <div class="stat-label">Aantal Bomen</div>
            <div class="stat-value">${stats.bomen.toLocaleString()}</div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon">📊</div>
          <div class="stat-details">
            <div class="stat-label">Groene Daken per 1000 inw.</div>
            <div class="stat-value">${dakenPerInwoner} m²</div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon">♻️</div>
          <div class="stat-details">
            <div class="stat-label">CO₂-reductie per 1000 inw.</div>
            <div class="stat-value">${co2PerInwoner} kg</div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon">🌲</div>
          <div class="stat-details">
            <div class="stat-label">Bomen per 1000 inwoners</div>
            <div class="stat-value">${bomenPerInwoner}</div>
          </div>
        </div>
      </div>
    `;
  } else {
    panelContent.innerHTML = `
      <div class="loading">
        🚫 Geen gegevens beschikbaar voor ${provincieNaam}
      </div>
    `;
  }
}

function getProvincieNaam(feature) {
  return feature.properties.name || 
         feature.properties.naam || 
         feature.properties.statnaam ||
         'Onbekend';
}

document.querySelectorAll('.shortcut-tag').forEach(tag => {
  console.log('Tag gevonden:', tag);
  tag.addEventListener('click', function() {
    console.log('Click detected!'); 
    const searchTerm = this.dataset.search;
    console.log('Search term:', searchTerm); h
    
    const searchInput = document.getElementById('search-input');
    console.log('Search input element:', searchInput); 
    if (searchInput) {
      searchInput.value = searchTerm;
    }
    
  });
});