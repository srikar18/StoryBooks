const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Story');

// @desc Add story Form 
// @route GET /stories/add 

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');
});

// @desc Add story to db
// @route POST /stories

router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user;
        await Story.create(req.body);
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
});

// @desc Get all public stories
// @GET /stories

router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean();
        res.render('stories/index', { stories });
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
});

// @desc Get a story
// @GET /stories/:id

router.get('/:storyId', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.storyId).populate('user').lean();
        if (!story) {
            return res.render('error/404');
        }
        res.render('stories/show', { story });
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
});

// @desc Edit story
// @GET /stories/edit/storyId

router.get('/edit/:storyId', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.storyId).lean();
        if (!story) {
            return res.render('error/404');
        }
        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            res.render('stories/edit', { story });
        }
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
});

// @desc Update story
// @PUT /stories/edit/storyId

router.put('/edit/:storyId', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.storyId).lean();
        if (!story) {
            return res.render('error/404');
        }
        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            story = await Story.findByIdAndUpdate({ _id: req.params.storyId }, req.body,
                {
                    new: true,
                    runValidators: true
                });
            res.redirect('/dashboard');
        }
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
});

// @desc Delete story
// @DELETE /stories/edit/storyId

router.delete('/:storyId', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.storyId).lean();
        if (!story) {
            return res.render('error/404');
        }
        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            await Story.findByIdAndDelete(req.params.storyId);
            res.redirect('/dashboard');
        }
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
});

// @desc Get user stories
// @GET /stories/user/userId

router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.params.userId, status: 'public' })
            .populate('user')
            .lean();
        res.render('stories/index', { stories });
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
});

module.exports = router;