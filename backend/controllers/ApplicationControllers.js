import { prisma } from "../lib/prisma.js"

export const SendJoinResquest = async (req, res) => {
    const { projectid } = req.params;
    const userId = req.user.id;
    const open = "open";

    const IdeaExists = await prisma.idea.findFirst({
        where: {
            id: projectid,
            status: open
        }
    })
    const UserExists = await prisma.profile.findFirst({
        where: {
            userId: userId
        }
    })

    if (!IdeaExists && !UserExists) {
        return res.status(401).json({ error: "something went wrong" })
    }



    if (IdeaExists.ownerId === userId) {
        return res.status(401).json({ error: "admin can't send requests to their projects" })
    }

    const CreateRequest = await prisma.joinrequest.create({
        data: {
            status: "pending",
            ideaId: projectid,
            userId: userId
        }
    })
    return res.status(200).json({ message: `you got a join request from ${UserExists.displayname} to the project ${IdeaExists.Title}` })
}

export const JoinRequest = async (req, res) => {
    //here admin can accept or ignore the requests
}