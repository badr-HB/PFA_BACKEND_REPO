import { prisma } from "../lib/prisma.js";

export const profile = async (req, res) => {

    const { id } = req.params;
    const { name, skills, available, country, bio } = req.body;
    const availability = available.toLowerCase();

    const Finduser = await prisma.user.findFirst({
        where: {
            id,
        }
    })
    if (!Finduser) {
        return res.status(400).json({ error: "user not found" })
    }

    if ((availability !== "parttime") && (availability !== "fulltime") && (availability !== "student")) {
        return res.status(401).json({
            error: "choose between FullTime or PartTime or Student",
        })
    }

    const CheckIfUserAlreadyhasProfile = await prisma.profile.findFirst({
        where: {
            userId: id
        }
    })

    if (CheckIfUserAlreadyhasProfile) {
        return res.status(400).json({ error: "this user already has profile,cancel" })
    }

    const CreateProfile = await prisma.profile.create({
        data: {
            displayname: name,
            userId: id,
            skills: skills,
            availability: availability,
            country: country,
            bio: bio,
        }
    })
    return res.status(200).json({ message: "profile created success" })
}

export const getprofile = async (req, res) => {

    const { id } = req.params;
    const getProfile = await prisma.profile.findFirst({
        where: {
            userId: id
        }
    })
    if (!getProfile) {
        return res.status(404).json({ error: "user not found" })
    }
    return res.status(200).json({ message: "your profile", "": getProfile })
}

export const updateProfile = async (req, res) => {
    const { id, profileid } = req.params;
    const { name, skills, available, country, bio } = req.body;
    let availability = 0;
    const UserUpdates = {};
    if (available === undefined) {
        availability = undefined
    }
    else { 
        availability = available.toLowerCase()
    }
    const findUser = await prisma.profile.findFirst({
        where: {
            id: profileid,
            userId: id
        }
    })
    if (!findUser) {
        return res.status(401).json({ error: "informations don't match" });
    }

    if ((availability !== "parttime") && (availability !== "fulltime") && (availability !== "student") && (availability !== undefined)) {
        return res.status(401).json({
            error: "choose between FullTime or PartTime or Student",
        })
    }
    else if (availability === undefined) {
        //store undefined value to availability here//
        UserUpdates.availability = undefined;
    }
    else if (availability !== undefined) {
        UserUpdates.availability = availability;
    }
    name !== undefined ? UserUpdates.name = name : UserUpdates.name = undefined;
    skills !== undefined ? UserUpdates.skills = skills : UserUpdates.skills = undefined;
    country !== undefined ? UserUpdates.country = country : UserUpdates.country = undefined;
    bio !== undefined ? UserUpdates.bio = bio : UserUpdates.bio = undefined;


    const UpdateUser = await prisma.profile.updateMany({
        where: {
            id: profileid
        },
        data: {
            displayname: UserUpdates.name,
            skills: UserUpdates.skills,
            availability: UserUpdates.availability,
            country: UserUpdates.country,
            bio: UserUpdates.bio
        }
    })
    return res.status(200).json({ message: "success" })
}
