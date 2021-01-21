const WEIGHT_KG = 80.7394;
const HEIGHT_CM = 176.53;
const AGE = 25;
const RESTING_HEART_RATE = 70;

// https://www.cdc.gov/physicalactivity/basics/measuring/heartrate.htm
const MAX_HEART_RATE = 220 - AGE;

// https://help.fitbit.com/articles/en_US/Help_article/1565.htm
const HEART_RATE_RESERVE = MAX_HEART_RATE - RESTING_HEART_RATE;

export const BELOW_ZONES = 'below zones';
export const FAT_BURN = 'fat burn';
export const CARDIO = 'cardio';
export const PEAK = 'peak';

// (Percentage of maximum heart rate × heart rate reserve) + resting heart rate
const getZoneBound = (percent) => {
    return percent * HEART_RATE_RESERVE + RESTING_HEART_RATE;
};

export const getCalories = (d) => {
    // https://gearandgrit.com/convert-watts-calories-burned-cycling/
    const hours = (d.endTimeMs - d.startTimeMs) / (1000 * 60 * 60);
    const fromWatts = d.power * hours * 3.6;

    // https://www.verywellfit.com/what-is-bmr-or-basal-metabolic-rate-3495380
    // 88.362 + (13.397 x weight in kg) + (4.799 x height in cm) - (5.677 x age in years)
    const dailyBmr =
        88.362 + 13.397 * WEIGHT_KG + 4.799 * HEIGHT_CM - 5.677 * AGE;
    const hourlyBmr = dailyBmr / 24;
    const bmr = hourlyBmr * hours;

    return fromWatts + bmr;
};

export const getHeartRateZone = (rate) => {
    if (rate < getZoneBound(0.4)) {
        return BELOW_ZONES;
    } else if (rate < getZoneBound(0.6)) {
        return FAT_BURN;
    } else if (rate < getZoneBound(0.85)) {
        return CARDIO;
    } else {
        return PEAK;
    }
};
