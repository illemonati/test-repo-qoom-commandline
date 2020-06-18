/*
	The purpose of this test is to create a new landing page
	so that the user can test it
*/

const 
	url = require('url')
	, path = require('path')
	, async = require('async')
	, request = require('request')
	, fs = require('fs')
	, Configs = require('../../../config.js')
	, saver = require('../../../api/apps/saver/app.js')
	, landerSchemas = require('../../../api/apps/lander/schemas.js')
	, educaterSchemas = require('../../../api/apps/educater/schemas.js')
;

const landingPage = {
	name: 'Wisen Space'
	, logo: 'https://mrlera.wisen.space/capture/load/ipmixbdik1vib6xf-kj2wjfn.png'
	, promotions: [
		{
			"tagline": "Let's Build a Coding Portfolio With Real Projects",
			"description": "Let's Build a Coding Portfolio With Real Projects",
			"image": "https://mrlera.wisen.space/_hosjlcjyrodfgapebeln5pa.jpg",
			"actions": [
				{ name: 'Coding', url: "/educate/catalog" }
				, { name: 'Beyond', url: "https://wisenspace.squarespace.com/multiplayer-teams-presentation-night" }
			]
		},
		{
			"tagline": "Learn, Build and Create Your Own Coding Community",
			"description": "Learn, Build and Create Your Own Coding Community",
			"image": "https://mrlera.wisen.space/r6sg4e3qlyephtnfyyyrg99f.jpg",
			"actions": [
				{ name: 'Coding', url: "/educate/catalog" }
				, { name: 'Beyond', url: "https://wisenspace.squarespace.com/multiplayer-teams-presentation-night" }
			]		},
		{
			"tagline": "Feel what it is like to be Empowered",
			"description": "Learn, Build and Create Your Own Coding Community",
			"image": "https://mrlera.wisen.space/emg0kll7_jcef7nvg-ljzazq.jpg",
			"actions": [
				{ name: 'Coding', url: "/educate/catalog" }
				, { name: 'Beyond', url: "https://wisenspace.squarespace.com/multiplayer-teams-presentation-night" }
			]		}

		,{
			"tagline": "Let's Build a Coding Portfolio With Real Projects",
			"description": "Let's Build a Coding Portfolio With Real Projects",
			"image": "https://mrlera.wisen.space/2ezwdcc2hqpmzqibjdoyo0r4.jpg",
			"actions": [
				{ name: 'Coding', url: "/educate/catalog" }
				, { name: 'Beyond', url: "https://wisenspace.squarespace.com/multiplayer-teams-presentation-night" }
			]		},
		{
			"tagline": "Learn, Build and Create Your Own Coding Community",
			"description": "Learn, Build and Create Your Own Coding Community",
			"image": "https://mrlera.wisen.space/iou-96njdii97rdofnrbxots.jpg",
			"actions": [
				{ name: 'Coding', url: "/educate/catalog" }
				, { name: 'Beyond', url: "https://wisenspace.squarespace.com/multiplayer-teams-presentation-night" }
			]
		},
		{
			"tagline": "Feel what it is like to be Empowered",
			"description": "Learn, Build and Create Your Own Coding Community",
			"image": "https://mrlera.wisen.space/ppznlkebae_mwou89pwkefoj.jpg",
			"actions": [
				{ name: 'Coding', url: "/educate/catalog" }
				, { name: 'Beyond', url: "https://wisenspace.squarespace.com/multiplayer-teams-presentation-night" }
			]
		}

		,{
			"tagline": "Let's Build a Coding Portfolio With Real Projects",
			"description": "Let's Build a Coding Portfolio With Real Projects",
			"image": "https://mrlera.wisen.space/20ritqakt80eubff0zt6dyns.jpg",
			"actions": [
				{ name: 'Coding', url: "/educate/catalog" }
				, { name: 'Beyond', url: "https://wisenspace.squarespace.com/multiplayer-teams-presentation-night" }
			]
		},
		{
			"tagline": "Learn, Build and Create Your Own Coding Community",
			"description": "Learn, Build and Create Your Own Coding Community",
			"image": "https://mrlera.wisen.space/b_efu-9mx_-9q_ma-c5hiww-.jpg",
			"actions": [
				{ name: 'Coding', url: "/educate/catalog" }
				, { name: 'Beyond', url: "https://wisenspace.squarespace.com/multiplayer-teams-presentation-night" }
			]
		},
		{
			"tagline": "Feel what it is like to be Empowered",
			"description": "Learn, Build and Create Your Own Coding Community",
			"image": "https://mrlera.wisen.space/zpvj5nqthrn-1piijpeytydy.jpg",
			"actions": [
				{ name: 'Coding', url: "/educate/catalog" }
				, { name: 'Beyond', url: "https://wisenspace.squarespace.com/multiplayer-teams-presentation-night" }
			]
		}

		,{
			"tagline": "Let's Build a Coding Portfolio With Real Projects",
			"description": "Let's Build a Coding Portfolio With Real Projects",
			"image": "https://mrlera.wisen.space/1p_-35qonl-lb50xpw4rlofm.jpg",
			"actions": [
				{ name: 'Coding', url: "/educate/catalog" }
				, { name: 'Beyond', url: "https://wisenspace.squarespace.com/multiplayer-teams-presentation-night" }
			]
		},
		{
			"tagline": "Learn, Build and Create Your Own Coding Community",
			"description": "Learn, Build and Create Your Own Coding Community",
			"image": "https://mrlera.wisen.space/wvdek5vfoy4stxihhmby3iax.jpg",
			"actions": [
				{ name: 'Coding', url: "/educate/catalog" }
				, { name: 'Beyond', url: "https://wisenspace.squarespace.com/multiplayer-teams-presentation-night" }
			]
		}
	]
	, navigations: [
		{
			title: 'Classes'
			, url: '#summercamps'
		}, {
			title: 'Events'
			, url: 'https://wisenspace.squarespace.com/events'
		}, {
			title: 'Coding Portfolio'
			, url: '#highlights'
		}, {
			title: 'Testimonials'
			, url: '#testimonials'
		}, {
			title: 'About Us'
			, url: 'https://wisenspace.squarespace.com/about'
		}
	]
	, copyright: 'All rights reserved.'
	, refundPolicy: {
		title: 'Refund Policy'
		, url: 'https://school.wisen.space/refundpolicy.html'
	}
	, privacyPolicy: {
		title: 'Privacy Policy'
		, url: 'https://school.wisen.space/privacypolicy.html'
	}
	, termsOfService: {
		title: 'Terms of Service'
		, url: 'https://school.wisen.space/termsofservice.html'
	}
	, classes: [
		{
			title: '2019 Summer Camps', id: 'summercamps', filter: { session: '5c4649d344183500043a8daa' }
		}, {
			title: '2019 Fall Classes', id: 'fallclasses', filter: { session: '5cfaa3c2f8660f0004eafc2c' }
		}
		// {
		// 	title: 'Test 1', id: 'test1', filter: { session: "5b804a0c340fea0e4dc78939" }
		// }
		// ,
		// {
		// 	title: 'Test 2', id: 'test2', filter: { session: "5b8813d430eea244ce50df8e" }
		// },
		// {
		// 	title: 'Test 3', id: 'test3', filter: { session: "5b8813df30eea244ce50df90" }
		// }
	]
	, highlights: {
		title: 'Coding Portfolio Stories'
		, url: 'https://wisenspace.squarespace.com/coding-portfolio'
		, items: [
			{
				image: 'https://static1.squarespace.com/static/5b4a72afd274cbf4debc1f3f/t/5c2820a970a6adae0b1e0655/1546133689750/IMG_4864.JPG?format=750w'
				, header: '(Coding + KrispyKream + Robotics = 2048 Donut Game) by our 6th grader'
				, description: 'Our 6th grader built the game and this is what she wrote to Krispy Kream (True Wisen Spirit- don’t just stop at taking coding classes only to learn how to build the game but go beyond the game completion and reach out to the real world like Crystal’s Krispy Kream contact! Go Crystal!)'
				, link: {
					url: 'https://wisenspace.squarespace.com/coding-portfolio-crystal-lin'
					, title: 'read more'
				}
			},{
				image: 'https://images.squarespace-cdn.com/content/v1/5b4a72afd274cbf4debc1f3f/1554757634596-7LNJGCL5XVKIKN34LTOR/ke17ZwdGBToddI8pDm48kO6t_FIigFZlD-2ukJs68NZ7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UdQnRCmyfmE32mt8hf8jTbpNOvskeoRv-ygqK_y0NLe3pygZMNSAPtQr-kV0SxGO-A/6299F58C-01A9-4FDD-B8E3-81B81B54F80B.JPG?format=750w'
				, header: 'How to publish a book using HTML (Love Coding + Panda + my dog)'
				, description: 'First, we met Ryan through the referral last fall. To be honest, Wisen got little hesitant to enroll him due to his age (3rd grade). So we set up an interview with Ryan and Ryan’s mom to assess his level (we heard he was really good already in spite of his young age such as using “GitHub”) and to meet this unusual “programmer” out of sheer curiosity.'
				, link: {
					url: 'https://wisenspace.squarespace.com/ryan-yun-publishing-a-book-using-html'
					, title: 'read more'
				}
			}
		]
	}
	, metrics: {
		title: 'Numbers'
		, items: [
			{
				metric: 'studentCount'
				, label: 'Students'
				, description: 'who have participated in our camps and classes'
			}, {
				metric: 'projectCount'
				, label: 'Projects'
				, description: 'have been created'
			}, {
				metric: 'locationCount'
				, label: 'Locations'
				, description: 'where are students can code with us'
			}, {
				metric: 'competitionCount'
				, value: 6
				, label: 'Competitions'
				, description: 'our students compete in'
			}
		]
	}
	, testimonialTitle: 'What Parents, Teachers and Students are Saying'
};

const testimonials = [
	{
		image: 'https://mrlera.wisen.space/capture/load/qdtq2gse2zfy38iwqfi6xuk-.png'
		, name: 'Fiona'
		, title: 'Wisen Parent'
		, text: 'I highly recommend Wisen Space. My son came to Wisen Space with ZERO knowledge about coding, and I am amazed with his development in only 2 terms (14weeks). My son learned how to build “Zombsroyale” and it is the game that seems every kid is playing lately. This is a really good strategy, as coding itself could be boring to the young kids. By bringing the trending project that the kids like to the class not only inspires the kids to continue learning the coding, but also kids become more creative on building their own projects. Even better, Wisen organized a presentation training class for the kids to teach them how to present the work to audience.'
	}
	, {
		image: 'https://mrlera.wisen.space/capture/load/eseyx5xxhzynjwkqgovfgp86.png'
		, name: 'Ed'
		, title: 'STEM Teacher'
		, text: `Wisen Space has created a unique coding program that features custom training tools to ensure the success of their students.  
				Their proprietary system for teaching coding challenges students and they have the talented staff to support  students every step of the way.  
				As a teacher I’m impressed that their course content is exceptionally challenging and engaging for students, and is also accessible to students regardless of their programming experience.
				I would highly recommend any parent that has a student interesting in improving their coding skills to try Wisen Space.  I believe you’ll find them as exceptional to work with as I have.`
	}
	, {
		image: 'https://mrlera.wisen.space/capture/load/vxppx2eqwufmewjwsdginqci.jpg'
		, name: 'Brandon'
		, title: 'High School Student'
		, text: `The best part about interning at Wisen Space is the flexibility of my schedule. It has allowed me to balance my hectic workload of school work and extracurricular activities, a benefit most companies wouldn’t offer. I also like seeing the work I do implemented right in front of my eyes. When I make a change to a page’s CSS or add a few functionalities to the website, I’ll see it appear almost instantly. The instant gratification is really a booster to my morale and work ethic`
	}
	, {
		image: 'https://mrlera.wisen.space/capture/load/o7-r1penq8-gs9wend7wzjs_.png'
		, name: 'Max'
		, title: 'First Year Student'
		, text: `I like Wisen camps because the teacher is very patient and knowledgeable. 
					The class is fun and I learned how to do any coding project independently`
	}, {
		image: 'https://mrlera.wisen.space/capture/load/pmjxtjne-iqohl726pxxsmt0.png'
		, name: 'Sunny'
		, title: 'Middle School Student'
		, text: `Also, for my impression on the AI/Machine Learning class and Mr. Lera, 
			I liked the way he paced the class. He stopped for all of us to catch up and understand what we had just programmed, 
			and always reused and reviewed the concepts in later classes as well. 
			This way, the concepts that we learned were engraved in our brains. 
			When I first joined the class, I had absolutely no idea on what was going on, but I eventually began to catch on after using the tools constantly.`
	}

	, {
		image: 'https://mrlera.wisen.space/uaqtew9kymqlexdemzptpdqd.png'
		, name: 'Wilson\'s Mom'
		, title: 'Wisen Parent'
		, text: `Every since he is small kid, my son Wilson Duan has been naturally good at math and anything STEM related. Computer coding became his next logical interest to expand on when he was a 7th grader. He signed up Wisen Space’s coding camps in 2017 and never looked back. Jared from Wisen kept him challenged & interested in coding. There were contests and presentations at the end of each session. Not only Wilson got to learn technical skills, but also invaluable opportunities for him to present, to improve on public speaking, to mentor younger coders and to learn leadership skills. In June 2019, Wilson gave a talk on stock investment using AI as one of the keynote speakers to the quarterly Silicon Valley Teen Tech Talk. He was provided a speaking coach and additional mentoring from Jared. As a proud parent, I can’t be more impressed with Wisen Space and highly recommend it to other students.`
	}

	, {
		image: 'https://mrlera.wisen.space/9j6mlkf2olccqrank3f9brxf.png'
		, name: 'Wilson'
		, title: 'High School Student'
		, text: `Over the last few months, I have participated in numerous wise space programs, ranging from the beginners Javascript class to the advanced AI and algorithms classes. Wisen space started my journey of Javascript and Python, giving me a foundation for anything I wanted to accomplish with code. They inspired me to further study machine learning and algorithmic coding in my free time. Wisen space provides a warm and encouraging workspace where every opinion is valued. The instructor is fun and engaging, and provides informative and new concepts each session. In addition, we are given lots of opportunities to share our work with others. Overall, wisen space has drastically changed the way I viewed computer science and shaped it into one of my hobbies. `
	}
];

const 
	start = new Promise(function(resolve, reject) {
		resolve();
	})
	, configs = Configs()
	, notify = function(err, message) {
		if(err) {
			return console.error(err)
		}
		console.log(`----------------------------------------------`)
		console.log(message)
		console.log(`----------------------------------------------\n`)
	}
;

function createLandingPage() {
	return new Promise(function(resolve, reject) {
		console.log('Looking for Landing Page')
		landerSchemas.landingPage
			.then(model => {
				console.log('Got Model')
				model
					.findOne({name: 'Wisen Space'})
					.exec((err, page) => {	
						if(err) {
							console.log(err)
							return reject(err);
						}
						if(page) {
							console.log('Page Already Created')
							return resolve();
						}
						page = new model(landingPage);
						console.log('Creating New Page');
						page.save((err) => {
							if(err) return reject(err);
							console.log('Created New Page');
							resolve();
						});
					});
			}).catch(ex => {
				console.log(ex); 
				reject(ex)
			});
	});
}

function addTestimonials() {
	return new Promise(function(resolve, reject) {
		console.log('Looking for Testimonials');
		async.each(testimonials, (testimonial, next) => {
			saver.schemaFind({
				schemaName: 'testimonial'
				, collectionName: 'Testimonial'
				, schema: educaterSchemas.testimonial
				, filter: { backupId: null, title: testimonial.title, name: testimonial.name, image: testimonial.image }
				, dbUri: educaterSchemas.dbUri
			}, null, function(err, resp) {	
				if(err) return next(err);
				if(resp && resp.length) {
					console.log('Testimonial already created')
					return next(null);
				}
				const now = new Date();
				saver.schemaSave({
					schemaName: 'testimonial'
					, collectionName: 'Testimonial'
					, schema: educaterSchemas.testimonial
					, modelData: {
						dateCreated: now
						, dateUpdated: now
						, testimonial: testimonial.text
						, image: testimonial.image
						, title: testimonial.title
						, name: testimonial.name
					}
					, dbUri: educaterSchemas.dbUri
				}, null, (err) => {
					if(err) return next(err);
					next();
				});
			})
		}, (err) => {
			if(err) return reject(err);
			resolve();
		})
	});	
}

function viewPage() {
	return new Promise(function(resolve, reject) {
		notify('Go to the landing page and check it out')
		resolve();
	});
}

start
	.then(createLandingPage)
	.then(addTestimonials)
	.then(viewPage)
	.catch(function(ex) {
		notify(ex);
		process.exit();
	})
	.then(function() {
		notify(null, 'DONE');
		process.exit();
	});