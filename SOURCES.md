# Sources

The app's only external data source is listed below. The local app file contains
72 monthly records (January 2020–December 2025). The model uses reported case
counts from 2021–2024 to estimate month-specific Poisson parameters; it excludes
2020 by student choice and keeps 2025 as the locked test set. Deaths appear only
as historical counts and are not modeled.

| Data | Where it came from | License |
| --- | --- | --- |
| `app/dengue_monthly_2020_2025.json` | “Monthly Division-Level Dengue Cases & Mortality with Climate and Environmental Indicators in Bangladesh (2020–2025),” version 2, Mendeley Data, https://data.mendeley.com/datasets/cgwjshkx5k/2 (DOI: 10.17632/cgwjshkx5k.2). | CC BY 4.0 |
