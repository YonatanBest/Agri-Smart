import cdsapi

c = cdsapi.Client()

c.retrieve(
    'seasonal-original-single-levels',
    {
        'format': 'netcdf',
        'originating_centre': 'ecmwf',
        'system': '5',
        'variable': ['2m_temperature', 'total_precipitation'],
        'year': '2025',
        'month': '08',
        'leadtime_month': ['1', '2', '3'],
        'area': [15, 33, 3, 49],  # Ethiopia approx
        'product_type': 'monthly_mean',
        'grid': [0.5, 0.5],
    },
    'seas5_aug_ethiopia.nc'
)
