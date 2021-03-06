var mongoose = require("mongoose"),
    Campgrounds = require("./models/campgrounds");
    Comments = require("./models/comments")

var data  = [{
        name: "Munnar Hills",
        image: "https://www.keralatourism.org/images/destination/large/munnar20180720141650_202_1.jpg",
        description: "It is a hill station famous for tea plantation",
        author: {
            id : "5d4c5266d7fbf808e65443c7",
            username : "Cyril"
        },
        price : 12,
        lat: 10.085973,
        lng: 77.062547,
        location : "Munnar"
    },
    {
        name: "Idukki",
        image: "https://img.theweek.in/content/dam/week/news/india/images/2018/7/30/idukki-dam-aravind-bala.jpg",
        description: "It is a famous tourist center.",
        author :  {
            id : "5d4c4b303d40dc074ed20092",
            username : "Shreyas"
        },
        price : 15,
        lat : 9.854271,
        lng : 76.912169,
        location : "Idukki"
    },
    {
        name: "Vagamon",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/03/d4/36/53/green-meadows-vagamon.jpg",
        description: "It is a hill station famous for the cold weather",
        author :  {
            id : "5d4c4b303d40dc074ed20092",
            username : "Shreyas"
        },
        price : 13.50,
        lat : 9.680498,
        lng : 76.902645,
        location : "Vagamon"
    }
]

function seedDb() {
    // Remove all campgrounds
    Campgrounds.deleteMany({}, (err) => {
        // Add a few campgrounds
        data.forEach((campground) => {
            Campgrounds.create(campground, (err, campground) => {
                if (err) {
                    console.log(err)
                } else {
                    // Create a coomment
                    Comments.create({
                        text: "This place is great",
                        author: {
                            id : "5d4c5266d7fbf808e65443c7",
                            username : "Cyril"
                        }
                    }, (err, comment) => {
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                        }
                    })
                }
            })
        });
    });
}

module.exports = seedDb;