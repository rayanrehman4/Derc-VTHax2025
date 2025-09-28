import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX

# --- Load and clean dataset ---
data = pd.read_excel("dataVa.xlsx", sheet_name="Sheet 1")   # adjust path if needed
data["Region"] = data["Region"].ffill()
data["Date"] = pd.to_datetime(data["Month of Period End"], errors="coerce")
data = data[["Region", "Date", "Median Sale Price"]].dropna()

# --- Forecast function ---
def forecast_region_fast(df, region, periods=36):
    ts = df[df["Region"] == region].set_index("Date")["Median Sale Price"].dropna()

    # skip if no usable series
    if ts.empty or len(ts) < 24:  # require at least 2 years of data
        print(f"Skipping {region}: series empty or too short after cleaning")
        return pd.DataFrame(columns=["Region", "Date", "mean"])

    try:
        model = SARIMAX(ts, order=(1,1,1), seasonal_order=(1,1,1,12),
                        enforce_stationarity=False, enforce_invertibility=False)
        results = model.fit(disp=False)
        forecast = results.get_forecast(steps=periods)
        fc_df = forecast.summary_frame()
        future_dates = pd.date_range(ts.index[-1] + pd.offsets.MonthEnd(1),
                                     periods=periods, freq="M")
        fc_df = fc_df.reset_index(drop=True)
        fc_df["Date"] = future_dates
        fc_df["Region"] = region
        return fc_df[["Region", "Date", "mean"]]
    except Exception as e:
        print(f"Skipping {region}: {e}")
        return pd.DataFrame(columns=["Region", "Date", "mean"])

# --- Forecast all regions ---
regions = data["Region"].unique()
all_forecasts = pd.concat([forecast_region_fast(data, r) for r in regions])

# 🔧 Ensure Date is datetime
all_forecasts["Date"] = pd.to_datetime(all_forecasts["Date"], errors="coerce")
all_forecasts = all_forecasts.dropna(subset=["Date"])

# --- Filter 2026–2028 ---
forecasted_prices = all_forecasts[
    (all_forecasts["Date"].dt.year >= 2026) & (all_forecasts["Date"].dt.year <= 2028)
].copy()

# --- Summarize yearly averages ---
forecasted_prices["Year"] = forecasted_prices["Date"].dt.year
yearly_summary = (
    forecasted_prices.groupby(["Region", "Year"])["mean"]
    .mean()
    .reset_index()
    .rename(columns={"mean": "Avg Predicted Median Sale Price"})
)

# --- Convert to flat JSON ---
json_output = yearly_summary.to_json(orient="records", indent=2)
print(json_output)   # shows JSON in terminal

# --- Save to file (optional) ---
with open("housing_forecast_2026_2028Va.json", "w") as f:
    f.write(json_output)
