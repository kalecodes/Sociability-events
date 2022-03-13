const router = require('express').Router();
const { Event, EventTags, Tag, User } = require('../models')
// Import custom middleware
// const withAuth = require('../utils/auth');


// get all events (use custom middleware before allowing user to access all)
router.get('/', withAuth, (req, res) => {
    Event.findAll({
        attributes: [
            'id',
            'name',
            'location',
            'description',
            'date'
        ],
        include: [
            {
                model: User, 
                attributes: [
                    'id',
                    'username'
                ]
            },
            {
                model: Tag,
                attributes: [
                    'id',
                    'tag_title'
                ],
                through: EventTags,
                as: 'tags'
            }
        ]
    })
    .then(dbEventData => {
        if (!dbEventData) {
            res.status(404).json({ message: 'No events found'})
        }
        res.json(dbEventData);
        const events = dbEventData.map(event => event.get({ plain: true }));
        // res.render('homepage', {
        //     events,
        //     loggedIn: req.session.loggedIn
        // });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});


module.exports = router;