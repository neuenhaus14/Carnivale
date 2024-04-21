/** @type {import{'sequelize-cli'}.Migration} */
// This is exactly the same as devSeedData.js rn

const dayjs = require('dayjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        email: 'a@b.com',
        phone: '123-456-7890',
        firstName: 'Bob',
        lastName: 'Johnson',
        latitude: 29.963864,
        longitude: -90.05213,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'c@d.com',
        phone: '223-456-7890',
        firstName: 'John',
        lastName: 'Smith',
        latitude: 29.974952,
        longitude: -90.052869,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'e@f.com',
        phone: '323-456-7890',
        firstName: 'Erik',
        lastName: 'Andrews',
        latitude: 29.971376,
        longitude: -90.056863,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'g@h.com',
        phone: '323-426-7890',
        firstName: 'Sara',
        lastName: 'Hills',
        latitude: 29.971336,
        longitude: -90.056263,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'i@j.com',
        phone: '313-426-7390',
        firstName: 'Katie',
        lastName: 'Madison',
        latitude: 29.969472,
        longitude: -90.075761,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'j@k.com',
        phone: '323-426-7890',
        firstName: 'Donna',
        lastName: 'Parsons',
        latitude: 29.964229,
        longitude: -90.040224,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'y@g.com',
        phone: '231-649-2298',
        firstName: 'Devan',
        lastName: 'Gary',
        latitude: 29.968048,
        longitude: -90.051059,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
    ]);

    await queryInterface.bulkInsert('events', [
      {
        name: 'Meetup at the Friendly Bar',
        startTime: '2024-02-18T18:00',
        endTime: '2024-02-18T19:00',
        description: "Grabbing a pint for old time's sake",
        longitude: -90.05951,
        latitude: 29.963724,
        address: '2301 Chartes St., New Orleans LA 70117',
        link: null,
        system: false,
        attendingCount: 2,
        invitedCount: 2,
        upvotes: 0,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl:
          'https://www.shutterstock.com/shutterstock/photos/1930257152/display_1500/stock-photo-seven-horses-force-running-out-1930257152.jpg',
      },
      {
        name: 'DJ set at PvF Marker',
        startTime: '2023-12-24T21:00',
        endTime: '2023-12-24T22:00',
        description: 'Hot tracks by the tracks',
        longitude: -90.048717,
        latitude: 29.964642,
        address: null,
        link: null,
        system: false,
        attendingCount: 3,
        invitedCount: 1,
        upvotes: 0,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Boil',
        startTime: '2023-12-24T14:00',
        endTime: '2023-12-24T15:00',
        description: 'Parade pregame',
        longitude: -90.052452,
        latitude: 29.964846,
        address: null,
        link: null,
        system: false,
        attendingCount: 3,
        invitedCount: 0,
        upvotes: 0,
        ownerId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Garage Sale',
        startTime: '2024-01-24T14:00',
        endTime: '2024-01-24T15:00',
        description: 'Help me find gifts for my Aunt Patty.',
        longitude: -90.052452,
        latitude: 29.964846,
        address: null,
        link: null,
        system: false,
        attendingCount: 0,
        invitedCount: 1,
        upvotes: 0,
        ownerId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('join_user_events', [
      {
        eventId: 1,
        userId: 1,
        senderId: 2,
        isAttending: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 2,
        userId: 1,
        senderId: 2,
        isAttending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 2,
        userId: 2,
        senderId: 2,
        isAttending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 2,
        userId: 1,
        senderId: 2,
        isAttending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 2,
        userId: 3,
        senderId: 2,
        isAttending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 3,
        userId: 1,
        senderId: 3,
        isAttending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 3,
        userId: 2,
        senderId: 3,
        isAttending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 3,
        userId: 3,
        senderId: 3,
        isAttending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 1,
        userId: 3,
        senderId: 1,
        isAttending: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 1,
        userId: 7,
        senderId: 1,
        isAttending: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 4,
        userId: 7,
        senderId: 6,
        isAttending: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('pins', [
      {
        // free toilet
        longitude: -90.053271,
        latitude: 29.962828,
        isToilet: false,
        isFood: false,
        isPersonal: false,
        isFree: true,
        isPhoneCharger: false,
        isPoliceStation: false,
        isEMTStation: false,
        upvotes: 1,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        // $3 toilent
        longitude: -90.051899,
        latitude: 29.963333,
        isToilet: true,
        isFood: false,
        isPersonal: false,
        isFree: false,
        isPhoneCharger: false,
        isPoliceStation: false,
        isEMTStation: false,
        upvotes: 0,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        // # 3, food
        longitude: -90.050777,
        latitude: 29.9636,
        isToilet: false,
        isFood: true,
        isPersonal: false,
        isFree: false,
        isPhoneCharger: false,
        isPoliceStation: false,
        isEMTStation: false,
        upvotes: 0,
        ownerId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        // # 4, personal
        longitude: -90.056035,
        latitude: 29.961779,
        isToilet: false,
        isFood: false,
        isPersonal: true,
        isFree: false,
        isPhoneCharger: false,
        isPoliceStation: false,
        isEMTStation: false,
        upvotes: 0,
        ownerId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        // # 5, emt
        longitude: -90.05671,
        latitude: 29.965501,
        isToilet: false,
        isFood: false,
        isPersonal: false,
        isFree: false,
        isPhoneCharger: false,
        isPoliceStation: false,
        isEMTStation: true,
        upvotes: 0,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        // # 6, phone charger
        longitude: -90.05198,
        latitude: 29.966916,
        isToilet: false,
        isFood: false,
        isPersonal: false,
        isFree: false,
        isPhoneCharger: true,
        isPoliceStation: false,
        isEMTStation: false,
        upvotes: 0,
        ownerId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        // # 7, police
        longitude: -90.056241,
        latitude: 29.963603,
        isToilet: false,
        isFood: false,
        isPersonal: false,
        isFree: false,
        isPhoneCharger: false,
        isPoliceStation: true,
        isEMTStation: false,
        upvotes: 0,
        ownerId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('join_pin_votes', [
      {
        isUpvoted: true,
        voter_userId: 2,
        pinId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: true,
        voter_userId: 1,
        pinId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: false,
        voter_userId: 3,
        pinId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('photos', [
      {
        // PINS
        // 1: Free toilet pin
        longitude: -90.053271,
        latitude: 29.962828,
        description: 'A free toilet!',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/yfpo9qrachrpizrgkt47.jpg',
        isCostume: false,
        isThrow: false,
        isPin: true,
        upvotes: 1,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        // 2: $ toilet pin
        longitude: -90.051899,
        latitude: 29.963333,
        description: '$3 dollars per use! Nice and clean!',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/ebsvvw2yy75mgdszogzl.jpg',
        isCostume: false,
        isThrow: false,
        isPin: true,
        upvotes: 0,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        // 3: Food pin
        longitude: -90.050777,
        latitude: 29.9636,
        description: 'Hot sausage in da house. $10 ftw!',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/ktpl4konvtsxeuy3mgi8.jpg',
        isCostume: false,
        isThrow: false,
        isPin: true,
        upvotes: 0,
        ownerId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        // 4: Food pin update
        longitude: -90.050777,
        latitude: 29.9636,
        description: 'Not so fast! Now a long line for po boys!',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/z84caqng7omrheoqksrw.jpg',
        isCostume: false,
        isThrow: false,
        isPin: true,
        upvotes: 1,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        // 5: Personal Pin
        longitude: -90.056035,
        latitude: 29.961779,
        description: 'Left bike here!',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/yrzmn9ssn6ysrnripdue.jpg',
        isCostume: false,
        isThrow: false,
        isPin: true,
        upvotes: 0,
        ownerId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        // 6: Police pin
        longitude: -90.056241,
        latitude: 29.963603,
        description: "Hot fuzz, 6 o'clock (that means they're behind you).",
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/u3vgjan0n7ufckqbh7tt.jpg',
        isCostume: false,
        isThrow: false,
        isPin: true,
        upvotes: 2,
        ownerId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        // 7: EMT pin
        longitude: -90.05671,
        latitude: 29.965501,
        description: 'Emt if you need a helping hand',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/oh8ugtya4ykz6d0ysl32.jpg',
        isCostume: false,
        isThrow: false,
        isPin: true,
        upvotes: 7,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        // 8: Phone charger pin
        longitude: -90.05198,
        latitude: 29.966916,
        description: 'Phone charger if ur outta juice',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/dubvno2a2fr1ncbzeazk.jpg',
        isCostume: false,
        isThrow: false,
        isPin: true,
        upvotes: 3,
        ownerId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        // THROW POSTS
        // 12
        longitude: -90.055155,
        latitude: 29.963277,
        description: 'Oh yeah! Thank you, Muses',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/krwwlsqiiwlu8ujyt8zk.jpg',
        isCostume: false,
        isThrow: true,
        isPin: false,
        upvotes: 1,
        ownerId: 4,
        createdAt: dayjs().subtract(1, 'hour').toDate(),
        updatedAt: dayjs().subtract(1, 'hour').toDate(),
      },
      {
        // 14
        longitude: -90.051234,
        latitude: 29.963765,
        description: 'Uggh more beaadddszzz 😭 Wahhh',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/t9fdgexvifjlzqpbcaa7.jpg',
        isCostume: false,
        isThrow: true,
        isPin: false,
        upvotes: -4,
        ownerId: 6,
        createdAt: dayjs().subtract(2, 'hour').toDate(),
        updatedAt: dayjs().subtract(2, 'hour').toDate(),
      },
      {
        // 13
        longitude: -90.055144,
        latitude: 29.963244,
        description: 'Check out what I got at Zulu!',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/z4ips6rseyeyydt0zgix.jpg',
        isCostume: false,
        isThrow: true,
        isPin: false,
        upvotes: 5,
        ownerId: 1,
        createdAt: dayjs().subtract(3, 'hour').toDate(),
        updatedAt: dayjs().subtract(3, 'hour').toDate(),
      },
      {
        // 14
        longitude: -90.351234,
        latitude: 29.463765,
        description: 'Got the coco and then some!',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_auto,w_600,h_450/v1711482207/Zulu_100th_Anniversary_15_xntzvm.jpg',
        isCostume: false,
        isThrow: true,
        isPin: false,
        upvotes: 0,
        ownerId: 5,
        createdAt: dayjs().subtract(4, 'hour').toDate(),
        updatedAt: dayjs().subtract(4, 'hour').toDate(),
      },
      {
        // 14
        longitude: -90.231234,
        latitude: 29.763765,
        description: 'Doubloonies from Rex',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_auto,w_600,h_450/v1711482224/Mardi_Gras_doubloons_oi4tw8.jpg',
        isCostume: false,
        isThrow: true,
        isPin: false,
        upvotes: 3,
        ownerId: 7,
        createdAt: dayjs().subtract(5, 'hour').toDate(),
        updatedAt: dayjs().subtract(5, 'hour').toDate(),
      },
      {
        // 14
        longitude: -90.661234,
        latitude: 29.343765,
        description: "If you don't catch it, the ground will...",
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_auto,w_600,h_450/v1711482191/Throw_me_some_beads_mister_vkxo1p.jpg',
        isCostume: false,
        isThrow: true,
        isPin: false,
        upvotes: 3,
        ownerId: 6,
        createdAt: dayjs().subtract(6, 'hour').toDate(),
        updatedAt: dayjs().subtract(6, 'hour').toDate(),
      },

      {
        // GOSSIP POSTS
        // 15
        longitude: -90.055432,
        latitude: 29.963234,
        description: 'All hail Doctor Oz!',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/petewb3zjwanwibxffsk.jpg',
        isCostume: false,
        isThrow: false,
        isPin: false,
        upvotes: 5,
        ownerId: 5,
        createdAt: dayjs().subtract(1, 'hour').toDate(),
        updatedAt: dayjs().subtract(1, 'hour').toDate(),
      },
      {
        // 16
        longitude: -90.051334,
        latitude: 29.963165,
        description: '🥁 Drumline woooo!',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/r2dlbdsnrc6tj5a1r7ax.jpg',
        isCostume: false,
        isThrow: false,
        isPin: false,
        upvotes: 7,
        ownerId: 4,
        createdAt: dayjs().subtract(3, 'hour').toDate(),
        updatedAt: dayjs().subtract(3, 'hour').toDate(),
      },
      {
        // 17
        longitude: -90.051314,
        latitude: 29.914165,
        description: "Big floats a-comin'!",
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_auto,g_center,h_450,w_600/v1710963573/Carnivale/IMG_0398_u69pwb.jpg',
        isCostume: false,
        isThrow: false,
        isPin: false,
        upvotes: 0,
        ownerId: 2,
        createdAt: dayjs().subtract(5, 'hour').toDate(),
        updatedAt: dayjs().subtract(5, 'hour').toDate(),
      },
      {
        // 18
        longitude: -90.251314,
        latitude: 29.124165,
        description: 'The Eagle Lady arrives',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_crop,g_north,h_450,w_600/v1710963556/Carnivale/IMG_0400_ibvlzo.jpg',
        isCostume: false,
        isThrow: false,
        isPin: false,
        upvotes: 1,
        ownerId: 2,
        createdAt: dayjs().subtract(7, 'hour').toDate(),
        updatedAt: dayjs().subtract(7, 'hour').toDate(),
      },
      {
        // 19
        longitude: -90.251314,
        latitude: 29.124165,
        description: "Wild boar poboy y'all! A bit gamey, tbh...",
        // photoURL:
        //   'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_auto,g_north_west,h_450,w_600/v1710963594/Carnivale/IMG_6029_xevprr.jpg',
        photoURL: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Oak_Street_Po-Boy_Fest_New_Orleans_2016_41.jpg',
        isCostume: false,
        isThrow: false,
        isPin: false,
        upvotes: 10,
        ownerId: 2,
        createdAt: dayjs().subtract(9, 'minute').toDate(),
        updatedAt: dayjs().subtract(9, 'minute').toDate(),
      },
      {
        // 19
        longitude: -90.251314,
        latitude: 29.124165,
        description: 'Go Saints!!!',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_limit,w_601,h_600/v1710963574/Carnivale/IMG_6107_gnrtou.jpg',
        isCostume: false,
        isThrow: false,
        isPin: false,
        upvotes: 7,
        ownerId: 4,
        createdAt: dayjs().subtract(13, 'hour').toDate(),
        updatedAt: dayjs().subtract(13, 'hour').toDate(),
      },

      // COSTUME POSTS
      {
        // 20
        longitude: -90.045132,
        latitude: 29.973645,
        description: 'I, like, just woke up.',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_auto,h_800,w_450/v1711477556/Easter_Sunday_in_New_Orleans_French_Quarter_2018_10_fywoy8.jpg',
        isCostume: true,
        isThrow: false,
        isPin: false,
        upvotes: 1,
        ownerId: 4,
        createdAt: dayjs().subtract(10, 'minute').toDate(),
        updatedAt: dayjs().subtract(10, 'minute').toDate(),
      },
      {
        // 20
        longitude: -90.025132,
        latitude: 29.933645,
        description: "They're auditioning for Hamlet after this.",
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_auto,h_450,w_800/v1711474457/Lady_in_Mardi_Gras_costume_vnwiip.jpg',
        isCostume: true,
        isThrow: false,
        isPin: false,
        upvotes: 1,
        ownerId: 4,
        createdAt: dayjs().subtract(30, 'minute').toDate(),
        updatedAt: dayjs().subtract(30, 'minute').toDate(),
      },
      {
        // 21
        longitude: -90.345132,
        latitude: 29.964645,
        description: 'Only one of us likes chess.',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_auto,h_450,w_800/v1711474419/FQMG07CowgirlHoopers_hg5bpd.jpg',
        isCostume: true,
        isThrow: false,
        isPin: false,
        upvotes: 1,
        ownerId: 6,
        createdAt: dayjs().subtract(35, 'minute').toDate(),
        updatedAt: dayjs().subtract(35, 'miunute').toDate(),
      },
      {
        // 20
        longitude: -90.425132,
        latitude: 29.923645,
        description: 'Single and ready to eat Pringles.',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_auto,h_800,w_450,g_north_west/v1711478074/Black_and_red_Costumes_Mardi_Gras_in_Jackson_Square_iguimp.jpg',
        isCostume: true,
        isThrow: false,
        isPin: false,
        upvotes: 3,
        ownerId: 7,
        createdAt: dayjs().subtract(40, 'minute').toDate(),
        updatedAt: dayjs().subtract(40, 'minute').toDate(),
      },

      {
        // 20
        longitude: -90.045132,
        latitude: 29.973645,
        description: 'I come in peace!',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_auto,g_west,h_800,w_600/v1711474408/Carnival_Fat_Tuesday_costumes_Robot_Silver_Bunny_i5sasf.jpg',
        isCostume: true,
        isThrow: false,
        isPin: false,
        upvotes: 4,
        ownerId: 1,
        createdAt: dayjs().subtract(2, 'hour').toDate(),
        updatedAt: dayjs().subtract(2, 'hour').toDate(),
      },
      {
        // 21
        longitude: -90.765132,
        latitude: 29.534645,
        description: "It's 'X-People' or 'X-Folks', alright? #Title9",
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_auto,h_450,w_800/v1711474394/Mardi_Gras_Day_-_Bourbon_-_costumes_-_XXX-Men_e5oz29.jpg',
        isCostume: true,
        isThrow: false,
        isPin: false,
        upvotes: 5,
        ownerId: 5,
        createdAt: dayjs().subtract(3, 'hour').toDate(),
        updatedAt: dayjs().subtract(3, 'hour').toDate(),
      },

      {
        // 9
        longitude: -90.055109,
        latitude: 29.963299,
        description: 'Dear me!',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_auto,h_450,w_800/v1706028911/Carnivale/ndhf9ymjk2dmilprjgst.jpg',
        isCostume: true,
        isThrow: false,
        isPin: false,
        upvotes: 1,
        ownerId: 3,
        createdAt: dayjs().subtract(4, 'hour').toDate(),
        updatedAt: dayjs().subtract(4, 'hour').toDate(),
      },
      {
        // 11
        longitude: -90.051234,
        latitude: 29.963765,
        description: 'Motley Crew in the FQ',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/wkkc6ixqekszbjbolslu.jpg',
        isCostume: true,
        isThrow: false,
        isPin: false,
        upvotes: 3,
        ownerId: 2,
        createdAt: dayjs().subtract(5, 'hour').toDate(),
        updatedAt: dayjs().subtract(5, 'hour').toDate(),
      },

      {
        // 20
        longitude: -90.425132,
        latitude: 29.923645,
        description: "❤️ Livin' my best life! ❤️",
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_auto,h_800,w_450,g_south_east/v1711478679/Mardi_Gras_in_New_Orleans_2017-02-28_French_Quarter_dlm9ot.jpg',
        isCostume: true,
        isThrow: false,
        isPin: false,
        upvotes: 2,
        ownerId: 3,
        createdAt: dayjs().subtract(6, 'hour').toDate(),
        updatedAt: dayjs().subtract(6, 'hour').toDate(),
      },

      {
        // 10
        longitude: -90.055132,
        latitude: 29.963645,
        description: 'Space vikings skol!',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/ucpmdxbhujyrqzpjxml2.jpg',
        isCostume: true,
        isThrow: false,
        isPin: false,
        upvotes: 1,
        ownerId: 4,
        createdAt: dayjs().subtract(7, 'hour').toDate(),
        updatedAt: dayjs().subtract(7, 'hour').toDate(),
      },
    ]);

    await queryInterface.bulkInsert('join_photo_votes', [
      {
        isUpvoted: true,
        voter_userId: 2,
        photoId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: true,
        voter_userId: 1,
        photoId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: true,
        voter_userId: 2,
        photoId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: true,
        voter_userId: 3,
        photoId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: false,
        voter_userId: 2,
        photoId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: false,
        voter_userId: 3,
        photoId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: false,
        voter_userId: 4,
        photoId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: false,
        voter_userId: 5,
        photoId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('join_pin_photos', [
      {
        //1
        photoId: 1,
        pinId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        //2
        photoId: 2,
        pinId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        //3
        photoId: 3,
        pinId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        //4
        photoId: 4,
        pinId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        //5
        photoId: 5,
        pinId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        //6
        photoId: 14,
        pinId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        //7
        photoId: 15,
        pinId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        //7
        photoId: 16,
        pinId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('comments', [
      {
        comment:
          '🆘! Anybody got a bathroom by Royal & Spain? Drop a pin already 📍📍📍',
        upvotes: 5,
        ownerId: 5,
        createdAt: dayjs().toDate(),
        updatedAt: dayjs().toDate(),
      },
      {
        comment:
          'Cannot wait to see the satire at KdV, hope the weather holds up ⚡',
        upvotes: 2,
        ownerId: 1,
        createdAt: dayjs().subtract(2, 'hour').toDate(),
        updatedAt: dayjs().subtract(2, 'hour').toDate(),
      },
      {
        comment:
          '🔥Police razor scooter is on fire!🔥 Passersby putting it out with their drinks!',
        upvotes: 1,
        ownerId: 2,
        createdAt: dayjs().subtract(4, 'hour').toDate(),
        updatedAt: dayjs().subtract(4, 'hour').toDate(),
      },
      {
        comment:
          'Was that Morgus the Magnificent in a costume at Chewbacchus??? 🦦',
        upvotes: 1,
        ownerId: 3,
        createdAt: dayjs().subtract(6, 'hour').toDate(),
        updatedAt: dayjs().subtract(6, 'hour').toDate(),
      },
      {
        comment:
          '🫣 I think I just saw that guy from the Bachelorette outside R bar...',
        upvotes: 3,
        ownerId: 4,
        createdAt: dayjs().subtract(8, 'hour').toDate(),
        updatedAt: dayjs().subtract(8, 'hour').toDate(),
      },
      {
        comment: "The sun is shining, and I'm already peeling like an 🍊",
        upvotes: 1,
        ownerId: 3,
        createdAt: dayjs().subtract(10, 'hour').toDate(),
        updatedAt: dayjs().subtract(10, 'hour').toDate(),
      },
      {
        comment: 'Where should I get some food? Somebody drop a good pin!',
        upvotes: 0,
        ownerId: 2,
        createdAt: dayjs().subtract(12, 'hour').toDate(),
        updatedAt: dayjs().subtract(12, 'hour').toDate(),
      },

      {
        comment: 'Where can I buy a ticket to Mardi Gras?',
        upvotes: -4,
        ownerId: 6,
        createdAt: dayjs().subtract(16, 'hour').toDate(),
        updatedAt: dayjs().subtract(16, 'hour').toDate(),
      },
    ]);

    await queryInterface.bulkInsert('join_comment_votes', [
      {
        isUpvoted: true, // true is upvote, false is downvote
        voter_userId: 1,
        commentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: true,
        voter_userId: 2,
        commentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: false,
        voter_userId: 1,
        commentId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: true,
        voter_userId: 2,
        commentId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: true,
        voter_userId: 1,
        commentId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: false,
        voter_userId: 3,
        commentId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: false,
        voter_userId: 2,
        commentId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: false,
        voter_userId: 3,
        commentId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: false,
        voter_userId: 4,
        commentId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: false,
        voter_userId: 5,
        commentId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('join_friends', [
      {
        requester_userId: 5,
        recipient_userId: 7,
        isConfirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        requester_userId: 6,
        recipient_userId: 7,
        isConfirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        requester_userId: 4,
        recipient_userId: 7,
        isConfirmed: true, // null indicates the request is pending (may need to change this if null can't be fetched)
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        requester_userId: 2,
        recipient_userId: 7,
        isConfirmed: null, // open request
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        requester_userId: 1,
        recipient_userId: 2,
        isConfirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        requester_userId: 1,
        recipient_userId: 3,
        isConfirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        requester_userId: 1,
        recipient_userId: 6,
        isConfirmed: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('join_shared_posts', [
      {
        sender_userId: 2,
        recipient_userId: 1,
        shared_commentId: null,
        shared_pinId: null,
        shared_photoId: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sender_userId: 5,
        recipient_userId: 1,
        shared_commentId: 3,
        shared_pinId: null,
        shared_photoId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sender_userId: 6,
        recipient_userId: 1,
        shared_commentId: 8,
        shared_pinId: null,
        shared_photoId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('');
  },
};
