** TrueEarth **

- Features:
  [] Extreme Weather Events(Today, Yesterday, Weekly, Month).
  [] Events(Wildfire, Flood, EarthQuake, etc..).
  [] Temperature Data(Based on Country, and Average of States, Global Average).
  [] Pollution Levels.(Based on Country States).
  [] Population Density.
  [] Forest Cover(Current Data, and Past Data).
  [] Deforestation(Regional).
  [] Weather(Temperature, Rainfall, Humidity).
  [] Change in Climate Patterns(Past Data).
  [] El Nino, La Nina(This Year, Pas Years).

Before Putting the data in DB, need to filter out the data, with high confidence,
that could be done by `confidence` field, and/or confirming it with `land_burned` data, for
more confidence, it could also confirm it against `aqi` of that area/region.

Fetch data from FIRMS, check for confidence, against `land_burned` increase confidence,
get aqi data put inside db.

Also need data about the land,(forest)

Disaster Type

Drought
Flood
Extreme Temperature
EarthQuake
Wildfire
Mass Movement (wet)
Volcanic activity
Mass movement (dry)
Glacial lake outburst
Storm
