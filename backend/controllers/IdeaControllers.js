import { type } from "node:os";
import { prisma } from "../lib/prisma.js";

export const PostIdea = async (req, res) => {
    const id = req.user.id;
    const { title, description, category, skills, team, status, budget, maxNumber } = req.body;
    
    
    const FindUser = await prisma.user.findUnique({
        where: { id }
    })
    if (!FindUser) {
        return res.status(404).json({ error: "user not found" })
    }
    if ((status !== "open") && (status !== "closed") && (status !== "inprogress")) {
        return res.status(400).json({ error: "status either open or closed or inprogress" })
    }
    const CreatIdea = await prisma.idea.create({
        data: {
            ownerId: id,
            Title: title,
            Description: description,
            category: category,
            RequiredSkills: skills,
            peopleNeeded: team,
            status: status,
            budget: Number(budget),
            MaxNumberMembers: Number(maxNumber)
        }
    })
    return res.status(200).json({ message: "your project created successfully" })
}


export const GetIdea = async (req, res) => {
    const { id } = req.params;
    const checkifuserexists = await prisma.user.findUnique({
        where: { id }
    })

    if (!checkifuserexists) {
        return res.status(404).json({ error: "you are not logged in please login" })
    }

    const getallprojects = await prisma.idea.findMany({})
    return res.status(200).json({ message: getallprojects })
}

export const updateIdea = async (req, res) => {
    const { id, ideaid } = req.params;
    const { title, description, category, skills, team, status, budget, maxNumber } = req.body;
    const IdeaUpdates = {};
    const Numbudget = Number(budget);
    const NummaxNumber = Number(maxNumber)
   
    const findUser = await prisma.idea.findFirst({
        where: {
            id: ideaid,
            ownerId: id
        }
    })
    if (!findUser) {
        return res.status(401).json({ error: "informations don't match" });
    }

    if ((status !== "open") && (status !== "closed") && (status !== "inprogress") && (status !== undefined)) {
        return res.status(400).json({ error: "status either open or closed or inprogress" })
    }
    title !== undefined ? IdeaUpdates.title = title : IdeaUpdates.title = undefined;
    description !== undefined ? IdeaUpdates.description = description : IdeaUpdates.description = undefined;
    category !== undefined ? IdeaUpdates.category = category : IdeaUpdates.category = undefined;
    skills !== undefined ? IdeaUpdates.skills = skills : IdeaUpdates.skills = undefined;
    team !== undefined ? IdeaUpdates.team = team : IdeaUpdates.team = undefined;
    budget !== undefined ? IdeaUpdates.budget = Numbudget : IdeaUpdates.budget = undefined;
    maxNumber !== undefined ? IdeaUpdates.maxNumber = NummaxNumber : IdeaUpdates.maxNumber = undefined;
    status !== undefined ? IdeaUpdates.status = status : IdeaUpdates.status = undefined;

    const UpdateUser = await prisma.idea.updateMany({
        where: {
            id: ideaid
        },
        data: {
            Title:IdeaUpdates.title,
            Description:IdeaUpdates.description,
            category:IdeaUpdates.category,
            RequiredSkills:IdeaUpdates.skills,
            peopleNeeded:IdeaUpdates.team,
            status:IdeaUpdates.status,
            budget:IdeaUpdates.budget,
            MaxNumberMembers:IdeaUpdates.maxNumber,
        }
    })
    return res.status(200).json({ message: "success" })
}