import * as express from 'express';
import traffic from './api/traffic';
import tiktok from './api/tiktok';
// import facebook_ads from './api/facebook-ads'
import * as path from 'path'; // Import the 'path' module

const app = express();

// Mount your API routes
app.use(traffic);

// Mount your API routes
app.use(tiktok);

// Mount your API routes
// app.use(facebook_ads);

app.use(express.static(path.join(__dirname, '../public')));

// Handle client-side routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/sales-tracker', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/sales-tracker/store', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
  app.get('*', (req, res) => {
    res.json('404 DEBILU NIE MA TAKIEJ STRONY, WEZ SPIERDALAJ');
  });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port: ${port}`));
