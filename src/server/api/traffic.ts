import * as express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const router = express.Router();

router.get('/api/traffic/:name', async (req, res) => {
    const name = req.params.name;
    const dataUrl = `https://data.similarweb.com/api/v1/data?domain=${name}`;
    const websiteUrl = `https://${name}`; // URL for the website to extract the logo from

    try {
        const customHeaders: Record<string, string> = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36',
        };

        // Fetch data from the data URL
        const dataResponse = await axios.get(dataUrl, {
            headers: customHeaders,
        });

        if (dataResponse.status === 200) {
            const data: Record<string, any> = dataResponse.data;

            // Check if LargeScreenshot is available
            const storeScreenshot = data.LargeScreenshot || null;

            // Fetch HTML content from the website URL
            const websiteResponse = await axios.get(websiteUrl, {
                headers: customHeaders,
            });

            if (websiteResponse.status === 200) {
                const htmlContent = websiteResponse.data;
                const $ = cheerio.load(htmlContent);

                // Extract the content of the <meta property="og:image"> tag
                const logo_1 = $('link[rel="shortcut icon"]').attr('href');
                const logo_v1 = logo_1?.replace(/32/g, '512');
                const logo_2 = $('link[rel="icon"]').attr('href');
                const logo_v2 = logo_2?.replace(/32/g, '512');

                // Transform the top_countries array
                const topCountries = data.TopCountryShares.map((countryData: Record<string, any>) => {
                    const country = data.Countries.find((c: Record<string, string>) => c.Code === countryData.CountryCode);
                    return {
                        CountryCode: countryData.CountryCode,
                        Country: country ? country.Name : countryData.CountryCode,
                        value: (countryData.Value * 100).toFixed(2)
                    };
                });

                // Transform the monthly_visitors object into an array
                const monthlyVisitors = Object.entries(data.EstimatedMonthlyVisits).map(([date, value]) => ({
                    date,
                    value
                }));

                const this_month = monthlyVisitors[2].value as number;
                const prev_month = monthlyVisitors[1].value as number;
                let percentage_increase: string = (((this_month - prev_month) / prev_month) * 100).toFixed(2);
                let percentage_increaseAsNumber: number = parseFloat(percentage_increase);

           

                // Transform the traffic_sources object
                const trafficSources = Object.keys(data.TrafficSources).map(source => ({
                    source,
                    value: Math.round(data.TrafficSources[source] * 100),
                    handler: source.toLowerCase().replace(/ /g, '_')
                }));

                const customResponse: Record<string, any> = {
                    sitename: data.SiteName,
                    description: data.Description,
                    logo: logo_v1?logo_v1:logo_v2,
                    store_screenshot: storeScreenshot,
                    top_countries: topCountries,
                    percentage_increase: percentage_increaseAsNumber,
                    monthly_visitors: monthlyVisitors,
                    traffic_sources: trafficSources,
                };

                res.json(customResponse);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
