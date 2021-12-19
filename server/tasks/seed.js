const admin = require("firebase-admin");
const serviceAccount = require("../firebase/cs554finalproject-53b9e-firebase-adminsdk-g4a5k-f540f6956f.json");
const { v4: uuidv4 } = require("uuid");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://cs554finalproject-53b9e.firebaseio.com",
});

async function main() {
    let seedEmployer1 = {
        displayName: "Christopher Moon",
        email: "cmoon1@stevens.edu",
        role: "employer",
        uid: "seedEmployer1"
    };

    let seedSeeker1 = {
        applications: [],
        displayName: "Edward Yaroslavsky",
        email: "eyarosla@stevens.edu",
        imageUrl: "",
        resume: "",
        role: "seeker",
        uid: "seedSeeker1"
    };

    let seedPost1 = {
        applicants: [],
        company: "Amazon",
        email: "cmoon1@stevens.edu",
        field: "Business",
        jobType: "entry_level",
        summary: "entry level business job at seed company 1",
        title: "Amazon",
        zip: "10017"
    };

    await admin.auth().createUser({
        email: seedEmployer1.email,
        password: "cpass",
        displayName: seedEmployer1.displayName,
        uid: "seedEmployer1"
    });

    await admin.auth().createUser({
        email: seedSeeker1.email,
        password: "epass",
        displayName: seedSeeker1.displayName,
        uid: "seedSeeker1"
    });

    let seedEmployer1Ref = await admin.firestore().doc(`employer/seedEmployer1`).set(seedEmployer1);
    let seedPost1Ref = await admin.firestore().doc(`posts/seedPost1`).set(seedPost1);
    let seedSeeker1Ref = await admin.firestore().doc(`seekers/seedSeeker1`).set(seedSeeker1);

    console.log("Done seeding employer/seeker 1");


    let seedEmployer2 = {
        displayName: "Mark Pipko",
        email: "mpipko@stevens.edu",
        role: "employer",
        uid: "seedEmployer2"
    };

    let seedSeeker2 = {
        applications: [],
        displayName: "Matthew Evanego",
        email: "mevanego@stevens.edu",
        imageUrl: "",
        resume: "",
        role: "seeker",
        uid: "seedSeeker2"
    };

    let seedPost2 = {
        applicants: [],
        company: "Tesla",
        email: "mpipko@stevens.edu",
        field: "Engineering & Computer Science",
        jobType: "entry_level",
        summary: "entry level business job at seed company 2",
        title: "Tesla",
        zip: "10017"
    };

    await admin.auth().createUser({
        email: seedEmployer2.email,
        password: "mppass",
        displayName: seedEmployer2.displayName,
        uid: "seedEmployer2"
    });

    await admin.auth().createUser({
        email: seedSeeker2.email,
        password: "mepass",
        displayName: seedSeeker2.displayName,
        uid: "seedSeeker2"
    });

    let seedEmployer2Ref = await admin.firestore().doc(`employer/seedEmployer2`).set(seedEmployer2);
    let seedPost2Ref = await admin.firestore().doc(`posts/seedPost2`).set(seedPost2);
    let seedSeeker2Ref = await admin.firestore().doc(`seekers/seedSeeker2`).set(seedSeeker2);

    console.log("Done seeding employer/seeker 2");


    let seedEmployer3 = {
        displayName: "Matthew Koerner",
        email: "mkoerner@stevens.edu",
        role: "employer",
        uid: "seedEmployer3"
    };

    let seedPost3 = {
        applicants: [],
        company: "Microsoft",
        email: "mkoerner@stevens.edu",
        field: "Other",
        jobType: "senior_level",
        summary: "senior level business job at seed company 3",
        title: "Microsoft",
        zip: "10017"
    };

    await admin.auth().createUser({
        email: seedEmployer3.email,
        password: "mkpass",
        displayName: seedEmployer3.displayName,
        uid: "seedEmployer3"
    });

    let seedEmployer3Ref = await admin.firestore().doc(`employer/seedEmployer3`).set(seedEmployer3);
    let seedPost3Ref = await admin.firestore().doc(`posts/seedPost3`).set(seedPost3);

    console.log("Done seeding employer 3");

    console.log("Done seeding database");
}

main();
