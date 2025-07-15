# core/soil_api.py
from owslib.wcs import WebCoverageService
from rasterio.io import MemoryFile

def get_soil_data(lat: float, lon: float):
    # Define bbox around point in degrees (approx ~1km square)
    bbox = (lon - 0.01, lat - 0.01, lon + 0.01, lat + 0.01)
    crs = 'http://www.opengis.net/def/crs/EPSG/0/4326'
    
    wcs_url = 'https://maps.isric.org/mapserv?map=/map/nitrogen.map'
    wcs = WebCoverageService(wcs_url, version='2.0.1')

    # ✅ Hardcoded valid identifier
    coverage_id = 'nitrogen_0-5cm_Q0.5'

    # Get coverage
    
    print("Sending coverage_id:", coverage_id)

    response = wcs.getCoverage(
        identifier=coverage_id,
        format='image/tiff',
        bbox=bbox,
        crs=crs,
        resx=0.001,
        resy=0.001
    )

    with MemoryFile(response.read()) as memfile:
        with memfile.open() as dataset:
            band = dataset.read(1)
            center_value = band[band.shape[0] // 2, band.shape[1] // 2]
            return float(center_value)
