const router = require('express').Router();
const { Project, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login', {loggedIn: req.session.logged_in});
});

router.get('/aboutus', async (req, res) => {

  res.render('aboutus');
});

router.get('/newsroute', async (req, res) => {
  try {
    const newsData = await fetch("https://bing-news-search1.p.rapidapi.com/news?textFormat=Raw&safeSearch=Off&category=Technology&count=1", {
      "method": "GET",
      "headers": {
        "x-bingapis-sdk": "true",
        "x-rapidapi-key": "097fb3d41amsh0e2da97c764226bp163ae3jsnb6ec3626050a",
        "x-rapidapi-host": "bing-news-search1.p.rapidapi.com"
      }
    }).then(response => response.json()); 
    console.log("newsData", newsData)
    res.render('news', {
      newsData: newsData.value
      
    }
    
     );
  } catch (err) {
    res.status(500).json(err);
    console.log("news");
  }
});

router.get('/timer', async (req, res) => {

  res.render('timer');
});

router.get('/tracker', async (req, res) => {

  res.render('tracker');
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
