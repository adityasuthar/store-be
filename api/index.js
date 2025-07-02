import express from "express";
import cors from "cors";
import gplay from "google-play-scraper";
import appstore from "app-store-scraper";


const app = express();

app.use(cors());

// Search API
app.get("/api/search", async (req, res) => { 
  const keyword = req.query.q;
  const store = req.query.store || "playstore";
  const country = req.query.country || "us";
  const lang = req.query.lang || "en";

  if (!keyword) {
    return res.status(400).json({ message: "Please provide a keyword." });
  }

  try {
    if (store === "appstore") {
      const apps = await appstore.search({
        term: keyword,
        num: 20,
        country,
        lang,
      });
      res.json(apps);
    } else {
      const apps = await gplay.search({
        term: keyword,
        num: 20,
        country,
        lang,
      });
      res.json(apps);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error fetching data from store" });
  }
});

// Suggest API
app.get("/api/suggest", async (req, res) => {
  const searchItem = req.query.q;
  const store = req.query.store || "playstore";

  if (!searchItem) {
    return res.status(400).json({ message: "Please provide a search term." });
  }

  try {
    if (store === "appstore") {
      const suggestions = await appstore.suggest({ term: searchItem });
      res.json(suggestions); // Already array of {term: "..."}
    } else {
      const suggestions = await gplay.suggest({ term: searchItem, num: 5 });
      res.json(suggestions.map(term => ({ term })));
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error fetching suggestions." });
  }
});

export default app;









// const app = express();
// const PORT = 3001;

// app.use(cors());

// app.get("/api/search", async (req, res) => {
//   const keyword = req.query.q;

//   if (!keyword) {
//     return res.status(400).json({ message: "Please provide a keyword." });
//   }

//   try {
//     const apps = await gplay.search({
//       term: keyword,
//       num: 10,
//     });

//     res.json(apps);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ message: "Error fetching data from Play Store" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Backend server running on http://localhost:${PORT}`);
// });



// app.get("/api/suggest", async (req, res) => {
    
//       const searchItem = req.query.q;
    
//       if (!searchItem) {
//         return res.status(400).json({ message: "Please provide a searchItem." });
//       }
    
//       try {
//         const suggestedItems = await gplay.suggest({term: searchItem, num: 5}); 
//         res.json(suggestedItems);
//       } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ message: "Error fetching data from Play Store" });
//       }  
//     })